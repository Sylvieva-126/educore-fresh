/**
 * AD12 — Classes, subjects and departments (View). Classes open the AD13
 * workspace; subjects are listed under it; a small form adds a subject.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import LabelledField from '../components/LabelledField';
import { SecondaryButton } from './AdminHomeView';
import { AcademicStructurePresenter } from '../../presenters/AcademicStructurePresenter';
import { AcademicStructureModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const DEPARTMENTS = ['Core', 'Science', 'Humanities / Arts', 'Business / Commercial'].map(
  (d) => ({ label: d, value: d }),
);

export default function AcademicStructureView({ navigation }) {
  const [presenter] = useState(() => new AcademicStructurePresenter(AcademicStructureModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectDept, setSubjectDept] = useState('');
  const [deptSheet, setDeptSheet] = useState(false);

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

  const classRows = state.classes.map((c) => ({
    id: c.id,
    title: c.classLabel,
    meta: `Form: ${c.formTeacherName} · ${c.studentCount} students · ${c.subjectCount} subjects`,
    status: c.department || 'JSS',
    raw: c,
  }));

  const subjectRows = state.subjects.map((s) => ({
    id: s.id,
    title: s.name,
    meta: `${s.department} · ${s.classes.length} classes`,
    status: s.department,
  }));

  return (
    <AdminScaffold
      eyebrow="Academics"
      title="Classes, subjects and departments"
      subtitle="Tap a class to open its workspace"
    >
      {state.status === 'loading' ? <LoadingView label="Loading the structure…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <View>
          {state.notice ? <Text style={styles.notice}>{state.notice}</Text> : null}
          {state.errorText ? <Text style={styles.error}>{state.errorText}</Text> : null}

          <Text style={styles.section}>Classes</Text>
          <RecordList
            items={classRows}
            onPressItem={(row) =>
              navigation.navigate('ClassWorkspace', { classId: row.raw.classLabel })
            }
            emptyText="No classes yet."
          />

          <Text style={styles.section}>Subjects</Text>
          <RecordList items={subjectRows} emptyText="No subjects yet — add the first one below." />

          <Text style={styles.section}>Add a subject</Text>
          <LabelledField
            label="Subject name"
            placeholder="e.g. Computer Studies"
            value={subjectName}
            onChangeText={setSubjectName}
          />
          <LabelledField
            label="Department"
            placeholder="Choose the department"
            displayValue={subjectDept}
            onPress={() => setDeptSheet(true)}
          />
          <SecondaryButton
            label={state.savingSubject ? 'Saving…' : 'Add subject'}
            disabled={state.savingSubject}
            onPress={() => {
              presenter.addSubject({ name: subjectName, department: subjectDept });
              setSubjectName('');
              setSubjectDept('');
            }}
          />

          <SelectSheet
            visible={deptSheet}
            label="Department"
            options={DEPARTMENTS}
            value={subjectDept}
            onSelect={setSubjectDept}
            onClose={() => setDeptSheet(false)}
          />
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  notice: { ...typography.body, color: colors.primary, marginBottom: spacing.sm },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
  section: { ...typography.sectionTitle, marginTop: spacing.md, marginBottom: spacing.sm },
});
