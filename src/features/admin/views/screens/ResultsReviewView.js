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

  // A returned package shows the reason it came back and lets the office send
  // it back again or just view the reason — the old screen did nothing on tap,
  // so the reason was invisible and the package looked stuck.
  const viewReturned = (pkg) => {
    Alert.alert(
      `${pkg.classLabel} · ${pkg.subject} — returned for corrections`,
      `Reason: ${pkg.detail || 'No reason was recorded.'}\n\nTeacher: ${pkg.teacherName}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Send back again',
          style: 'destructive',
          onPress: () => presenter.returnPackage(pkg.id, 'Still needs corrections — see the notes.'),
        },
      ],
    );
  };

  // An approved package is signed off — there is nothing to return, but the
  // office should still see WHY it was approved and that it is waiting for the
  // report batch to be published (instead of the old "tap does nothing").
  const viewApproved = (pkg) => {
    Alert.alert(
      `${pkg.classLabel} · ${pkg.subject} — approved`,
      `${pkg.detail || 'Signed off.'}\n\nIt will appear on the report card when its batch is published below.`,
      [{ text: 'Close', style: 'cancel' }],
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
            Tap a submitted package to return it; tap a returned package to see the reason and send
            it back again; tap an approved package to see its sign-off.
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
              else if (row.raw.status === 'ReturnedForCorrections') viewReturned(row.raw);
              else if (row.raw.status === 'Approved') viewApproved(row.raw);
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
