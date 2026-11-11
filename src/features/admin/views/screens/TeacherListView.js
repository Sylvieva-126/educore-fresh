/**
 * AD07 — Teachers list (View). Search box plus status filter chips; every
 * row opens the teacher's profile. Re-fetches on focus.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import { TeacherListPresenter } from '../../presenters/TeacherListPresenter';
import { TeacherModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const STATUSES = ['all', 'Active', 'On Leave'];

export default function TeacherListView({ navigation }) {
  const [presenter] = useState(() => new TeacherListPresenter(TeacherModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    // Staff status changes as the office registers or edits teachers, so
    // re-fetch on every focus after the first.
    const unsubscribe = navigation.addListener('focus', () => {
      if (loadedOnce.current) presenter.load({ showLoading: false });
      loadedOnce.current = true;
    });
    return () => {
      unsubscribe?.remove?.();
      presenter.detach();
    };
  }, [presenter, navigation]);

  const rows = state.rows.map((t) => ({
    id: t.id,
    title: t.name,
    meta: `${t.staffNumber} · ${(t.subjects || []).join(', ') || 'No subjects yet'}${
      t.formClass ? ` · Form teacher of ${t.formClass}` : ''
    }`,
    status: t.status,
    raw: t,
  }));

  return (
    <AdminScaffold
      eyebrow="People"
      title="Teachers list"
      subtitle="Staff, their subjects and responsibilities"
    >
      {state.status === 'loading' ? <LoadingView label="Loading the teachers…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <View>
          <TextInput
            style={styles.search}
            placeholder="Search name, staff number or subject"
            placeholderTextColor={colors.muted}
            value={state.query.q}
            onChangeText={(t) => presenter.onSearch(t)}
          />
          <View style={styles.chipRow}>
            {STATUSES.map((s) => (
              <Pressable
                key={s}
                style={[styles.chip, state.query.status === s && styles.chipOn]}
                onPress={() => presenter.onFilterStatus(s)}
              >
                <Text style={[styles.chipText, state.query.status === s && styles.chipTextOn]}>
                  {s === 'all' ? 'All' : s}
                </Text>
              </Pressable>
            ))}
          </View>
          <RecordList
            items={rows}
            onPressItem={(row) => presenter.onOpenTeacher(row.raw)}
            emptyText="No teachers match — try clearing the search or filter."
          />
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  search: {
    ...typography.input,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 46,
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.label, color: colors.muted },
  chipTextOn: { color: colors.white },
});
