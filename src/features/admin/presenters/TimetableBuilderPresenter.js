/**
 * AD14 — Build the weekly timetable. One draft per class: 5 days × 6 periods,
 * tap an empty period to pick the subject and the teacher. The draft is saved
 * after every fill; "Send for review" checks it is complete first.
 */
import { ApiError } from '../api/client';

export class TimetableBuilderPresenter {
  constructor(timetableModel, structureModel) {
    this.model = timetableModel;
    this.structureModel = structureModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'picking', // picking | loading | content | error
      draft: null,
      classOptions: [],
      subjects: [], // subjects taught in the draft's class
      teachers: [], // active teachers for the slot picker
      notice: null,
      errorText: null,
      saving: false,
      sendingReview: false,
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

  /** No class chosen yet — load the options for the picker sheet. */
  async pickClass() {
    this._setState({ status: 'picking', errorText: null });
    try {
      const page = await this.structureModel.classes();
      this._setState({ classOptions: page.items, status: 'picking' });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the class list.',
      });
    }
  }

  /** Open the class's in-progress draft, or start one. */
  async openForClass(classLabel) {
    this._setState({ status: 'loading', notice: null, errorText: null });
    try {
      const page = await this.model.drafts();
      const existing = page.items.find((d) => d.classLabel === classLabel && d.status !== 'Published');
      const draft = existing
        ? (await this.model.draftById(existing.id)).draft
        : (await this.model.createDraft({ classLabel })).draft;
      const [subjectsPage, teachersPage] = await Promise.all([
        this.structureModel.subjects(),
        this.model.assignmentCandidates(),
      ]);
      this._setState({
        status: 'content',
        draft,
        subjects: subjectsPage.items.filter((s) => s.classes.includes(draft.classLabel)),
        teachers: teachersPage.items,
        errorText: null,
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not open the timetable.',
      });
    }
  }

  /** Fill one period and save the whole draft (small payloads, demo-friendly). */
  async fillSlot(day, period, subject, teacherName) {
    const draft = this.state.draft;
    if (!draft || this.state.saving) return;
    const slots = draft.slots.map((s) =>
      s.day === day && s.period === period ? { ...s, subject, teacherName } : s,
    );
    this._setState({ saving: true, errorText: null });
    try {
      const saved = await this.model.saveDraft(draft.id, { slots });
      this._setState({ saving: false, draft: saved.draft });
    } catch (error) {
      this._setState({
        saving: false,
        errorText: error instanceof ApiError ? error.message : 'The period was not saved.',
      });
    }
  }

  async sendForReview() {
    const draft = this.state.draft;
    if (!draft || this.state.sendingReview) return;
    this._setState({ sendingReview: true, notice: null, errorText: null });
    try {
      const result = await this.model.requestReview(draft.id);
      this._setState({
        sendingReview: false,
        draft: result.draft,
        notice: 'Sent for review — publish it from "Review and publish the timetable".',
      });
    } catch (error) {
      this._setState({
        sendingReview: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'Could not send for review.',
      });
    }
  }

  onRetry() {
    return this.state.draft ? this.openForClass(this.state.draft.classLabel) : this.pickClass();
  }
}

export default TimetableBuilderPresenter;
