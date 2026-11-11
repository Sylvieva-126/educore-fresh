/**
 * AD14 — Build the weekly timetable (View). Day sections with one row per
 * period; tapping a period opens the subject sheet, then the teacher sheet.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import { SecondaryButton } from './AdminHomeView';
import { TimetableBuilderPresenter } from '../../presenters/TimetableBuilderPresenter';
import { TimetableModel, AcademicStructureModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIOD_TIMES = [
  '08:00 – 08:40', '08:45 – 09:25', '09:30 – 10:10',
  '10:40 – 11:20', '11:25 – 12:05', '12:10 – 12:50',
];

export default function TimetableBuilderView({ navigation, route }) {
  const [presenter] = useState(() => new TimetableBuilderPresenter(TimetableModel, AcademicStructureModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState(null); // { day, period }
  const [pendingSubject, setPendingSubject] = useState(null);
  const [subjectSheet, setSubjectSheet] = useState(false);
  const [teacherSheet, setTeacherSheet] = useState(false);
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

  // Guard refusals (already published, incomplete draft…) pop up.
  useActionErrorAlert(state.errorText);

  const draft = state.draft;
  const filledCount = draft ? draft.slots.filter((s) => s.subject).length : 0;

  const onSlotPress = (day, period) => {
    setPendingSlot({ day, period });
    setSubjectSheet(true);
  };

  const onSubjectPicked = (subject) => {
    setPendingSubject(subject);
    setSubjectSheet(false);
    setTeacherSheet(true);
  };

  const onTeacherPicked = (teacherName) => {
    setTeacherSheet(false);
    if (pendingSlot && pendingSubject) {
      presenter.fillSlot(pendingSlot.day, pendingSlot.period, pendingSubject, teacherName);
    }
    setPendingSlot(null);
    setPendingSubject(null);
  };

  return (
    <AdminScaffold
      eyebrow="Academics"
      title={draft ? `Timetable — ${draft.classLabel}` : 'Build the weekly timetable'}
      subtitle={
        draft
          ? `${filledCount}/30 periods filled · ${draft.status}`
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

          {DAYS.map((day) => (
            <View key={day}>
              <Text style={styles.section}>{day}</Text>
              <RecordList
                items={PERIOD_TIMES.map((time, i) => {
                  const slot = draft.slots.find((s) => s.day === day && s.period === i + 1);
                  return {
                    id: `${day}-${i + 1}`,
                    title: `Period ${i + 1} · ${time}`,
                    meta: slot && slot.subject ? `${slot.subject} · ${slot.teacherName}` : 'Empty — tap to fill',
                    status: slot && slot.subject ? 'Filled' : 'Empty',
                    raw: slot,
                  };
                })}
                onPressItem={(row) => onSlotPress(row.raw.day, row.raw.period)}
                emptyText=""
              />
            </View>
          ))}

          <SecondaryButton
            label={state.sendingReview ? 'Sending…' : 'Send for review'}
            disabled={state.sendingReview || draft.status === 'Published'}
            onPress={() => presenter.sendForReview()}
          />
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
        label={`${pendingSlot ? `${pendingSlot.day}, period ${pendingSlot.period}` : 'Period'} — which subject?`}
        options={state.subjects.map((s) => ({ label: s.name, value: s.name }))}
        onSelect={onSubjectPicked}
        onClose={() => setSubjectSheet(false)}
      />
      <SelectSheet
        visible={teacherSheet}
        label={`${pendingSubject || 'The subject'} — which teacher?`}
        options={state.teachers.map((t) => ({ label: t.fullName, value: t.fullName }))}
        onSelect={onTeacherPicked}
        onClose={() => setTeacherSheet(false)}
      />
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  publishedNote: { ...typography.label, color: colors.muted, marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
});
