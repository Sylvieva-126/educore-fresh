/**
 * AD19 — Review and publish results (View). Tapping a submitted package
 * returns it to the teacher; tapping a ready batch publishes the report
 * cards (with a confirm), tapping a published batch reopens it.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Text, Alert, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import { ResultsReviewPresenter } from '../../presenters/ResultsReviewPresenter';
import { ResultsModel } from '../../models';
import { typography, spacing } from '../theme';

export default function ResultsReviewView({ navigation }) {
  const [presenter] = useState(() => new ResultsReviewPresenter(ResultsModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    // Package and batch statuses also change from other pages, so re-fetch on
    // every focus after the first.
    const unsubscribe = navigation.addListener('focus', () => {
      if (loadedOnce.current) presenter.load();
      loadedOnce.current = true;
    });
    return () => {
      unsubscribe?.remove?.();
      presenter.detach();
    };
  }, [presenter, navigation]);

  const confirmReturn = (pkg) => {
    Alert.alert(
      'Return this package?',
      `${pkg.classLabel} · ${pkg.subject} goes back to ${pkg.teacherName} for corrections.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return',
          style: 'destructive',
          onPress: () => presenter.returnPackage(pkg.id, 'Check the flagged sheets and resubmit.'),
        },
      ],
    );
  };

  const confirmPublish = (batch) => {
    Alert.alert(
      'Publish these report cards?',
      `${batch.classLabel} · ${batch.studentCount} students. Families see the reports immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Publish', onPress: () => presenter.publishBatch(batch.id) },
      ],
    );
  };

  const confirmSubmit = (batch) => {
    Alert.alert(
      'Send for review?',
      `${batch.classLabel} · ${batch.termLabel} is checked and moves to Ready to publish.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => presenter.submitBatch(batch.id) },
      ],
    );
  };

  const confirmReopen = (batch) => {
    Alert.alert(
      'Reopen this batch?',
      `${batch.classLabel} goes back to Draft so marks can be corrected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reopen', style: 'destructive', onPress: () => presenter.reopenBatch(batch.id) },
      ],
    );
  };

  // Publish/reopen guard refusals pop up instead of inline text.
  useActionErrorAlert(state.errorText);

  return (
    <AdminScaffold
      eyebrow="Academics"
      title="Review and publish results"
      subtitle="Teacher packages first, then the report cards."
    >
      {state.status === 'loading' ? <LoadingView label="Loading results…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <>

          <Text style={styles.section}>Mark packages</Text>
          <Text style={styles.hint}>
            Tap a submitted package to return it to the teacher; returned packages wait on them.
          </Text>
          <RecordList
            items={state.packages.map((p) => ({
              id: p.id,
              title: `${p.classLabel} · ${p.subject}`,
              meta: `${p.teacherName} · ${p.studentCount} students · ${p.detail}`,
              status: p.status,
              raw: p,
            }))}
            onPressItem={(row) => {
              if (row.raw.status === 'Submitted') confirmReturn(row.raw);
            }}
            emptyText="No mark packages yet."
          />

          <Text style={styles.section}>Report batches</Text>
          <Text style={styles.hint}>
            Publishing a batch sends the report cards to the Student and Parent apps.
          </Text>
          <RecordList
            items={state.batches.map((b) => ({
              id: b.id,
              title: `${b.classLabel} · ${b.termLabel}`,
              meta: `${b.studentCount} students${
                b.publishedAt ? ` · published ${b.publishedAt}` : ' · not published'
              }`,
              status: b.status,
              raw: b,
            }))}
            onPressItem={(row) => {
              if (row.raw.status === 'Draft' || row.raw.status === 'ReturnedForCorrections') {
                confirmSubmit(row.raw);
              }
              if (row.raw.status === 'ReadyToPublish') confirmPublish(row.raw);
              if (row.raw.status === 'Published') confirmReopen(row.raw);
            }}
            emptyText="No report batches yet."
          />
        </>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  hint: { ...typography.label, marginBottom: spacing.sm },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
});
