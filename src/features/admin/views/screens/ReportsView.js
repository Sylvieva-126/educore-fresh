/**
 * AD20 — Reports (View). The catalogue of class report batches; tapping a
 * published batch opens a learner's report card (subjects, scores, grade
 * bands), and every batch exports.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import StatusBadge from '../components/StatusBadge';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { ReportsPresenter } from '../../presenters/ReportsPresenter';
import { ReportsModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function ReportsView({ navigation }) {
  const [presenter] = useState(() => new ReportsPresenter(ReportsModel));
  const [state, setState] = useState(presenter.initialState);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    return () => presenter.detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenter, navigation]);

  useActionErrorAlert(state.errorText);
  const report = state.report;

  return (
    <AdminScaffold
      eyebrow="Academics"
      title="Reports"
      subtitle="Class report batches — open one to see a learner's report card."
    >
      {state.status === 'loading' ? <LoadingView label="Loading the catalogue…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' && !report ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
          <RecordList
            items={state.batches.map((b) => ({
              id: b.id,
              title: `${b.classLabel} · ${b.termLabel}`,
              meta: `${b.studentCount} students · published ${b.publishedAt || '—'}`,
              status: b.status,
              raw: b,
            }))}
            onPressItem={(row) => presenter.openReport(row.raw)}
            emptyText="No report batches yet."
          />
          <Text style={styles.hint}>
            Draft batches have no report cards yet. Published batches open a sample learner's card.
          </Text>
        </View>
      ) : null}

      {state.status === 'content' && report ? (
        <View>
          <Text style={styles.notice}>{state.notice}</Text>
          <View style={styles.badgeRow}>
            <StatusBadge
              label={state.openBatch ? state.openBatch.status : 'Report'}
              tone={state.openBatch && state.openBatch.status === 'Published' ? 'positive' : 'info'}
            />
          </View>
          <Text style={styles.student}>{report.studentName}</Text>
          <Text style={styles.meta}>
            {report.classLabel} · {report.termLabel} · Form teacher: {report.formTeacherName}
          </Text>

          <Text style={styles.section}>Subjects</Text>
          <RecordList
            items={report.subjects.map((s, i) => ({
              id: `${s.subject}-${i}`,
              title: s.subject,
              meta: `CA ${s.caScore} · Exam ${s.examScore} · Total ${s.total} — ${s.grade} (${s.remark})`,
            }))}
            emptyText="No subjects on this report."
          />

          <Text style={styles.summary}>
            Average {report.average}% · Position {report.position} · "{report.overallRemark}"
          </Text>

          <View style={styles.actionsWrap}>
            <PrimaryButton
              label={state.working ? 'Exporting…' : 'Export this class as CSV'}
              disabled={state.working}
              onPress={() => presenter.runExport(state.openBatch)}
            />
            <View style={styles.secondaryWrap}>
              <SecondaryButton label="Back to the catalogue" onPress={() => presenter.closeReport()} />
            </View>
          </View>
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  hint: { ...typography.label, color: colors.muted, marginTop: spacing.sm },
  badgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  student: { ...typography.sectionTitle },
  meta: { ...typography.label, color: colors.muted, marginTop: spacing.xs },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  summary: { ...typography.body, marginTop: spacing.sm },
  actionsWrap: { marginTop: spacing.md },
  secondaryWrap: { marginTop: spacing.xs },
});
