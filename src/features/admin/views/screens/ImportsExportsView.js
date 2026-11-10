/**
 * AD33 — Bring in or download school data (View). Export shares a CSV of the
 * students; import takes pasted CSV rows, shows how many are ready and how
 * many have problems, and hands the valid ones to the Presenter.
 */
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import LabelledField from '../components/LabelledField';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { ImportsExportsPresenter, IMPORT_CSV_HEADER } from '../../presenters/ImportsExportsPresenter';
import { StudentModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function ImportsExportsView() {
  const [presenter] = useState(() => new ImportsExportsPresenter(StudentModel));
  const [state, setState] = useState(presenter.initialState);

  useEffect(() => {
    presenter.attach(setState);
    return () => presenter.detach();
  }, [presenter]);

  return (
    <AdminScaffold
      eyebrow="More"
      title="Bring in or download school data"
      subtitle="Students first — the same pattern later covers guardians, teachers and results."
      insetBottom={false}
    >
      <Text style={styles.section}>Export</Text>
      <Text style={styles.bodyText}>
        Send the current student records as a CSV file to email, Drive or WhatsApp.
      </Text>
      <SecondaryButton
        label={state.exporting ? 'Preparing export…' : 'Export students (CSV)'}
        onPress={() => presenter.onExport()}
        disabled={state.exporting}
      />
      {state.exportNotice ? <Text style={styles.notice}>{state.exportNotice}</Text> : null}

      <Text style={styles.section}>Import students</Text>
      <Text style={styles.bodyText}>
        Paste CSV rows below — with or without the header line. Required columns: firstName,
        lastName, class.
      </Text>
      <LabelledField
        label="Pasted CSV"
        multiline
        numberOfLines={6}
        value={state.pasted}
        onChangeText={(text) => presenter.onPasteChange(text)}
        placeholder={IMPORT_CSV_HEADER}
      />
      <Text style={styles.preview}>
        {state.rows.length} ready · {state.problems.length} with problems
      </Text>
      {state.problems.slice(0, 4).map((p) => (
        <Text key={p.rowNumber} style={styles.problem}>
          Row {p.rowNumber}: {p.problem}
        </Text>
      ))}
      {state.errorText ? <Text style={styles.problem}>{state.errorText}</Text> : null}
      <PrimaryButton
        label={
          state.importing
            ? 'Importing…'
            : state.rows.length > 0
              ? `Import ${state.rows.length} students`
              : 'Import students'
        }
        disabled={state.rows.length === 0 || state.importing}
        onPress={() => presenter.onImport()}
      />
      {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.sectionTitle, marginTop: spacing.lg, marginBottom: spacing.sm },
  bodyText: { ...typography.body, color: colors.muted, marginBottom: spacing.sm },
  preview: { ...typography.label, marginTop: spacing.xs, marginBottom: spacing.sm },
  problem: { ...typography.label, color: '#a33a2a', marginBottom: spacing.xs },
  notice: { ...typography.label, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },
});
