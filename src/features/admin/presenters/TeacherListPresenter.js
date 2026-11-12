/**
 * AD07 — Teachers list. Search by name, staff number, subject or form class;
 * filter by status (Active / On Leave); open a teacher's profile.
 */
import { ApiError } from '../api/ApiError';

export class TeacherListPresenter {
  constructor(teacherModel) {
    this.model = teacherModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      rows: [],
      query: { q: '', status: 'all' },
      notice: null,
      errorText: null,
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
      const page = await this.model.list(this.state.query);
      this._setState({ status: 'content', rows: page.items, errorText: null });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the teachers.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  onSearch(text) {
    this._setState({ query: { ...this.state.query, q: text } });
    return this.load({ showLoading: false });
  }

  onFilterStatus(status) {
    this._setState({ query: { ...this.state.query, status } });
    return this.load({ showLoading: false });
  }

  onOpenTeacher(teacher) {
    if (this._navigation && teacher) {
      this._navigation.navigate('TeacherProfile', { teacherId: teacher.id });
    }
  }
}

export default TeacherListPresenter;
