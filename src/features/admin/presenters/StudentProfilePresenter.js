/**
 * AD04 — Student profile. Loads profile + enrolments + fee status in parallel,
 * and owns the two guarded actions (class move, withdrawal) with the safe
 * submission states from the design system: draft → saving → accepted/failed.
 */
import { ApiError } from '../api/client';

export class StudentProfilePresenter {
  constructor(studentModel) {
    this.model = studentModel;
    this._render = null;
    this._alive = false;
    this._studentId = null;
    this.initialState = {
      status: 'loading', // loading | content | error
      student: null,
      enrolments: [],
      feeStatus: null,
      errorText: null,
      // Safe submission states for class move / withdrawal:
      // 'draft' | 'saving' | 'accepted' | 'failed'
      classMoveState: 'draft',
      classMoveError: null,
      withdrawalState: 'draft',
      withdrawalError: null,
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

  async load(studentId) {
    this._studentId = studentId;
    this._setState({ status: 'loading', errorText: null });
    try {
      const [student, enrolments, feeStatus] = await Promise.all([
        this.model.byId(studentId),
        this.model.enrolments(studentId).catch(() => []),
        this.model.feeStatus(studentId).catch(() => null),
      ]);
      this._setState({ status: 'content', student, enrolments, feeStatus });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load this student.',
      });
    }
  }

  onRetry() {
    if (this._studentId) return this.load(this._studentId);
  }

  /** Move class: the backend keeps one identity per student across years. */
  async confirmClassMove(targetClassId, effectiveFrom) {
    if (this.state.classMoveState === 'saving') return;
    this._setState({ classMoveState: 'saving', classMoveError: null });
    try {
      await this.model.moveClass(this._studentId, {
        targetClassId,
        effectiveFrom,
      });
      this._setState({ classMoveState: 'accepted' });
      await this.load(this._studentId); // refresh the header class label
    } catch (error) {
      this._setState({
        classMoveState: 'failed',
        classMoveError:
          error instanceof ApiError ? error.message : 'The class move was not accepted.',
      });
    }
  }

  /** Withdraw: confirmed twice in the View; list filter must include the status. */
  async confirmWithdrawal(reason, effectiveDate) {
    if (this.state.withdrawalState === 'saving') return;
    this._setState({ withdrawalState: 'saving', withdrawalError: null });
    try {
      await this.model.withdraw(this._studentId, { reason, effectiveDate });
      this._setState({ withdrawalState: 'accepted' });
    } catch (error) {
      this._setState({
        withdrawalState: 'failed',
        withdrawalError:
          error instanceof ApiError ? error.message : 'The withdrawal was not accepted.',
      });
    }
  }

  onEditStudent() {
    if (this._navigation && this._studentId) {
      this._navigation.navigate('StudentForm', { studentId: this._studentId });
    }
  }

  onViewReports() {
    if (this._navigation && this._studentId) {
      this._navigation.navigate('Reports', { studentId: this._studentId });
    }
  }
}

export default StudentProfilePresenter;
