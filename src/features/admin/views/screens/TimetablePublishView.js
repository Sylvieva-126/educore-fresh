/**
 * AD15 — Review and publish the timetable (View). Drafts list → read-only
 * week view with Validate + Publish; published drafts show their badge.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, ErrorState, EmptyState, useActionErrorAlert } from '../components/FeedbackViews';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { TimetablePublishPresenter } from '../../presenters/TimetablePublishPresenter';
import { TimetableModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIOD_TIMES = [
  '08:00 – 08:40', '08:45 – 09:25', '09:30 – 10:10',
  '10:40 – 11:20', '11:25 – 12:05', '12:10 – 12:50',
];

export default function TimetablePublishView({ navigation }) {
  const [presenter] = useState(() => new TimetablePublishPresenter(TimetableModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    const unsubscribe = navigation.addListener('focus', () => {
      if (loadedOnce.current) presenter.load({ showLoading: false });
      loadedOnce.current = true;
    });
    return () => {
      unsubscribe?.remove?.();
      presenter.detach();
    };
  }, [presenter, navigation]);

  // Guard refusals (clashes, empty periods, double publish) pop up.
  useActionErrorAlert(state.errorText);

  const draft = state.draft;
  const filledCount = draft ? draft.slots.filter((s) => s.subject).length : 0;

  const confirmPublish = () => {
    Alert.alert(
      'Publish this timetable?',
      `${draft.classLabel} — ${filledCount}/30 periods. Teachers and families see it immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Publish', onPress: () => presenter.publish() },
      ],
    );
  };

  const listRows = state.drafts.map((d) => ({
    id: d.id,
    title: d.classLabel,
    meta: `${d.slots.filter((s) => s.subject).length}/30 periods filled · ${d.term}`,
    status: d.status,
    raw: d,
  }));

  return (
    <AdminScaffold
      eyebrow="Academics"
      title={draft ? `Review — ${draft.classLabel}` : 'Review and publish the timetable'}
      subtitle={
        draft
          ? `${draft.classLabel} · ${draft.status} · ${filledCount}/30 periods`
          : 'Tap a draft to review it, then publish.'
      }
    >
      {state.status === 'loading' ? <LoadingView label="Loading the drafts…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' && !draft ? (
        <View>
          {state.drafts.length === 0 ? (
            <EmptyState
              title="No drafts yet"
              hint="Build a class week first — Academics → Build the weekly timetable."
            />
          ) : (
            <RecordList
              items={listRows}
              onPressItem={(row) => presenter.open(row.raw.id)}
              emptyText="No drafts yet."
            />
          )}
        </View>
      ) : null}

      {state.status === 'content' && draft ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}

          {DAYS.map((day) => (
            <View key={day}>
              <Text style={styles.section}>{day}</Text>
              <RecordList
                items={PERIOD_TIMES.map((time, i) => {
                  const slot = draft.slots.find((s) => s.day === day && s.period === i + 1);
                  return {
                    id: `${day}-${i + 1}`,
                    title: `Period ${i + 1} · ${time}`,
                    meta: slot && slot.subject ? `${slot.subject} · ${slot.teacherName}` : 'Empty',
                    status: slot && slot.subject ? 'Filled' : 'Empty',
                  };
                })}
                emptyText=""
              />
            </View>
          ))}

          <View style={styles.actions}>
            {draft.status !== 'Published' ? (
              <>
                <SecondaryButton
                  label={state.busy ? 'Checking…' : 'Check for clashes'}
                  disabled={state.busy}
                  onPress={() => presenter.validate()}
                />
                <PrimaryButton
                  label={state.busy ? 'Working…' : 'Publish timetable'}
                  disabled={state.busy || draft.status !== 'Ready to review'}
                  onPress={confirmPublish}
                />
              </>
            ) : (
              <SecondaryButton
                label="Back to drafts"
                onPress={() => presenter.backToList()}
              />
            )}
            {draft.status !== 'Published' ? (
              <SecondaryButton label="Back to drafts" onPress={() => presenter.backToList()} />
            ) : null}
          </View>
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
