/**
 * AD12 — Classes, subjects and departments. The structure overview: every
 * class with its form teacher and counts, the subject list, and a form to
 * add a subject. Class rows open the AD13 workspace.
 */
import { ApiError } from '../api/client';

export class AcademicStructurePresenter {
  constructor(structureModel) {
    this.model = structureModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      classes: [],
      subjects: [],
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
      const [classesPage, subjectsPage] = await Promise.all([
        this.model.classes(),
        this.model.subjects(),
      ]);
      this._setState({
        status: 'content',
        classes: classesPage.items,
        subjects: subjectsPage.items,
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

  /** Add a subject to the school's subject list. */
  async addSubject(fields) {
    if (this.state.savingSubject) return;
    if (!fields.name || !fields.name.trim()) {
      this._setState({ notice: null, errorText: 'Name the subject.' });
      return;
    }
    if (!fields.department) {
      this._setState({ notice: null, errorText: 'Tag the department it belongs to.' });
      return;
    }
    this._setState({ savingSubject: true, notice: null, errorText: null });
    try {
      await this.model.createSubject(fields);
      this._setState({ savingSubject: false, notice: 'Subject added to the list.' });
      await this.load({ showLoading: false });
    } catch (error) {
      this._setState({
        savingSubject: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The subject was not saved.',
      });
    }
  }
}

export default AcademicStructurePresenter;
