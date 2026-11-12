/**
 * AD11 — School calendar. One screen for the term window, the key dates
 * families ask about, and today's schedule (the same slots the home shows).
 */
import { ApiError } from '../api/ApiError';

export class CalendarPresenter {
  constructor(calendarModel) {
    this.model = calendarModel;
    this._render = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      calendar: null,
      sessions: [],
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
      const [calendar, sessions] = await Promise.all([this.model.calendar(), this.model.sessions()]);
      this._setState({
        status: 'content',
        calendar: calendar || {},
        sessions: (sessions && sessions.items) || [],
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the calendar.',
      });
    }
  }

  onRetry() {
    return this.load();
  }
}

export default CalendarPresenter;
