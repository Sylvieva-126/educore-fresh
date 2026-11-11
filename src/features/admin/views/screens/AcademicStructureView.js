/**
 * AD12 — Classes, subjects and departments (View). Classes open the AD13
 * workspace; subjects are listed under it; a small form adds a subject.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, ErrorState, useActionErrorAlert } from '../components/FeedbackViews';
import LabelledField from '../components/LabelledField';
import { SecondaryButton } from './AdminHomeView';
import { AcademicStructurePresenter } from '../../presenters/AcademicStructurePresenter';
import { AcademicStructureModel } from '../../models';
import { colors, typography, spacing } from '../theme';

const DEPARTMENTS = ['Core', 'JSS', 'Science', 'Humanities / Arts', 'Business / Commercial'].map(
  (d) => ({ label: d, value: d }),
);
const CLASSES = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'].map(
  (c) => ({ label: c, value: c }),
);

export default function AcademicStructureView({ navigation }) {
  const [presenter] = useState(() => new AcademicStructurePresenter(AcademicStructureModel));
  const [state, setState] = useState(presenter.initialState);
  const loadedOnce = useRef(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectDepts, setSubjectDepts] = useState([]);
  const [subjectClasses, setSubjectClasses] = useState([]);
  const [deptSheet, setDeptSheet] = useState(false);
  const [classSheet, setClassSheet] = useState(false);

  // Rule: JSS classes take Core or JSS subjects only — picking only SSS
  // departments hides the JSS classes and drops any already-ticked ones.
  const jssAllowed = subjectDepts.includes('Core') || subjectDepts.includes('JSS');

  const toggleDept = (value) => {
    const next = subjectDepts.includes(value)
      ? subjectDepts.filter((d) => d !== value)
      : [...subjectDepts, value];
    setSubjectDepts(next);
    if (!(next.includes('Core') || next.includes('JSS'))) {
      setSubjectClasses((prev) => prev.filter((c) => !c.startsWith('JSS')));
    }
  };
  const toggleClass = (value) => {
    setSubjectClasses((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
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
    meta: `${(s.departments || [s.department]).join(' · ')} · ${s.classes.length} classes`,
    status: (s.departments || [s.department])[0],
  }));

  // Action errors (duplicate subject refused, empty fields) pop up.
  useActionErrorAlert(state.errorText);

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
            label="Departments"
            placeholder="Tap to tick — Core or JSS covers the junior classes"
            displayValue={
              subjectDepts.length
                ? subjectDepts.length === 1
                  ? subjectDepts[0]
                  : `${subjectDepts.length} departments selected`
                : ''
            }
            onPress={() => setDeptSheet(true)}
          />
          <LabelledField
            label={
              jssAllowed
                ? 'Taught in (classes)'
                : 'Taught in (classes) — JSS hidden: SSS department only'
            }
            placeholder="e.g. only the JSS classes — tap to tick"
            displayValue={
              subjectClasses.length
                ? subjectClasses.length === CLASSES.length
                  ? 'All shown classes'
                  : `${subjectClasses.length} classes selected`
                : ''
            }
            onPress={() => setClassSheet(true)}
          />
          <SecondaryButton
            label={state.savingSubject ? 'Saving…' : 'Add subject'}
            disabled={state.savingSubject}
            onPress={() => {
              presenter.addSubject({
                name: subjectName,
                departments: subjectDepts,
                classes: subjectClasses,
              });
              setSubjectName('');
              setSubjectDepts([]);
              setSubjectClasses([]);
            }}
          />

          <SelectSheet
            visible={deptSheet}
            label="Departments — tap to tick, then Done"
            options={DEPARTMENTS}
            multiple
            selectedValues={subjectDepts}
            onToggle={toggleDept}
            onClose={() => setDeptSheet(false)}
          />
          <SelectSheet
            visible={classSheet}
            label={
              jssAllowed
                ? 'Classes this subject is taught in'
                : 'Classes this subject is taught in — SSS only'
            }
            options={CLASSES.filter((c) => jssAllowed || !c.value.startsWith('JSS'))}
            multiple
            selectedValues={subjectClasses}
            onToggle={toggleClass}
            onClose={() => setClassSheet(false)}
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
