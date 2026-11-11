/**
 * AD21 — Set fees and issue bills (View). The plan list with issue actions,
 * plus the "new fee plan" form. Issuing is confirmed in a dialog.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import LabelledField from '../components/LabelledField';
import { SecondaryButton } from './AdminHomeView';
import { FeePlansPresenter } from '../../presenters/FeePlansPresenter';
import { FeePlanModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function FeePlansView({ navigation }) {
  const [presenter] = useState(() => new FeePlansPresenter(FeePlanModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);
  // New-plan form fields (view-owned; the presenter only receives values).
  const [formClass, setFormClass] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');

  // Issuing is confirmed twice, like the other money actions.
  const confirmIssue = (plan) => {
    if (plan.status === 'Issued') {
      Alert.alert(
        'Already issued',
        `These bills went out to ${plan.issuedCount} student${
          plan.issuedCount === 1 ? '' : 's'
        } already.`,
      );
      return;
    }
    Alert.alert(
      'Issue bills?',
      `${plan.classLabel} — ${plan.title} (${plan.amountLabel}) creates one bill for each ACTIVE student in ${plan.classLabel}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Issue bills', onPress: () => presenter.issuePlan(plan) },
      ],
    );
  };

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

  const rows = state.plans.map((p) => ({
    id: p.id,
    title: `${p.classLabel} · ${p.title}`,
    meta: `${p.amountLabel} · due ${p.dueDate} · ${
      p.status === 'Issued' ? `bills issued to ${p.issuedCount} students` : 'draft — not issued yet'
    }`,
    status: p.status,
    raw: p,
  }));

  return (
    <AdminScaffold
      eyebrow="Fees"
      title="Set fees and issue bills"
      subtitle="One plan per fee per class — issuing bills every active student in the class"
    >
      {state.status === 'loading' ? <LoadingView label="Loading the fee plans…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
          {state.errorText ? <Text style={styles.error}>{state.errorText}</Text> : null}

          <Text style={styles.section}>Fee plans</Text>
          <RecordList
            items={rows}
            onPressItem={(row) => confirmIssue(row.raw)}
            emptyText="No fee plans yet — create the first one below."
          />

          <Text style={styles.section}>New fee plan</Text>
          <LabelledField
            label="Class"
            placeholder="e.g. JSS1 B"
            value={formClass}
            onChangeText={setFormClass}
          />
          <LabelledField
            label="Plan name"
            placeholder="e.g. First Term tuition"
            value={formTitle}
            onChangeText={setFormTitle}
          />
          <LabelledField
            label="Amount (₦)"
            placeholder="e.g. 20000"
            value={formAmount}
            onChangeText={setFormAmount}
            keyboardType="number-pad"
          />
          <SecondaryButton
            label={state.savingPlan ? 'Saving…' : 'Create draft plan'}
            disabled={state.savingPlan}
            onPress={() =>
              presenter.createPlan({
                classLabel: formClass,
                title: formTitle,
                amount: Number(formAmount),
              })
            }
          />
          <Text style={styles.hint}>
            Issuing a plan creates one bill per ACTIVE student in the class — it never bills
            withdrawn or graduated students, and never bills a class twice.
          </Text>
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  hint: { ...typography.label, color: colors.muted, marginTop: spacing.sm },
});
