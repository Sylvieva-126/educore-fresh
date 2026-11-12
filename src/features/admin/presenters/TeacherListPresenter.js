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
      importing: false,
      importResult: null, // { imported: [{row, teacher}], failed: [{row, name, error}] }
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

  /** Paste-CSV import: one teacher per line —
      "Full name, Email, Phone, Subject|Subject, Form class".
      Every row is validated by the same rules as the manual form; the server
      answers per-row results so the office sees exactly what failed. */
  async importCsv(text) {
    const rows = parseTeacherCsv(text);
    if (!rows.length) {
      this._setState({
        notice: null,
        errorText:
          'Paste at least one line, e.g. "Mr. Emeka Obi, emeka.obi@gmail.com, 0810 123 4567, Mathematics|Basic Science, JSS2 A".',
      });
      return false;
    }
    this._setState({ importing: true, notice: null, errorText: null, importResult: null });
    try {
      const result = await this.model.importRows(rows);
      const imported = result.imported || [];
      const failed = result.failed || [];
      await this.load({ showLoading: false });
      this._setState({
        importing: false,
        importResult: { imported, failed },
        notice:
          `Imported ${imported.length} teacher${imported.length === 1 ? '' : 's'}` +
          (failed.length ? ` — ${failed.length} line${failed.length === 1 ? '' : 's'} need fixing (see below).` : '.'),
      });
      return true;
    } catch (error) {
      this._setState({
        importing: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The import did not run — check the lines and try again.',
      });
      return false;
    }
  }
}

/** "Name, email, phone, Maths|Biology, JSS2 A" → one row object per line.
    Subjects are pipe-separated because names themselves carry commas. */
export function parseTeacherCsv(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      return {
        fullName: parts[0] || '',
        email: parts[1] || '',
        phone: parts[2] || '',
        subjects: (parts[3] || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean),
        formClass: parts[4] || '',
      };
    });
}

export default TeacherListPresenter;
