/**
 * AD16 — Attendance and absence follow-up. Loads the overview totals and
 * today's registers in one pass; the View renders both sections.
 */
import { ApiError } from '../api/client';

export class AttendanceOverviewPresenter {
  constructor(attendanceModel) {
    this.model = attendanceModel;
    this._render = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      overview: null,
      registers: [],
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

  async load() {
    this._setState({ status: 'loading', errorText: null });
    try {
      const [overview, registers] = await Promise.all([
        this.model.overview(),
        this.model.registers({ page: 1 }),
      ]);
      this._setState({
        status: 'content',
        overview: overview || {},
        registers: registers.items || [],
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText:
          error instanceof ApiError ? error.message : 'Could not load the attendance overview.',
      });
    }
  }

  onRetry() {
    return this.load();
  }
}

export default AttendanceOverviewPresenter;
