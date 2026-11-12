/**
 * AD09 — One teacher: contact details, account status, form-class
 * responsibility and the subjects they teach.
 */
import { ApiError } from '../api/ApiError';

export class TeacherProfilePresenter {
  constructor(teacherModel) {
    this.model = teacherModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this._teacherId = null;
    this.initialState = {
      status: 'loading', // loading | content | error
      teacher: null,
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

  async load(teacherId) {
    this._teacherId = teacherId;
    this._setState({ status: 'loading', errorText: null });
    try {
      const teacher = await this.model.byId(teacherId);
      if (!teacher) {
        this._setState({
          status: 'error',
          errorText: 'This teacher could not be found — the link may be stale.',
        });
        return;
      }
      this._setState({ status: 'content', teacher });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load this teacher.',
      });
    }
  }

  onRetry() {
    return this.load(this._teacherId);
  }
}

export default TeacherProfilePresenter;
