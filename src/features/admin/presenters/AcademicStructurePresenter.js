/**
 * AD12 — Classes, subjects and departments. The structure overview: every
 * class with its form teacher and counts, the subject list, and a form to
 * add a subject. Class rows open the AD13 workspace.
 */
import { ApiError } from '../api/client';

export class AcademicStructurePresenter {
  constructor(structureModel, teacherModel) {
    this.model = structureModel;
    this.teacherModel = teacherModel || null;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      classes: [],
      subjects: [],
      teachers: [], // active staff, for the assigned-teacher picker
      notice: null,
      errorText: null,
      savingSubject: false,
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

  async load({ showLoading } = {}) {
    if (showLoading !== false) this._setState({ status: 'loading', errorText: null });
    try {
      const [classesPage, subjectsPage, teachersPage] = await Promise.all([
        this.model.classes(),
        this.model.subjects(),
        this.teacherModel
          ? this.teacherModel.list({ status: 'Active' })
          : Promise.resolve({ items: [] }),
      ]);
      this._setState({
        status: 'content',
        classes: classesPage.items,
        subjects: subjectsPage.items,
        teachers: teachersPage.items,
        errorText: null,
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText:
          error instanceof ApiError ? error.message : 'Could not load the academic structure.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  /** Add a subject: departments, classes and its assigned teachers. */
  async addSubject(fields) {
    if (this.state.savingSubject) return false;
    if (!fields.name || !fields.name.trim()) {
      this._setState({ notice: null, errorText: 'Name the subject.' });
      return false;
    }
    const departments = Array.isArray(fields.departments) ? fields.departments : [];
    if (departments.length === 0) {
      this._setState({ notice: null, errorText: 'Tag at least one department it belongs to.' });
      return false;
    }
    const classes = Array.isArray(fields.classes) ? fields.classes : [];
    const teachers = Array.isArray(fields.teachers) ? fields.teachers : [];
    this._setState({ savingSubject: true, notice: null, errorText: null });
    try {
      await this.model.createSubject({ name: fields.name, departments, classes, teachers });
      this._setState({
        savingSubject: false,
        notice:
          'Subject added' +
          (teachers.length > 0
            ? ` — ${teachers.length} teacher${teachers.length === 1 ? '' : 's'} assigned.`
            : ' — tap it in the list to assign teachers.'),
      });
      await this.load({ showLoading: false });
      return true;
    } catch (error) {
      this._setState({
        savingSubject: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The subject was not saved.',
      });
      return false;
    }
  }

  /** Edit a subject later: same rules, plus the assigned teachers. */
  async updateSubject(subjectId, fields) {
    if (this.state.savingSubject) return false;
    this._setState({ savingSubject: true, notice: null, errorText: null });
    try {
      await this.model.updateSubject(subjectId, {
        name: fields.name,
        departments: fields.departments,
        classes: fields.classes,
        teachers: fields.teachers || [],
      });
      this._setState({
        savingSubject: false,
        notice: 'Subject updated — the timetable picks up new teachers at once.',
      });
      await this.load({ showLoading: false });
      return true;
    } catch (error) {
      this._setState({
        savingSubject: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The subject was not updated.',
      });
      return false;
    }
  }
}

export default AcademicStructurePresenter;
