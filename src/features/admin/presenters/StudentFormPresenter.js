/**
 * AD03 — Register or edit a student. One form, two modes:
 *   • enrol (no studentId) → POST student-enrolments, then jump to the
 *     new student's profile so the admin sees the record was created;
 *   • edit (studentId)     → PATCH students/{id}, then show "Saved".
 * Safe submission states: draft → saving → accepted/failed, with inline
 * validation errors so nothing the admin typed is lost on a failed submit.
 */
import { ApiError } from '../api/client';

const EMPTY_VALUES = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  classLabel: '',
  department: '',
  guardianName: '',
  guardianPhone: '',
  guardianEmail: '',
};

export class StudentFormPresenter {
  constructor(studentModel) {
    this.model = studentModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this._studentId = null;
    this.initialState = {
      status: 'draft', // draft | saving | accepted | failed
      mode: 'enrol', // enrol | edit
      values: { ...EMPTY_VALUES },
      errors: {},
      errorText: null,
      notice: null,
    };
    this.state = this.initialState;
  }

  attach(render, navigation) {
    this._render = render;
    this._navigation = navigation;
    this._alive = true;
  }

  detach() {
    this._alive = false;
  }

  _setState(patch) {
    if (!this._alive || !this._render) return;
    this.state = { ...this.state, ...patch };
    this._render(this.state);
  }

  /** Edit mode: load the student and prefill the form. */
  async load(studentId) {
    if (!studentId) return; // enrol mode — nothing to load
    this._studentId = studentId;
    this._setState({ mode: 'edit', errorText: null });
    try {
      const student = await this.model.byId(studentId);
      const nameParts = String(student.name || '').split(' ');
      const [firstName, ...rest] = nameParts;
      this._setState({
        values: {
          firstName: student.firstName || firstName || '',
          lastName: student.lastName || rest.join(' ') || '',
          gender: student.gender || '',
          dateOfBirth: student.dateOfBirth || '',
          classLabel: student.classLabel || '',
          department: student.department || '',
          guardianName: student.guardianName || '',
          guardianPhone: student.guardianPhone || '',
          guardianEmail: student.guardianEmail || '',
        },
      });
    } catch (error) {
      this._setState({
        errorText:
          error instanceof ApiError ? error.message : 'Could not load this student for editing.',
      });
    }
  }

  onValueChange(key, value) {
    const values = { ...this.state.values, [key]: value };
    const errors = { ...this.state.errors };
    if (errors[key]) delete errors[key]; // typing again clears the old complaint
    this._setState({ values, errors });
  }

  validate() {
    const errors = {};
    const v = this.state.values;
    if (!v.firstName.trim()) errors.firstName = 'First name is required.';
    if (!v.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!v.classLabel) errors.classLabel = 'Choose a class.';
    if (!v.guardianName.trim()) errors.guardianName = 'A guardian name is required.';
    if (!v.guardianPhone.trim()) errors.guardianPhone = 'A guardian phone number is required.';
    if (v.dateOfBirth.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(v.dateOfBirth.trim())) {
      errors.dateOfBirth = 'Use the YYYY-MM-DD format.';
    }
    return errors;
  }

  async onSubmit() {
    if (this.state.status === 'saving') return;
    const errors = this.validate();
    if (Object.keys(errors).length > 0) {
      this._setState({ errors, notice: null });
      return;
    }

    this._setState({ status: 'saving', errorText: null, notice: null });
    const v = this.state.values;
    const body = {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      gender: v.gender || undefined,
      dateOfBirth: v.dateOfBirth.trim() || undefined,
      classLabel: v.classLabel,
      // JSS classes have no department (AD02 list already shows this rule).
      department: v.classLabel.startsWith('JSS') ? null : v.department || null,
      guardianName: v.guardianName.trim(),
      guardianPhone: v.guardianPhone.trim(),
      guardianEmail: v.guardianEmail.trim() || undefined,
    };

    try {
      if (this.state.mode === 'edit') {
        await this.model.update(this._studentId, body);
        this._setState({ status: 'accepted', notice: 'Changes saved — go back to the profile.' });
      } else {
        const created = await this.model.enrol(body);
        this._setState({
          status: 'accepted',
          notice: created
            ? `${created.fullName || body.firstName} enrolled as ${created.admissionNumber}.`
            : 'Enrolment accepted.',
        });
        // Land on the new profile so the admin can confirm the record.
        if (this._navigation && created && created.id) {
          const replace = this._navigation.replace || this._navigation.navigate;
          replace.call(this._navigation, 'StudentProfile', { studentId: created.id });
        }
      }
    } catch (error) {
      this._setState({
        status: 'failed',
        errorText:
          error instanceof ApiError
            ? error.message
            : 'The school server did not accept the form. Try again.',
      });
    }
  }
}

export default StudentFormPresenter;
