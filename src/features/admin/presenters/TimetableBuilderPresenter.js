/**
 * AD14 — Build the weekly timetable. One draft per class: 5 days × 6 periods,
 * tap an empty period to pick the subject and the teacher. The draft is saved
 * after every fill; "Send for review" checks it is complete first.
 */
import { ApiError } from '../api/client';

const BASE_TIMES = [
  '08:00 – 08:40', '08:45 – 09:25', '09:30 – 10:10',
  '10:40 – 11:20', '11:25 – 12:05', '12:10 – 12:50',
];
const EXTRA_TIMES = { 7: '12:55 – 13:35', 8: '13:40 – 14:20' };

/** Six fixed teaching periods, then up to two activity slots per day. */
function periodTime(period) {
  return BASE_TIMES[period - 1] || EXTRA_TIMES[period] || 'TBD';
}

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
      const classLabel = draft.classLabel;
      const inClass = (s) => s.classes.includes(classLabel);
      this._setState({
        status: 'content',
        draft,
        // Every subject is offered; the class's own subjects sort first.
        subjects: [...subjectsPage.items].sort((a, b) => (inClass(b) ? 1 : 0) - (inClass(a) ? 1 : 0)),
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

  /** Point an empty period at an activity instead of a subject. */
  async fillActivity(day, period, activity) {
    const draft = this.state.draft;
    if (!draft || this.state.saving) return;
    const slots = draft.slots.map((s) =>
      s.day === day && s.period === period
        ? { ...s, subject: null, teacherName: null, activity }
        : s,
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

  /** Set or override one period's time label (any format the school uses). */
  async setTime(day, period, time) {
    const draft = this.state.draft;
    if (!draft || this.state.saving) return;
    const slots = draft.slots.map((s) => (s.day === day && s.period === period ? { ...s, time } : s));
    this._setState({ saving: true, errorText: null });
    try {
      const saved = await this.model.saveDraft(draft.id, { slots });
      this._setState({ saving: false, draft: saved.draft, notice: `Period time set — ${time}.` });
    } catch (error) {
      this._setState({
        saving: false,
        errorText: error instanceof ApiError ? error.message : 'The time was not saved.',
      });
    }
  }

  /** Append a new period to a day: a subject with its teacher, or an activity. */
  async appendSlot(day, payload) {
    const draft = this.state.draft;
    if (!draft || this.state.saving) return;
    const nextPeriod = draft.slots.filter((s) => s.day === day).length + 1;
    if (nextPeriod > 8) return;
    const slots = [
      ...draft.slots,
      {
        day,
        period: nextPeriod,
        time: periodTime(nextPeriod),
        subject: null,
        teacherName: null,
        activity: null,
        ...payload,
      },
    ];
    this._setState({ saving: true, errorText: null });
    try {
      const saved = await this.model.saveDraft(draft.id, { slots });
      this._setState({ saving: false, draft: saved.draft });
    } catch (error) {
      this._setState({
        saving: false,
        errorText: error instanceof ApiError ? error.message : 'The period was not added.',
      });
    }
  }

  /** Remove a period from a day; that day renumbers, keeping each period's time. */
  async removeSlot(day, period) {
    const draft = this.state.draft;
    if (!draft || this.state.saving) return;
    const rest = draft.slots.filter((s) => s.day !== day);
    const dayRest = draft.slots
      .filter((s) => s.day === day && s.period !== period)
      .sort((a, b) => a.period - b.period)
      .map((s, i) => ({ ...s, period: i + 1 }));
    this._setState({ saving: true, errorText: null });
    try {
      const saved = await this.model.saveDraft(draft.id, { slots: [...rest, ...dayRest] });
      this._setState({ saving: false, draft: saved.draft });
    } catch (error) {
      this._setState({
        saving: false,
        errorText: error instanceof ApiError ? error.message : 'The period was not removed.',
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
