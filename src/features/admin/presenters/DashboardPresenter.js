/**
 * AD01 — Admin home. Loads one dashboard payload and splits it into the three
 * sections of the design: attendance totals, "needs your attention", and
 * today's schedule. Counts open the matching lists (routing lives here).
 */
import { ApiError } from '../api/client';

export class DashboardPresenter {
  constructor(dashboardModel) {
    this.model = dashboardModel;
    this._render = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      schoolName: '',
      staffName: '',
      dateLabel: '',
      attendance: null,
      attention: [],
      todaySchedule: [],
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
      const data = await this.model.load();
      this._setState({ status: 'content', ...data });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the dashboard.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  /** Each count on the home screen opens the list it came from. */
  onViewAttendance() {
    if (this._navigation) this._navigation.navigate('AD16 Placeholder');
  }

  onOpenAttention(item) {
    if (!this._navigation) return;
    const routeByType = {
      results: 'AD19 Placeholder',
      payment: 'AD24 Placeholder',
      complaint: 'AD31 Placeholder',
    };
    this._navigation.navigate(routeByType[item.type] || 'AD16 Placeholder');
  }

  onEnrolStudent() {
    if (this._navigation) this._navigation.navigate('AD03 Placeholder');
  }

  onViewCalendar() {
    if (this._navigation) this._navigation.navigate('AD11 Placeholder');
  }
}

export default DashboardPresenter;
