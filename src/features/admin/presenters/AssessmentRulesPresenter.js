/**
 * AD18 — Set exams and grading rules. One active policy per term: the CA vs
 * exam split, the pass mark, and the score each grade starts at. The server
 * checks the arithmetic; lock freezes the policy for the term.
 */
import { ApiError } from '../api/client';

export class AssessmentRulesPresenter {
  constructor(assessmentModel) {
    this.model = assessmentModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      policy: null,
      notice: null,
      errorText: null,
      saving: false,
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
      const page = await this.model.policies();
      this._setState({ status: 'content', policy: page.items[0] || null });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the grading rules.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  /**
   * Save the policy. The POST acts as an update while the policy is unlocked
   * — the server validates the arithmetic (weights sum to 100, grade bands
   * descend) and answers with a clear error otherwise.
   */
  async save(fields) {
    const policy = this.state.policy;
    if (!policy || this.state.saving) return;
    this._setState({ saving: true, notice: null, errorText: null });
    try {
      const result = await this.model.createPolicy(fields);
      this._setState({
        saving: false,
        policy: result.policy,
        notice: 'Grading rules saved — every report card now uses them.',
      });
    } catch (error) {
      this._setState({
        saving: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The rules were not saved.',
      });
    }
  }

  async lock() {
    const policy = this.state.policy;
    if (!policy || this.state.saving) return;
    this._setState({ saving: true, notice: null, errorText: null });
    try {
      const result = await this.model.lockPolicy(policy.id);
      this._setState({
        saving: false,
        policy: result.policy,
        notice: 'Policy locked — marks entry can start. Unlock needs the bursar.',
      });
    } catch (error) {
      this._setState({
        saving: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The policy was not locked.',
      });
    }
  }
}

export default AssessmentRulesPresenter;
