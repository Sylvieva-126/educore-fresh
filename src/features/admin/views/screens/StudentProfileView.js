/**
 * AD04 — Student profile (View). Renders the profile sections and forwards
 * the two guarded actions (class move, withdrawal) to the Presenter.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import StatusBadge from '../components/StatusBadge';
import LabelledField from '../components/LabelledField';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { StudentProfilePresenter } from '../../presenters/StudentProfilePresenter';
import { StudentModel } from '../../models';
import { colors, typography, spacing, statusTone } from '../theme';

export default function StudentProfileView({ route, navigation }) {
  const presenter = useRef(new StudentProfilePresenter(StudentModel)).current;
  const [state, setState] = useState(presenter.initialState);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load(route.params.studentId);
    return () => presenter.detach();
  }, [presenter, navigation, route.params]);

  const s = state.student;

  return (
    <AdminScaffold
      eyebrow="Student profile"
      title={s ? s.name : 'Student'}
      subtitle={s ? `${s.admissionNumber} · ${s.classLabel}` : undefined}
    >
      {state.status === 'loading' ? <LoadingView label="Loading profile…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' && s ? (
        <ScrollView>
          <StatusBadge label={s.status} tone={statusTone[s.status] || 'muted'} />

          <Text style={styles.section}>Enrolments</Text>
          {state.enrolments.length === 0 ? (
            <Text style={styles.muted}>No enrolment history yet.</Text>
          ) : (
            state.enrolments.map((e) => (
              <Text key={String(e.id || e.session)} style={styles.line}>
                {e.sessionLabel || e.session || ''} · {e.classLabel || e.className || ''} ·{' '}
                {e.status || ''}
              </Text>
            ))
          )}

          <Text style={styles.section}>Fee status</Text>
          <Text style={styles.line}>
            {state.feeStatus ? state.feeStatus.summary || 'Up to date' : 'Not available'}
          </Text>

          <Text style={styles.section}>Move class</Text>
          <LabelledField
            label="New class"
            placeholder="Choose the class to move to"
            displayValue={state.classMoveTarget || ''}
            onPress={() => {
              /* open class SelectSheet wired to presenter.confirmClassMove */
            }}
          />
          {state.classMoveError ? <Text style={styles.error}>{state.classMoveError}</Text> : null}
          <SecondaryButton
            label={
              state.classMoveState === 'saving'
                ? 'Saving…'
                : state.classMoveState === 'accepted'
                  ? 'Class move accepted'
                  : 'Request class move'
            }
            disabled={state.classMoveState === 'saving'}
          />

          <Text style={styles.section}>Withdraw student</Text>
          {state.withdrawalError ? <Text style={styles.error}>{state.withdrawalError}</Text> : null}
          {/* Wire to presenter.confirmWithdrawal(reason, effectiveDate) once the
              confirmation sheet (AD04 design) is built. Never call it directly
              without the double-confirm step. */}
          <PrimaryButton
            label={
              state.withdrawalState === 'saving'
                ? 'Saving…'
                : state.withdrawalState === 'accepted'
                  ? 'Withdrawal accepted'
                  : 'Withdraw this student'
            }
            disabled={state.withdrawalState === 'saving'}
          />

          <Text style={styles.section}>More</Text>
          <SecondaryButton label="View reports" onPress={() => presenter.onViewReports()} />
          <SecondaryButton label="Edit student" onPress={() => presenter.onEditStudent()} />
        </ScrollView>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  line: { ...typography.body, marginBottom: spacing.xs },
  muted: { ...typography.body, color: colors.muted },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
});
