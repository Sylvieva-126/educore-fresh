/**
 * AD28 — School announcements (View). Two parts: the notice list and the
 * composer. The composer demonstrates the safe-submission UI: inline errors,
 * disabled submit while saving, accepted confirmation after the backend
 * response — all driven by NoticesPresenter state.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import LabelledField from '../components/LabelledField';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, EmptyState, ErrorState } from '../components/FeedbackViews';
import { PrimaryButton } from './AdminHomeView';
import { NoticesPresenter } from '../../presenters/NoticesPresenter';
import { NoticesModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const AUDIENCES = [
  { label: 'Everyone', value: 'ALL' },
  { label: 'A role (teachers, families…)', value: 'ROLE' },
  { label: 'A class', value: 'CLASS' },
];

export default function NoticesView({ navigation }) {
  const [presenter] = useState(() => new NoticesPresenter(NoticesModel));
  const [state, setState] = useState(presenter.initialState);
  const [audienceSheetVisible, setAudienceSheetVisible] = useState(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    return () => presenter.detach();
  }, [presenter, navigation]);

  const { composer } = state;
  const audienceLabel =
    AUDIENCES.find((a) => a.value === composer.audience)?.label || composer.audience;

  return (
    <AdminScaffold
      eyebrow="Messages"
      title="School announcements"
      subtitle="Publish notices families and staff will see."
      insetBottom={false}
    >
      {state.status === 'loading' ? <LoadingView /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry?.()} />
      ) : null}
      {state.status === 'empty' ? (
        <EmptyState title="No announcements yet" hint="Use the composer below to publish one." />
      ) : null}
      {state.status === 'content' ? (
        <RecordList
          items={state.notices.map((n) => ({
            id: n.id,
            title: n.title,
            meta: n.audienceLabel || n.audience || '',
            status: n.status,
          }))}
          emptyText="No announcements yet."
        />
      ) : null}

      <Text style={styles.section}>New announcement</Text>
      <LabelledField
        label="Title"
        value={composer.title}
        onChangeText={(t) => presenter.onComposerChange('title', t)}
        placeholder="e.g. Mid-term break"
        error={composer.validationErrors.title}
      />
      <LabelledField
        label="Message"
        value={composer.body}
        onChangeText={(t) => presenter.onComposerChange('body', t)}
        placeholder="What should everyone know?"
        error={composer.validationErrors.body}
        multiline
      />
      <LabelledField
        label="Audience"
        displayValue={audienceLabel}
        onPress={() => setAudienceSheetVisible(true)}
      />

      {composer.errorText ? <Text style={styles.error}>{composer.errorText}</Text> : null}
      {composer.state === 'accepted' ? (
        <Text style={styles.accepted}>Notice accepted — it is on its way to the audience.</Text>
      ) : null}

      <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
        <PrimaryButton
          label={
            composer.state === 'saving'
              ? 'Saving…'
              : composer.state === 'accepted'
                ? 'Published ✓'
                : 'Save and publish'
          }
          onPress={() => presenter.submitNotice()}
          disabled={composer.state === 'saving'}
        />
      </View>

      <SelectSheet
        visible={audienceSheetVisible}
        label="Audience"
        options={AUDIENCES}
        value={composer.audience}
        onSelect={(v) => presenter.onComposerChange('audience', v)}
        onClose={() => setAudienceSheetVisible(false)}
      />
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
  accepted: { ...typography.label, color: colors.primary, marginBottom: spacing.sm },
});
