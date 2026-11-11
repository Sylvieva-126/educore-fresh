/**
 * AD18 — Set exams and grading rules (View). CA/exam weights, pass mark and
 * the grade bands; the arithmetic is checked on save and refusals pop up.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { AssessmentRulesPresenter } from '../../presenters/AssessmentRulesPresenter';
import { AssessmentModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function AssessmentRulesView({ navigation }) {
  const [presenter] = useState(() => new AssessmentRulesPresenter(AssessmentModel));
  const [state, setState] = useState(presenter.initialState);
  const [caText, setCaText] = useState('');
  const [examText, setExamText] = useState('');
  const [passText, setPassText] = useState('');
  const [bandTexts, setBandTexts] = useState({});

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    return () => presenter.detach();
  }, [presenter, navigation]);

  // Arithmetic refusals (weights must sum to 100, bands must descend) pop up.
  useActionErrorAlert(state.errorText, 'Grading rules');

  const policy = state.policy;

  useEffect(() => {
    if (policy) {
      setCaText(String(policy.caWeight));
      setExamText(String(policy.examWeight));
      setPassText(String(policy.passMark));
      setBandTexts(
        Object.fromEntries(policy.grades.map((g) => [g.grade, String(g.minScore)])),
      );
    }
  }, [policy]);

  const onSave = () => {
    const digits = (t) => Number(String(t).replace(/[^0-9.]/g, '')) || 0;
    presenter.save({
      caWeight: digits(caText),
      examWeight: digits(examText),
      passMark: digits(passText),
      grades: policy
        ? policy.grades.map((g) => ({ ...g, minScore: digits(bandTexts[g.grade]) }))
        : undefined,
    });
  };

  if (state.status === 'loading') {
    return (
      <AdminScaffold eyebrow="Academics" title="Set exams and grading rules">
        <LoadingView label="Loading the grading rules…" />
      </AdminScaffold>
    );
  }
  if (state.status === 'error') {
    return (
      <AdminScaffold eyebrow="Academics" title="Set exams and grading rules">
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      </AdminScaffold>
    );
  }
  if (!policy) {
    return (
      <AdminScaffold eyebrow="Academics" title="Set exams and grading rules">
        <ErrorState message="No grading policy yet — create one by saving below." />
      </AdminScaffold>
    );
  }

  const locked = policy.locked;

  return (
    <AdminScaffold
      eyebrow="Academics"
      title="Set exams and grading rules"
      subtitle={`${policy.term} · CA ${policy.caWeight}% / exam ${policy.examWeight}% · pass at ${policy.passMark}%`}
    >
      {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
      {locked ? (
        <Text style={styles.lockedNote}>
          This policy is locked for the term — marks entry uses it as it is.
        </Text>
      ) : null}

      <Text style={styles.section}>Continuous assessment vs exam</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.fieldLabel}>CA weight (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={caText}
            onChangeText={setCaText}
            editable={!locked}
            placeholder="30"
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.fieldLabel}>Exam weight (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={examText}
            onChangeText={setExamText}
            editable={!locked}
            placeholder="70"
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>
      <Text style={styles.hint}>The two weights must add up to exactly 100.</Text>

      <Text style={styles.section}>Pass mark</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={passText}
        onChangeText={setPassText}
        editable={!locked}
        placeholder="40"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.section}>Grade bands — the score each grade starts at</Text>
      {policy.grades.map((g) => (
        <View key={g.grade} style={styles.bandRow}>
          <Text style={styles.bandLabel}>
            {g.grade} · {g.remark} — from
          </Text>
          <TextInput
            style={styles.bandInput}
            keyboardType="number-pad"
            value={bandTexts[g.grade] ?? ''}
            onChangeText={(t) => setBandTexts((prev) => ({ ...prev, [g.grade]: t }))}
            editable={!locked}
            placeholderTextColor={colors.muted}
          />
        </View>
      ))}
      <Text style={styles.hint}>A starts at 70, B below it, and so on — each band must start lower than the one above.</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label={state.saving ? 'Saving…' : 'Save grading rules'}
          disabled={state.saving || locked}
          onPress={onSave}
        />
        {!locked ? (
          <SecondaryButton
            label={state.saving ? 'Working…' : 'Lock for the term'}
            disabled={state.saving}
            onPress={() => presenter.lock()}
          />
        ) : null}
      </View>
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  lockedNote: { ...typography.label, color: colors.muted, marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  fieldLabel: { ...typography.label, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
  hint: { ...typography.label, color: colors.muted, marginTop: spacing.xs },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bandLabel: { ...typography.body, flex: 1 },
  bandInput: {
    width: 72,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: 'center',
    ...typography.body,
  },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
