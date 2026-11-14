/**
 * AD33 — Bring in or download school data. The students flow is fully wired:
 *   • Export shares a CSV of the current student records (share sheet on
 *     phones, clipboard on web).
 *   • Import accepts pasted CSV rows (with or without the header line),
 *     validates them, and enrols each row through the normal AD03 endpoint,
 *     so the same code path works when the real Java API is connected.
 */
import { ApiError } from '../api/ApiError';
import { toCsv, parseCsv, shareOrCopyCsv } from '../api/csv';
import {
  cleanText,
  isValidClassLabel,
  isValidDateOfBirth,
  isValidEmail,
  isValidPhone,
  normalizeClassLabel,
  normalizeEmail,
  normalizePhone,
} from '../utils/validators';

const CLASS_HELP = 'class must be one of: JSS1 A, JSS1 B, JSS2 A, JSS3 A, SSS1 A, SSS2 A, SSS3 A';

// The export writes ONE row per student. The import reads these back BY COLUMN
// NAME (the header row carries "fullName", "class", "guardianPhone"…), so an
// exported file re-imports without the old "class must be one of…" error that
// came from positional mapping. Columns match the live Java export shape.
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

// The import accepts EITHER of these two column shapes (the export shape
// below, or the manual first-name/last-name template). When a header row is
// present, columns are read BY NAME, so an exported file re-imports cleanly
// even though its order differs from the manual template. When there is no
// header, the manual template order is assumed.
const MANUAL_TEMPLATE_COLUMNS = [
  'firstName',
  'lastName',
  'gender',
  'dateOfBirth',
  'class',
  'department',
  'guardianName',
  'guardianPhone',
  'guardianEmail',
];

// Split a single "fullName" cell ("Amara Okafor") into first/last the same way
// the enrol form does — the first token is the first name, the rest is last.
function splitFullName(full) {
  const parts = String(full || '').trim().split(/\s+/);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
}

// Map one CSV row (an array of cells) to a student, using the header map when
// available. Unknown header names are ignored, so the export's extra
// admissionNumber/status columns do not break the import.
function fieldsToStudent(fields, headerMap) {
  const get = (key) => {
    const lookup = String(key).toLowerCase();
    if (headerMap && headerMap.has(lookup)) {
      const idx = headerMap.get(lookup);
      return idx < fields.length ? fields[idx] : '';
    }
    return '';
  };
  const hasHeader = Boolean(headerMap);
  let firstName = '';
  let lastName = '';
  if (hasHeader) {
    // Export uses fullName; the manual template uses firstName/lastName.
    const fullName = get('fullName');
    if (fullName) {
      const split = splitFullName(fullName);
      firstName = split.firstName;
      lastName = split.lastName;
    } else {
      firstName = get('firstName');
      lastName = get('lastName');
    }
  } else {
    // Manual template order (no header).
    [firstName, lastName] = [fields[0] || '', fields[1] || ''];
  }
  const classLabel = hasHeader ? get('class') : fields[4] || '';
  return {
    firstName: cleanText(firstName),
    lastName: cleanText(lastName),
    gender: cleanText(hasHeader ? get('gender') : fields[2] || ''),
    dateOfBirth: cleanText(hasHeader ? get('dateOfBirth') : fields[3] || ''),
    classLabel: normalizeClassLabel(classLabel),
    department: cleanText(hasHeader ? get('department') : fields[5] || ''),
    guardianName: cleanText(hasHeader ? get('guardianName') : fields[6] || ''),
    guardianPhone: normalizePhone(hasHeader ? get('guardianPhone') : fields[7] || ''),
    guardianEmail: normalizeEmail(hasHeader ? get('guardianEmail') : fields[8] || ''),
  };
}

// Decide whether a row is a header: it must contain at least one known column
// name AND no value that looks like real data (a name or class label). Header
// names are matched CASE-INSENSITIVELY (export uses "fullName"/"classLabel",
// the manual template uses "firstName"/"class") and the map stores lowercased
// keys; get() looks them up lowercased too, so "FullName" and "fullName" both
// resolve.
function buildHeaderMap(cells) {
  const known = new Set([
    ...MANUAL_TEMPLATE_COLUMNS,
    'fullName',
    'admissionNumber',
    'classLabel',
    'class',
    'status',
  ].map((s) => s.toLowerCase()));
  const matches = cells.filter((c) => known.has(String(c || '').trim().toLowerCase()));
  if (matches.length < 2) return null; // not enough column names to be a header
  const map = new Map();
  cells.forEach((cell, idx) => {
    const name = String(cell || '').trim().toLowerCase();
    if (known.has(name)) map.set(name, idx);
  });
  return map;
}

export const IMPORT_CSV_HEADER =
  'firstName,lastName,gender,dateOfBirth,class,department,guardianName,guardianPhone,guardianEmail';

function validateRow(student) {
  if (!student.firstName) return 'firstName is empty';
  if (!student.lastName) return 'lastName is empty';
  if (!student.classLabel) return 'class is empty';
  if (!isValidClassLabel(student.classLabel)) return CLASS_HELP;
  if (student.dateOfBirth && !isValidDateOfBirth(student.dateOfBirth)) {
    return 'dateOfBirth must be a real date in YYYY-MM-DD format';
  }
  if (student.guardianPhone && !isValidPhone(student.guardianPhone)) {
    return 'guardianPhone must be a valid number, e.g. +234 803 111 2233';
  }
  if (student.guardianEmail && !isValidEmail(student.guardianEmail)) {
    return 'guardianEmail must be a valid email address';
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
    if (parsed.length === 0) {
      this._setState({ pasted: text, rows: [], problems: [], notice: null, errorText: null });
      return;
    }
    // Detect a header row: if the first row's cells match known column names,
    // build a name→index map and read every data row BY COLUMN NAME. This is
    // what makes an exported file re-import cleanly (the export order differs
    // from the manual template order, and export uses "fullName" while the
    // template uses firstName/lastName).
    const headerMap = buildHeaderMap(parsed[0]);
    const dataRows = headerMap ? parsed.slice(1) : parsed;
    const rows = [];
    const problems = [];
    dataRows.forEach((fields, index) => {
      // Skip a trailing empty line that survived the trim filter.
      if (fields.every((f) => !String(f || '').trim())) return;
      const student = fieldsToStudent(fields, headerMap);
      const problem = validateRow(student);
      if (problem) problems.push({ rowNumber: index + 1, problem });
      else rows.push({ rowNumber: index + 1, student });
    });
    this._setState({ pasted: text, rows, problems, notice: null, errorText: null });
  }

  async onExport() {
    this._setState({ exporting: true, exportNotice: null });
    try {
      // Walk every page so the CSV holds ALL students, not just the first 10.
      const items = [];
      let page = 1;
      let pages = 1;
      do {
        const result = await this.model.listFull({ page });
        items.push(...(result.items || []));
        pages = result.pages || 1;
        page += 1;
      } while (page <= pages);
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
          guardianEmail: s.guardianEmail || undefined,
        });
        imported += 1;
      }
      this._setState({
        importing: false,
        pasted: '',
        rows: [],
        problems: [],
        notice: `Imported ${imported} students — they are at the END of the student list (last pages).`,
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
