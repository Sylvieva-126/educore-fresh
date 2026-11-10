/**
 * AD03 — Register or edit a student (View). Renders the form and forwards
 * every change to the Presenter; the Presenter validates and submits.
 * SelectSheet fields (gender, class, department) match the AD02 dropdowns.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import SelectSheet from '../components/SelectSheet';
import LabelledField from '../components/LabelledField';
import { PrimaryButton } from './AdminHomeView';
import { StudentFormPresenter } from '../../presenters/StudentFormPresenter';
import { StudentModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const GENDERS = ['Female', 'Male'].map((g) => ({ label: g, value: g }));
const CLASSES = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'].map((c) => ({
  label: c,
  value: c,
}));
const DEPARTMENTS = ['Science', 'Humanities / Arts', 'Business / Commercial'].map((d) => ({
  label: d,
  value: d,
}));

export default function StudentFormView({ route, navigation }) {
  const [presenter] = useState(() => new StudentFormPresenter(StudentModel));
  const [state, setState] = useState(presenter.initialState);
  const [sheet, setSheet] = useState(null); // which SelectSheet is open

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load(route.params?.studentId);
    return () => presenter.detach();
  }, [presenter, navigation, route.params]);

  const v = state.values;
  const isEdit = state.mode === 'edit';
  const isSaving = state.status === 'saving';
  const isAccepted = state.status === 'accepted';

  return (
    <AdminScaffold
      eyebrow="Students"
      title={isEdit ? 'Edit student details' : 'Enrol a new student'}
      subtitle={
        isEdit
          ? 'Update the core record. The admission number never changes.'
          : 'The school server creates the admission number and the accounts.'
      }
    >
      {state.errorText ? <Text style={styles.formError}>{state.errorText}</Text> : null}

      <Text style={styles.section}>Student</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <LabelledField
            label="First name"
            value={v.firstName}
            onChangeText={(t) => presenter.onValueChange('firstName', t)}
            placeholder="e.g. Amara"
            error={state.errors.firstName}
          />
        </View>
        <View style={styles.half}>
          <LabelledField
            label="Last name"
            value={v.lastName}
            onChangeText={(t) => presenter.onValueChange('lastName', t)}
            placeholder="e.g. Okafor"
            error={state.errors.lastName}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <LabelledField
            label="Gender"
            displayValue={v.gender || ''}
            placeholder="Select…"
            onPress={() => setSheet('gender')}
          />
        </View>
        <View style={styles.half}>
          <LabelledField
            label="Date of birth"
            value={v.dateOfBirth}
            onChangeText={(t) => presenter.onValueChange('dateOfBirth', t)}
            placeholder="YYYY-MM-DD"
            error={state.errors.dateOfBirth}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <LabelledField
            label="Class"
            displayValue={v.classLabel || ''}
            placeholder="Select…"
            onPress={() => setSheet('class')}
            error={state.errors.classLabel}
          />
        </View>
        {v.classLabel.startsWith('SSS') ? (
          <View style={styles.half}>
            <LabelledField
              label="Department"
              displayValue={v.department || ''}
              placeholder="Select…"
              onPress={() => setSheet('department')}
            />
          </View>
        ) : (
          <View style={styles.half}>
            <Text style={styles.hint}>
              {v.classLabel ? 'JSS classes have no department.' : 'JSS or SSS is set by the class.'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.section}>Parent / guardian</Text>
      <LabelledField
        label="Guardian name"
        value={v.guardianName}
        onChangeText={(t) => presenter.onValueChange('guardianName', t)}
        placeholder="e.g. Mrs. Ngozi Okafor"
        error={state.errors.guardianName}
      />
      <LabelledField
        label="Guardian phone"
        value={v.guardianPhone}
        onChangeText={(t) => presenter.onValueChange('guardianPhone', t)}
        placeholder="e.g. +234 803 111 2233"
        error={state.errors.guardianPhone}
      />
      <LabelledField
        label="Guardian email (optional)"
        value={v.guardianEmail}
        onChangeText={(t) => presenter.onValueChange('guardianEmail', t)}
        placeholder="e.g. ngozi.okafor@example.com"
      />

      <PrimaryButton
        label={
          isSaving
            ? 'Saving…'
            : isAccepted
              ? isEdit
                ? 'Saved ✓'
                : 'Enrolled ✓'
              : isEdit
                ? 'Save changes'
                : 'Complete enrolment'
        }
        disabled={isSaving || isAccepted}
        onPress={() => presenter.onSubmit()}
      />
      {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}

      <SelectSheet
        visible={sheet === 'gender'}
        label="Gender"
        options={GENDERS}
        value={v.gender}
        onSelect={(val) => presenter.onValueChange('gender', val)}
        onClose={() => setSheet(null)}
      />
      <SelectSheet
        visible={sheet === 'class'}
        label="Class"
        options={CLASSES}
        value={v.classLabel}
        onSelect={(val) => presenter.onValueChange('classLabel', val)}
        onClose={() => setSheet(null)}
      />
      <SelectSheet
        visible={sheet === 'department'}
        label="Department"
        options={DEPARTMENTS}
        value={v.department}
        onSelect={(val) => presenter.onValueChange('department', val)}
        onClose={() => setSheet(null)}
      />
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
  hint: { ...typography.label, color: colors.muted, marginTop: spacing.md },
  formError: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
  notice: { ...typography.label, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },
});
