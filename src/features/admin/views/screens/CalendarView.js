/**
 * AD11 — School calendar and daily times (View). Term window, key dates,
 * and today's schedule. Editing drafts/dates is the next slice (the drafts
 * endpoints are already in CalendarModel).
 */
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import { CalendarPresenter } from '../../presenters/CalendarPresenter';
import { CalendarModel } from '../../models';
import { typography, spacing } from '../theme';

export default function CalendarView() {
  const [presenter] = useState(() => new CalendarPresenter(CalendarModel));
  const [state, setState] = useState(presenter.initialState);

  useEffect(() => {
    presenter.attach(setState);
    presenter.load();
    return () => presenter.detach();
  }, [presenter]);

  const cal = state.calendar || {};

  return (
    <AdminScaffold
      eyebrow="Academics"
      title="School calendar and daily times"
      subtitle={cal.sessionLabel ? `${cal.sessionLabel} · ${cal.termLabel || ''}` : undefined}
    >
      {state.status === 'loading' ? <LoadingView label="Loading the calendar…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <>
          <Text style={styles.termLine}>
            {cal.termLabel}: {cal.termStart} → {cal.termEnd} · Next term begins {cal.nextTermStart}
          </Text>

          <Text style={styles.section}>Key dates</Text>
          <RecordList
            items={(cal.keyDates || []).map((d) => ({
              id: d.id,
              title: `${d.date} · ${d.title}`,
              meta: d.detail,
            }))}
            emptyText="No key dates on the calendar yet."
          />

          <Text style={styles.section}>Sessions</Text>
          <RecordList
            items={state.sessions.map((s) => ({
              id: s.id,
              title: s.label,
              meta: s.terms,
              status: s.status,
            }))}
            emptyText="No sessions configured."
          />

          <Text style={styles.section}>Today at school</Text>
          <RecordList
            items={(cal.todaySchedule || []).map((slot) => ({
              id: slot.id,
              title: `${slot.time} · ${slot.subject}`,
              meta: slot.detail,
            }))}
            emptyText="No published activities for today."
          />
        </>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  termLine: { ...typography.body, color: typography.body.color },
});
