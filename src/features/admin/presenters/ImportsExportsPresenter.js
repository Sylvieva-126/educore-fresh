/**
 * AD33 — Bring in or download school data. The students flow is fully wired:
 *   • Export shares a CSV of the current student records (share sheet on
 *     phones, clipboard on web).
 *   • Import accepts pasted CSV rows (with or without the header line),
 *     validates them, and enrols each row through the normal AD03 endpoint,
 *     so the same code path works when the real Java API is connected.
 */
import { ApiError } from '../api/client';
import { toCsv, parseCsv, shareOrCopyCsv } from '../api/csv';

const EXPORT_COLUMNS = [
  { key: 'admissionNumber', header: 'admissionNumber' },
  { key: 'fullName', header: 'fullName' },
  { key: 'classLabel', header: 'class' },
  { key: 'department', header: 'department' },
  { key: 'gender', header: 'gender' },
  { key: 'dateOfBirth', header: 'dateOfBirth' },
  { key: 'status', header: 'status' },
  { key: 'guardianName', header: 'guardianName' },
  { key: 'guardianPhone', header: 'guardianPhone' },
  { key: 'guardianEmail', header: 'guardianEmail' },
];

export const IMPORT_CSV_HEADER =
  'firstName,lastName,gender,dateOfBirth,class,department,guardianName,guardianPhone,guardianEmail';

function rowToStudent(fields) {
  const [
    firstName = '',
    lastName = '',
    gender = '',
    dateOfBirth = '',
    classLabel = '',
    department = '',
    guardianName = '',
    guardianPhone = '',
  ] = fields;
  return { firstName, lastName, gender, dateOfBirth, classLabel, department, guardianName, guardianPhone };
}

function validateRow(student) {
  if (!student.firstName) return 'firstName is empty';
  if (!student.lastName) return 'lastName is empty';
  if (!student.classLabel) return 'class is empty';
  if (student.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(student.dateOfBirth)) {
    return 'dateOfBirth must be YYYY-MM-DD';
  }
  return null;
}

export class ImportsExportsPresenter {
  constructor(studentModel) {
    this.model = studentModel;
    this._render = null;
    this._alive = false;
    this.initialState = {
      pasted: '',
      rows: [], // valid, ready to import
      problems: [], // { rowNumber, problem }
      importing: false,
      notice: null,
      errorText: null,
      exporting: false,
      exportNotice: null,
    };
    this.state = this.initialState;
  }

  attach(render) {
    this._render = render;
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

  /** Re-parse and re-validate on every paste/keystroke. */
  onPasteChange(text) {
    const parsed = parseCsv(text);
    let dataRows = parsed;
    if (parsed.length > 0 && /firstname/i.test(parsed[0][0] || '')) {
      dataRows = parsed.slice(1); // tolerate the header line
    }
    const rows = [];
    const problems = [];
    dataRows.forEach((fields, index) => {
      const student = rowToStudent(fields);
      const problem = validateRow(student);
      if (problem) problems.push({ rowNumber: index + 1, problem });
      else rows.push({ rowNumber: index + 1, student });
    });
    this._setState({ pasted: text, rows, problems, notice: null, errorText: null });
  }

  async onExport() {
    this._setState({ exporting: true, exportNotice: null });
    try {
      const page = await this.model.listFull({ page: 1 });
      const items = page.items || [];
      if (items.length === 0) {
        this._setState({ exportNotice: 'There are no students to export yet.' });
        return;
      }
      const csv = toCsv(items, EXPORT_COLUMNS);
      const notice = await shareOrCopyCsv('students.csv', csv);
      this._setState({ exportNotice: `${notice} (${items.length} students)` });
    } catch {
      this._setState({ exportNotice: 'The export failed — try again in a moment.' });
    } finally {
      if (this._alive) this._setState({ exporting: false });
    }
  }

  async onImport() {
    if (this.state.importing || this.state.rows.length === 0) return;
    this._setState({ importing: true, errorText: null, notice: null });
    let imported = 0;
    try {
      for (const row of this.state.rows) {
        const s = row.student;
        await this.model.enrol({
          firstName: s.firstName,
          lastName: s.lastName,
          gender: s.gender || undefined,
          dateOfBirth: s.dateOfBirth || undefined,
          classLabel: s.classLabel,
          department: s.classLabel.startsWith('JSS') ? null : s.department || null,
          guardianName: s.guardianName || undefined,
          guardianPhone: s.guardianPhone || undefined,
        });
        imported += 1;
      }
      this._setState({
        importing: false,
        pasted: '',
        rows: [],
        problems: [],
        notice: `Imported ${imported} students — they now appear in the student list.`,
      });
    } catch (error) {
      this._setState({
        importing: false,
        errorText:
          error instanceof ApiError
            ? error.message
            : imported > 0
              ? `The import stopped after ${imported} students. Fix the CSV and import the rest.`
              : 'The import failed — check the pasted rows and try again.',
        notice: imported > 0 ? `${imported} students were imported before the stop.` : null,
      });
    }
  }
}

export default ImportsExportsPresenter;
