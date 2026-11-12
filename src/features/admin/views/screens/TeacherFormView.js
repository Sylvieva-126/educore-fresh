/**
 * AD08 — Register or edit a teacher (View). A form for the profile fields,
 * a multi-select for the subjects they teach, a picker for their form class,
 * and the provisioning status with a Retry button while the account queues.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import LabelledField from '../components/LabelledField';
import { PrimaryButton, SecondaryButton } from './AdminHomeView';
import { TeacherFormPresenter } from '../../presenters/TeacherFormPresenter';
import { TeacherModel, AcademicStructureModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function TeacherFormView({ navigation, route }) {
  const [presenter] = useState(() => new TeacherFormPresenter(TeacherModel, AcademicStructureModel));
  const [state, setState] = useState(presenter.initialState);
  const [fullName, setFullName] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [formClass, setFormClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectSheet, setSubjectSheet] = useState(false);
  const [classSheet, setClassSheet] = useState(false);
  const prefilled = useRef(false);
  const teacherId = route.params && route.params.teacherId;

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.start(teacherId);
    return () => presenter.detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenter, navigation, teacherId]);

  // Prefill once when the teacher record arrives (edit mode).
  useEffect(() => {
    if (!prefilled.current && state.mode === 'edit' && state.teacher) {
      prefilled.current = true;
      setFullName(state.teacher.fullName || '');
      setStaffNumber(state.teacher.staffNumber || '');
      setPhone(state.teacher.phone || '');
      setEmail(state.teacher.email || '');
      setFormClass(state.teacher.formClass || '');
      setSubjects(state.teacher.subjects || []);
    }
  }, [state.mode, state.teacher]);

  useActionErrorAlert(state.errorText);

  const save = () => {
    presenter.saveTeacher(
      { fullName, staffNumber, phone, email, subjects, formClass: formClass || null },
      state.mode === 'edit' ? state.teacher.subjects || [] : [],
    );
  };

  return (
    <AdminScaffold
      eyebrow="Staff"
      title={state.mode === 'edit' ? 'Edit teacher' : 'Register a teacher'}
      subtitle={
        state.mode === 'edit'
          ? 'Profile, subjects and form class — the timetable follows at once.'
          : 'The staff account is provisioned automatically after you save.'
      }
    >
      {state.status === 'loading' ? <LoadingView label="Loading the form…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'editing' ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
          {state.provisioning && state.provisioning.status === 'Queued' ? (
            <View style={styles.provisioning}>
              <Text style={styles.provisioningText}>
                Staff account provisioning is queued.
              </Text>
              <SecondaryButton
                label="Retry provisioning"
                disabled={state.saving}
                onPress={() => presenter.retryProvisioning()}
              />
            </View>
          ) : null}

          <LabelledField
            label="Full name"
            placeholder="e.g. Mr. Chidi Nwachukwu"
            value={fullName}
            onChangeText={setFullName}
          />
          {state.mode === 'edit' ? (
            <LabelledField
              label="Staff number (assigned automatically)"
              displayValue={staffNumber || '—'}
            />
          ) : null}
          <LabelledField
            label="Phone"
            placeholder="e.g. +234 810 444 5050"
            value={phone}
            onChangeText={setPhone}
          />
          <LabelledField
            label="Email"
            placeholder="e.g. chidi.nwachukwu@greenfield.edu.ng"
            value={email}
            onChangeText={setEmail}
          />
          <LabelledField
            label="Subjects taught"
            placeholder="Tap to tick — the timetable only allows assigned teachers"
            displayValue={
              subjects.length
                ? subjects.length === 1
                  ? subjects[0]
                  : `${subjects.length} subjects`
                : ''
            }
            onPress={() => setSubjectSheet(true)}
          />
          <LabelledField
            label="Form class"
            placeholder="Tap to pick — the class they are the form teacher of"
            displayValue={formClass || ''}
            onPress={() => setClassSheet(true)}
          />

          <View style={styles.actionsWrap}>
            <PrimaryButton
              label={state.saving ? 'Saving…' : state.mode === 'edit' ? 'Save changes' : 'Register teacher'}
              disabled={state.saving}
              onPress={save}
            />
          </View>
        </View>
      ) : null}

      <SelectSheet
        visible={subjectSheet}
        label="Subjects taught — tap to tick, then Done"
        options={state.subjects.map((s) => ({ label: s, value: s }))}
        multiple
        selectedValues={subjects}
        onToggle={(value) =>
          setSubjects((prev) =>
            prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
          )
        }
        onClose={() => setSubjectSheet(false)}
      />
      <SelectSheet
        visible={classSheet}
        label="Form class"
        options={[
          { label: '— no form class —', value: '' },
          ...state.classOptions.map((c) => ({ label: c.classLabel, value: c.classLabel })),
        ]}
        onSelect={(value) => {
          setFormClass(value);
          setClassSheet(false);
        }}
        onClose={() => setClassSheet(false)}
      />
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  actionsWrap: { marginTop: spacing.md },
  provisioning: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  provisioningText: { ...typography.label, color: colors.muted, marginBottom: spacing.xs },
});
