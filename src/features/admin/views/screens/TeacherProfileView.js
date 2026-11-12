/**
 * AD09 — Teacher profile (View). Contact facts and status at the top, the
 * form-class responsibility, then the subjects taught. Re-fetches on focus.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import StatusBadge from '../components/StatusBadge';
import { LoadingView, EmptyState, ErrorState } from '../components/FeedbackViews';
import { SecondaryButton } from './AdminHomeView';
import { TeacherProfilePresenter } from '../../presenters/TeacherProfilePresenter';
import { TeacherModel } from '../../models';
import { colors, typography, spacing, statusTone } from '../theme';

export default function TeacherProfileView({ route, navigation }) {
  const [presenter] = useState(() => new TeacherProfilePresenter(TeacherModel));
  const [state, setState] = useState(presenter.initialState);
  const teacherId = route.params?.teacherId;
  const loadedOnce = useRef(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    if (teacherId) presenter.load(teacherId);
    const unsubscribe = navigation.addListener('focus', () => {
      if (loadedOnce.current && teacherId) presenter.load(teacherId);
      loadedOnce.current = true;
    });
    return () => {
      unsubscribe?.remove?.();
      presenter.detach();
    };
  }, [presenter, teacherId]);

  const t = state.teacher;

  if (!teacherId) {
    return (
      <AdminScaffold eyebrow="People" title="Teacher profile">
        <EmptyState
          title="No teacher selected"
          hint="Open one from the teachers list — this page shows one teacher and their responsibilities."
        />
      </AdminScaffold>
    );
  }

  return (
    <AdminScaffold
      eyebrow="People"
      title={t ? t.fullName || t.name : 'Teacher profile'}
      subtitle={t ? t.staffNumber : undefined}
    >
      {state.status === 'loading' ? <LoadingView label="Loading the teacher…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' && t ? (
        <View>
          <View style={styles.badgeRow}>
            <StatusBadge label={t.status} tone={statusTone[t.status] || 'muted'} />
            <Text style={styles.meta}>
              {t.status === 'On Leave' ? 'Away — reassigned for now' : 'On duty this term'}
            </Text>
          </View>

          <Text style={styles.fact}>{t.phone}</Text>
          <Text style={styles.fact}>{t.email}</Text>

          <Text style={styles.section}>Responsibilities</Text>
          <Text style={styles.line}>
            {t.formClass
              ? `Form teacher of ${t.formClass}`
              : 'Not a form teacher — subject duties only'}
          </Text>

          <Text style={styles.section}>Subjects taught</Text>
          <RecordList
            items={(t.subjects || []).map((subject) => ({
              id: subject,
              title: subject,
              meta: t.formClass ? `Including duties in ${t.formClass}` : 'Subject teacher',
            }))}
            emptyText="No subjects assigned yet."
          />

          <View style={styles.editWrap}>
            <SecondaryButton
              label="Edit profile, subjects and form class"
              onPress={() => navigation.navigate('TeacherForm', { teacherId: t.id })}
            />
          </View>
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  meta: { ...typography.label, color: colors.muted },
  fact: { ...typography.body, marginTop: spacing.sm },
  line: { ...typography.body },
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  editWrap: { marginTop: spacing.md },
});
