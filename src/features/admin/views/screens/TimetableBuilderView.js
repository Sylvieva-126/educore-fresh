/**
 * AD14 — Build the weekly timetable (View). Day sections with one row per
 * period. Tapping a period opens a menu: fill it (subject or activity),
 * change its subject or its time, or remove it. "+ Add a period" appends a
 * fresh one to a day. A period's teacher must be the subject's assigned one.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { TimetableBuilderPresenter } from '../../presenters/TimetableBuilderPresenter';
import { TimetableModel, AcademicStructureModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ACTIVITIES = ['Break', 'Sports / PE', 'Study Time', 'Assembly', 'Clubs & Societies'].map(
  (a) => ({ label: a, value: a }),
);

export default function TimetableBuilderView({ navigation, route }) {
  const [presenter] = useState(() => new TimetableBuilderPresenter(TimetableModel, AcademicStructureModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState(null); // { day, period } — an existing period
  const [addDay, setAddDay] = useState(null); // a day to append a brand-new period to
  const [pendingSubject, setPendingSubject] = useState(null);
  const [subjectSheet, setSubjectSheet] = useState(false);
  const [teacherSheet, setTeacherSheet] = useState(false);
  const [activitySheet, setActivitySheet] = useState(false);
  const [timeTarget, setTimeTarget] = useState(null); // { day, period, value }
  const initialClassId = route.params && route.params.classId;

  useEffect(() => {
    presenter.attach(setState, navigation);
    if (initialClassId) presenter.openForClass(initialClassId);
    else {
      presenter.pickClass();
      setPickerOpen(true);
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (loadedOnce.current && state.draft) presenter.openForClass(state.draft.classLabel);
      loadedOnce.current = true;
    });
    return () => {
      unsubscribe?.remove?.();
      presenter.detach();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenter, navigation, initialClassId]);

  // Guard refusals (already published, mismatched teacher…) pop up.
  useActionErrorAlert(state.errorText);

  const draft = state.draft;
  const filledCount = draft
    ? draft.slots.filter((s) => s.subject || s.activity).length
    : 0;

  const openTimeEditor = (slot) => {
    setTimeTarget({ day: slot.day, period: slot.period, value: slot.time || '' });
  };

  const onSlotPress = (slot) => {
    if (!slot) return;
    if (slot.subject) {
      Alert.alert(`Period ${slot.period} — ${slot.subject}`, 'What do you want to change?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove period',
          style: 'destructive',
          onPress: () => presenter.removeSlot(slot.day, slot.period),
        },
        { text: 'Change time', onPress: () => openTimeEditor(slot) },
        {
          text: 'Change subject',
          onPress: () => {
            setPendingSlot({ day: slot.day, period: slot.period });
            setSubjectSheet(true);
          },
        },
      ]);
      return;
    }
    if (slot.activity) {
      Alert.alert(`Period ${slot.period} — ${slot.activity}`, 'What do you want to change?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove period',
          style: 'destructive',
          onPress: () => presenter.removeSlot(slot.day, slot.period),
        },
        { text: 'Change time', onPress: () => openTimeEditor(slot) },
      ]);
      return;
    }
    Alert.alert(
      `${slot.day}, period ${slot.period} · ${slot.time} is empty`,
      'Fill it with what?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change time', onPress: () => openTimeEditor(slot) },
        {
          text: 'Activity',
          onPress: () => {
            setPendingSlot({ day: slot.day, period: slot.period });
            setActivitySheet(true);
          },
        },
        {
          text: 'Subject',
          onPress: () => {
            setPendingSlot({ day: slot.day, period: slot.period });
            setSubjectSheet(true);
          },
        },
      ],
    );
  };

  const onSubjectPicked = (subject) => {
    setPendingSubject(subject);
    setSubjectSheet(false);
    // Rule: a period's teacher must be the subject's assigned teacher.
    const hasTeacher = state.teachers.some((t) => (t.subjects || []).includes(subject));
    if (!hasTeacher) {
      setPendingSlot(null);
      setAddDay(null);
      setPendingSubject(null);
      Alert.alert(
        'No teacher assigned',
        `No active teacher is assigned to ${subject} yet — open "Classes, subjects and departments", tap the subject and assign a teacher, or pick another subject.`,
      );
      return;
    }
    setTeacherSheet(true);
  };

  const onTeacherPicked = (teacherName) => {
    setTeacherSheet(false);
    if (pendingSlot && pendingSubject) {
      presenter.fillSlot(pendingSlot.day, pendingSlot.period, pendingSubject, teacherName);
    } else if (addDay && pendingSubject) {
      presenter.appendSlot(addDay, { subject: pendingSubject, teacherName });
    }
    setPendingSlot(null);
    setAddDay(null);
    setPendingSubject(null);
  };

  const onActivityPicked = (activity) => {
    setActivitySheet(false);
    if (pendingSlot) {
      presenter.fillActivity(pendingSlot.day, pendingSlot.period, activity);
    } else if (addDay) {
      presenter.appendSlot(addDay, { activity });
    }
    setPendingSlot(null);
    setAddDay(null);
  };

  const onSaveTime = () => {
    const value = ((timeTarget && timeTarget.value) || '').trim();
    if (!value) {
      setTimeTarget(null);
      Alert.alert('Enter a time', 'Type the period time first — e.g. 08:00 – 08:40.');
      return;
    }
    presenter.setTime(timeTarget.day, timeTarget.period, value);
    setTimeTarget(null);
  };

  return (
    <AdminScaffold
      eyebrow="Academics"
      title={draft ? `Timetable — ${draft.classLabel}` : 'Build the weekly timetable'}
      subtitle={
        draft
          ? `${filledCount}/${draft.slots.length} periods filled · ${draft.status}`
          : 'Choose a class to build its week'
      }
    >
      {state.status === 'loading' ? <LoadingView label="Opening the timetable…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' && draft ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
          {draft.status === 'Published' ? (
            <Text style={styles.publishedNote}>
              This timetable is published — reopen it from the review page before editing.
            </Text>
          ) : null}

          {DAYS.map((day) => {
            const daySlots = draft.slots
              .filter((s) => s.day === day)
              .sort((a, b) => a.period - b.period);
            return (
              <View key={day}>
                <Text style={styles.section}>{day}</Text>
                <RecordList
                  items={daySlots.map((slot) => ({
                    id: `${day}-${slot.period}`,
                    title: `Period ${slot.period} · ${slot.time}`,
                    meta: slot.activity
                      ? `${slot.activity} — no teacher needed`
                      : slot.subject
                        ? `${slot.subject} · ${slot.teacherName}`
                        : 'Empty — tap for options',
                    status: slot.activity ? 'Activity' : slot.subject ? 'Filled' : 'Empty',
                    raw: slot,
                  }))}
                  onPressItem={(row) => onSlotPress(row.raw)}
                  emptyText=""
                />
                {daySlots.length < 8 && draft.status !== 'Published' ? (
                  <SecondaryButton
                    label={`+ Add a period on ${day}`}
                    disabled={state.saving}
                    onPress={() => {
                      Alert.alert(`Add a period on ${day}`, 'What kind of period?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Activity',
                          onPress: () => {
                            setAddDay(day);
                            setActivitySheet(true);
                          },
                        },
                        {
                          text: 'Teaching period',
                          onPress: () => {
                            setAddDay(day);
                            setSubjectSheet(true);
                          },
                        },
                      ]);
                    }}
                  />
                ) : null}
              </View>
            );
          })}

          {/* Breathing room so "Send for review" never touches the last day's add button. */}
          <View style={styles.actions}>
            <SecondaryButton
              label={state.sendingReview ? 'Sending…' : 'Send for review'}
              disabled={state.sendingReview || draft.status === 'Published'}
              onPress={() => presenter.sendForReview()}
            />
          </View>
        </View>
      ) : null}

      <SelectSheet
        visible={pickerOpen && state.status === 'picking'}
        label="Which class timetable?"
        options={state.classOptions.map((c) => ({ label: c.classLabel, value: c.classLabel }))}
        onSelect={(value) => {
          setPickerOpen(false);
          presenter.openForClass(value);
        }}
        onClose={() => setPickerOpen(false)}
      />
      <SelectSheet
        visible={subjectSheet}
        label={
          pendingSlot
            ? `${pendingSlot.day}, period ${pendingSlot.period} — which subject?`
            : addDay
              ? `New period on ${addDay} — which subject?`
              : 'Which subject?'
        }
        options={state.subjects.map((s) => ({
          label:
            draft && s.classes.includes(draft.classLabel)
              ? s.name
              : `${s.name} — not assigned to ${draft ? draft.classLabel : 'this class'}`,
          value: s.name,
        }))}
        onSelect={onSubjectPicked}
        onClose={() => setSubjectSheet(false)}
      />
      <SelectSheet
        visible={teacherSheet}
        label={`${pendingSubject || 'The subject'} — its assigned teacher`}
        options={state.teachers
          .filter((t) => (t.subjects || []).includes(pendingSubject))
          .map((t) => ({ label: t.fullName, value: t.fullName }))}
        onSelect={onTeacherPicked}
        onClose={() => setTeacherSheet(false)}
      />
      <SelectSheet
        visible={activitySheet}
        label={
          pendingSlot
            ? `${pendingSlot.day}, period ${pendingSlot.period} — which activity?`
            : addDay
              ? `New period on ${addDay} — which activity?`
              : 'Which activity?'
        }
        options={ACTIVITIES}
        onSelect={onActivityPicked}
        onClose={() => setActivitySheet(false)}
      />

      <Modal
        visible={Boolean(timeTarget)}
        transparent
        animationType="fade"
        onRequestClose={() => setTimeTarget(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Period time</Text>
            <Text style={styles.modalHint}>
              Any format the school uses — the default periods ship as 08:00 – 08:40 etc.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={timeTarget ? timeTarget.value : ''}
              onChangeText={(t) => setTimeTarget((prev) => ({ ...prev, value: t }))}
              placeholder="e.g. 08:00 – 08:40"
              placeholderTextColor={colors.muted}
              autoFocus
            />
            <View style={styles.modalActions}>
              <SecondaryButton label="Cancel" onPress={() => setTimeTarget(null)} />
              <PrimaryButton label="Save time" onPress={onSaveTime} />
            </View>
          </View>
        </View>
      </Modal>
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  publishedNote: { ...typography.label, color: colors.muted, marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  actions: { marginTop: spacing.md },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.surface || '#fff',
    borderRadius: 14,
    padding: spacing.md,
    width: '100%',
  },
  modalTitle: { ...typography.sectionTitle, marginBottom: spacing.xs },
  modalHint: { ...typography.label, color: colors.muted, marginBottom: spacing.sm },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...typography.body,
    marginBottom: spacing.sm,
  },
  modalActions: { flexDirection: 'row', gap: spacing.sm },
});
