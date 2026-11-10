/**
 * Built-in demo data — used ONLY while no real backend is configured.
 *
 * Why this exists: until a Java API is connected there is nowhere real to
 * fetch from, so every screen showed "Network error — check your connection"
 * (web additionally logged CORS blocks for the placeholder domain). In demo
 * mode (API_CONFIG.demo in client.js) the central client routes every request
 * through demoRequest() below instead of the network, and the built screens
 * render realistic Greenfield sample content on any device — no server, no
 * CORS errors on web, no network errors on the phone.
 *
 * Covered routes (everything else answers benignly so nothing crashes):
 *   GET  dashboard                     → AD01 Admin home
 *   GET  students                      → AD02 list (search + filters + paging)
 *   GET  students/{id}                 → AD04 profile header
 *   GET  students/{id}/enrolments      → AD04 enrolment history
 *   GET  students/{id}/fee-status      → AD04 fee summary line
 *   POST students/{id}/class-moves     → AD04 action (updates the demo record)
 *   POST students/{id}/withdrawals     → AD04 action (marks the demo record)
 *   GET  finance/invoices              → AD22 list (status filter + paging)
 *   GET/POST notices + publish/archive → AD28 announcements
 *
 * To connect the real Java API later: create a .env file in the project root
 * with  EXPO_PUBLIC_API_URL=https://your-api.example.com/api/v1  and restart
 * with `npx expo start -c`. Demo mode switches off automatically and every
 * call goes to the network again.
 */

const SCHOOL_NAME = 'Greenfield Secondary School';
const SESSION_LABEL = '2026/2027';

/* ── AD01 — Admin home ──────────────────────────────────────────────── */

const DASHBOARD = {
  schoolName: SCHOOL_NAME,
  sessionLabel: SESSION_LABEL,
  termLabel: 'First Term',
  staffName: 'Admin',
  registersSubmitted: 21,
  registersExpected: 24,
  missingRegisters: 3,
  absentStudents: 12,
  lateArrivals: 4,
  attention: [
    {
      id: 'atn-1',
      type: 'results',
      title: 'Result packages returned for corrections',
      detail: 'SSS1 A and SSS2 A mathematics sheets need teacher sign-off',
      countLabel: '3 pending',
    },
    {
      id: 'atn-2',
      type: 'payment',
      title: 'Paystack settlements to reconcile',
      detail: 'Two card payments need matching to invoices',
      countLabel: '2 open',
    },
    {
      id: 'atn-3',
      type: 'complaint',
      title: 'New guardian complaint',
      detail: 'Transport route change request for JSS2 A',
      countLabel: '1 new',
    },
  ],
  todaySchedule: [
    { id: 'sch-1', time: '08:00', subject: 'Morning assembly', detail: 'Main hall · all classes' },
    { id: 'sch-2', time: '10:30', subject: 'SSS1 A · Mathematics', detail: 'Continuous assessment marks close today' },
    { id: 'sch-3', time: '14:00', subject: 'Staff briefing', detail: 'Staff room · first-term review' },
  ],
};

/* ── AD02/AD04 — Students ───────────────────────────────────────────── */

const STUDENTS = [
  { id: 1, fullName: 'Amara Okafor', admissionNumber: 'GSS/2026/0141', classLabel: 'SSS1 A', department: 'Science', status: 'Active', dateOfBirth: '2010-04-17', gender: 'Female', admissionDate: '2026-09-14', guardianName: 'Mrs. Ngozi Okafor', guardianPhone: '+234 803 111 2233', guardianEmail: 'ngozi.okafor@example.com', address: '12 Palm Grove Road, Enugu' },
  { id: 2, fullName: 'Chiamaka Eze', admissionNumber: 'GSS/2026/0142', classLabel: 'SSS1 A', department: 'Science', status: 'Active', dateOfBirth: '2010-08-02', gender: 'Female', admissionDate: '2026-09-14', guardianName: 'Mr. Chidi Eze', guardianPhone: '+234 805 222 3344', guardianEmail: 'chidi.eze@example.com', address: '4 Abakpa Nike Street, Enugu' },
  { id: 3, fullName: 'Ngozi Ibe', admissionNumber: 'GSS/2026/0143', classLabel: 'SSS1 A', department: 'Science', status: 'Active', dateOfBirth: '2010-01-25', gender: 'Female', admissionDate: '2026-09-15', guardianName: 'Mrs. Ada Ibe', guardianPhone: '+234 807 333 4455', guardianEmail: 'ada.ibe@example.com', address: '8 Ogui Road, Enugu' },
  { id: 4, fullName: 'Tunde Balogun', admissionNumber: 'GSS/2026/0144', classLabel: 'SSS2 A', department: 'Business / Commercial', status: 'Active', dateOfBirth: '2009-06-11', gender: 'Male', admissionDate: '2026-09-14', guardianName: 'Mr. Kunle Balogun', guardianPhone: '+234 802 444 5566', guardianEmail: 'kunle.balogun@example.com', address: '23 New Haven Road, Enugu' },
  { id: 5, fullName: 'Fatima Bello', admissionNumber: 'GSS/2026/0145', classLabel: 'SSS2 A', department: 'Humanities / Arts', status: 'Active', dateOfBirth: '2009-12-30', gender: 'Female', admissionDate: '2026-09-14', guardianName: 'Alhaji Sani Bello', guardianPhone: '+234 806 555 6677', guardianEmail: 'sani.bello@example.com', address: '5 Garki Avenue, Enugu' },
  { id: 6, fullName: 'Daniel Ogun', admissionNumber: 'GSS/2026/0146', classLabel: 'SSS3 A', department: 'Science', status: 'Active', dateOfBirth: '2008-03-09', gender: 'Male', admissionDate: '2026-09-14', guardianName: 'Dr. Kemi Ogun', guardianPhone: '+234 809 666 7788', guardianEmail: 'kemi.ogun@example.com', address: '17 Independence Layout, Enugu' },
  { id: 7, fullName: 'Zainab Musa', admissionNumber: 'GSS/2026/0147', classLabel: 'SSS3 A', department: 'Business / Commercial', status: 'Active', dateOfBirth: '2008-07-21', gender: 'Female', admissionDate: '2026-09-14', guardianName: 'Alhaji Yusuf Musa', guardianPhone: '+234 803 777 8899', guardianEmail: 'yusuf.musa@example.com', address: '31 New Market Road, Enugu' },
  { id: 8, fullName: 'Emeka Nwosu', admissionNumber: 'GSS/2026/0148', classLabel: 'JSS1 A', department: null, status: 'Active', dateOfBirth: '2012-05-14', gender: 'Male', admissionDate: '2026-09-14', guardianName: 'Mr. Obi Nwosu', guardianPhone: '+234 808 888 9900', guardianEmail: 'obi.nwosu@example.com', address: '9 Achara Layout, Enugu' },
  { id: 9, fullName: 'Aisha Mohammed', admissionNumber: 'GSS/2026/0149', classLabel: 'JSS1 A', department: null, status: 'Active', dateOfBirth: '2012-09-28', gender: 'Female', admissionDate: '2026-09-15', guardianName: 'Hajiya Amina Mohammed', guardianPhone: '+234 805 999 0011', guardianEmail: 'amina.mohammed@example.com', address: '14 Coal City Gardens, Enugu' },
  { id: 10, fullName: 'Kelechi Umeh', admissionNumber: 'GSS/2026/0150', classLabel: 'JSS2 A', department: null, status: 'Active', dateOfBirth: '2011-11-03', gender: 'Male', admissionDate: '2026-09-14', guardianName: 'Mrs. Ify Umeh', guardianPhone: '+234 802 101 1122', guardianEmail: 'ify.umeh@example.com', address: '2 Trans Ekulu Road, Enugu' },
  { id: 11, fullName: 'Yusuf Abubakar', admissionNumber: 'GSS/2026/0151', classLabel: 'JSS2 A', department: null, status: 'Active', dateOfBirth: '2011-02-19', gender: 'Male', admissionDate: '2026-09-14', guardianName: 'Alhaji Bello Abubakar', guardianPhone: '+234 806 202 2233', guardianEmail: 'bello.abubakar@example.com', address: '6 Emene Road, Enugu' },
  { id: 12, fullName: 'Blessing Adeyemi', admissionNumber: 'GSS/2025/0098', classLabel: 'JSS3 A', department: null, status: 'Withdrawn', dateOfBirth: '2011-04-08', gender: 'Female', admissionDate: '2025-09-15', guardianName: 'Pastor Samuel Adeyemi', guardianPhone: '+234 807 303 3344', guardianEmail: 'samuel.adeyemi@example.com', address: '19 Uwani, Enugu' },
];

const PREVIOUS_CLASS = {
  'SSS3 A': 'SSS2 A',
  'SSS2 A': 'SSS1 A',
  'SSS1 A': 'JSS3 A',
  'JSS3 A': 'JSS2 A',
  'JSS2 A': 'JSS1 A',
  'JSS1 A': 'Primary 6',
};

function findStudent(id) {
  return STUDENTS.find((s) => s.id === Number(id)) || null;
}

function filterStudents(query) {
  const q = (query.q || query.search || '').toString().trim().toLowerCase();
  const classId = query.classId && query.classId !== 'all' ? query.classId : null;
  const department = query.department && query.department !== 'all' ? query.department : null;
  const status = query.status && query.status !== 'all' ? query.status : null;

  return STUDENTS.filter((s) => {
    if (classId && s.classLabel !== classId) return false;
    if (department && s.department !== department) return false;
    if (status && s.status !== status) return false;
    if (q) {
      const haystack = `${s.fullName} ${s.admissionNumber}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function enrolmentsFor(id) {
  const s = findStudent(id);
  if (!s) return [];
  const rows = [
    {
      id: `${s.id}-2026`,
      session: SESSION_LABEL,
      sessionLabel: `${SESSION_LABEL} · First Term`,
      classLabel: s.classLabel,
      status: s.status,
    },
  ];
  if (PREVIOUS_CLASS[s.classLabel]) {
    rows.push({
      id: `${s.id}-2025`,
      session: '2025/2026',
      sessionLabel: '2025/2026 · Third Term',
      classLabel: PREVIOUS_CLASS[s.classLabel],
      status: 'Completed',
    });
  }
  return rows;
}

function feeStatusFor(id) {
  const s = findStudent(id);
  if (!s) return null;
  const invoice = INVOICES.find((inv) => inv.studentName === s.fullName);
  if (s.status === 'Withdrawn') {
    return { summary: 'Account closed — nothing outstanding', planName: '—' };
  }
  if (!invoice || invoice.status === 'Paid') {
    return { summary: 'Up to date — nothing outstanding', planName: invoice ? invoice.planName : 'First Term 2026/2027 fees' };
  }
  const owing = (invoice.balanceLabel || '').replace('Balance ', '');
  return { summary: `${owing} outstanding for ${invoice.planName}`, planName: invoice.planName };
}

/* ── AD22 — Invoices ────────────────────────────────────────────────── */

const INVOICES = [
  { id: 'inv-1', number: 'INV-2026-0141', studentName: 'Amara Okafor', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28' },
  { id: 'inv-2', number: 'INV-2026-0142', studentName: 'Chiamaka Eze', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦45,000', status: 'PartiallyPaid', dueDate: '2026-09-28' },
  { id: 'inv-3', number: 'INV-2026-0144', studentName: 'Tunde Balogun', planName: 'Tuition + boarding 2026/2027', amountLabel: '₦120,000', balanceLabel: 'Balance ₦120,000', status: 'Overdue', dueDate: '2026-09-28' },
  { id: 'inv-4', number: 'INV-2026-0145', studentName: 'Fatima Bello', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28' },
  { id: 'inv-5', number: 'INV-2026-0146', studentName: 'Daniel Ogun', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦30,000', status: 'PartiallyPaid', dueDate: '2026-09-28' },
  { id: 'inv-6', number: 'INV-2026-0148', studentName: 'Emeka Nwosu', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦85,000', status: 'Draft', dueDate: '2026-09-28' },
  { id: 'inv-7', number: 'INV-2026-0147', studentName: 'Zainab Musa', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28' },
];

function filterInvoices(query) {
  const q = (query.q || query.search || '').toString().trim().toLowerCase();
  const status = query.status && query.status !== 'all' ? query.status : null;
  return INVOICES.filter((inv) => {
    if (status && inv.status !== status) return false;
    if (q) {
      const haystack = `${inv.studentName} ${inv.number}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/* ── AD28 — Notices (kept mutable so create / publish / archive work) ── */

let NOTICES = [
  {
    id: 'ntc-1',
    title: 'Mid-term break — Thursday 29 to Friday 30 October',
    body: 'School closes at 1:00 pm on Wednesday 28 October and resumes on Monday 2 November. Boarders return by 4:00 pm on Sunday.',
    audience: 'ALL',
    audienceLabel: 'Whole school',
    status: 'Published',
    publishedAt: '2026-10-26',
  },
  {
    id: 'ntc-2',
    title: 'PTA general meeting — Saturday 14 November, 10:00 am',
    body: 'Agenda: first-term results timeline, school bus routes, and the science laboratory upgrade. All guardians are welcome.',
    audience: 'ALL',
    audienceLabel: 'Whole school',
    status: 'Published',
    publishedAt: '2026-11-02',
  },
  {
    id: 'ntc-3',
    title: 'Inter-house sports — staff duty roster',
    body: 'Please confirm your duty slot with the sports master before Friday.',
    audience: 'ROLE',
    audienceLabel: 'Teachers only',
    status: 'Draft',
    publishedAt: null,
  },
];

function audienceLabelFor(audience) {
  if (audience === 'ROLE') return 'Teachers only';
  if (audience === 'CLASS') return 'One class';
  return 'Whole school';
}

/* ── The demo router the API client calls in demo mode ──────────────── */

function paginate(items, page = 1, perPage = 10) {
  const p = Math.max(1, Number(page) || 1);
  const start = (p - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page: p,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
  };
}

function todayLabel() {
  return new Date().toISOString().slice(0, 10);
}

/* Records created in demo mode (AD03 enrol + AD33 import) — counters follow
   the seeded admission numbers (…0151 is the last seed). */
let nextStudentId = 13;
let nextAdmissionNumber = 152;

export async function demoRequest({ path: route, method = 'GET', query = {}, body = null }) {
  await new Promise((resolve) => setTimeout(resolve, 250)); // let loading states show
  const m = String(method || 'GET').toUpperCase();
  const seg = String(route || '').split('/').filter(Boolean);

  // AD01 — dashboard
  if (seg[0] === 'dashboard' && m === 'GET') return DASHBOARD;

  // AD03/AD33 — enrol one student (the import loop reuses this same route)
  if (seg[0] === 'student-enrolments' && m === 'POST') {
    const cls = (body && body.classLabel) || 'JSS1 A';
    const student = {
      id: nextStudentId,
      fullName: `${(body && body.firstName) || ''} ${(body && body.lastName) || ''}`.trim(),
      admissionNumber: `GSS/2026/${String(nextAdmissionNumber).padStart(4, '0')}`,
      classLabel: cls,
      department: cls.startsWith('JSS') ? null : (body && body.department) || null,
      status: 'Active',
      dateOfBirth: (body && body.dateOfBirth) || '',
      gender: (body && body.gender) || '',
      admissionDate: todayLabel(),
      guardianName: (body && body.guardianName) || '',
      guardianPhone: (body && body.guardianPhone) || '',
      guardianEmail: (body && body.guardianEmail) || '',
      address: (body && body.address) || '',
    };
    nextStudentId += 1;
    nextAdmissionNumber += 1;
    STUDENTS.push(student);
    return student;
  }

  // AD02/AD20/AD33 — export acknowledgement (the CSV itself is built on-device)
  if (seg[0] === 'exports' && m === 'POST') {
    return { ok: true, type: (body && body.type) || 'unknown', rowCount: STUDENTS.length };
  }

  // AD02/AD03/AD04 — students
  if (seg[0] === 'students') {
    if (seg.length === 1) {
      if (m === 'GET') return paginate(filterStudents(query), query.page);
      return { ok: true };
    }
    const student = findStudent(seg[1]);
    if (seg.length === 2) {
      if (m === 'GET') return student || STUDENTS[0];
      if (m === 'PATCH' && student) {
        // AD03 — edit core details
        const b = body || {};
        if (b.firstName || b.lastName) {
          const oldParts = String(student.fullName || '').split(' ');
          student.fullName = `${b.firstName || oldParts[0] || ''} ${
            b.lastName || oldParts.slice(1).join(' ') || ''
          }`.trim();
        }
        ['gender', 'dateOfBirth', 'guardianName', 'guardianPhone', 'guardianEmail', 'address'].forEach(
          (key) => {
            if (b[key] !== undefined) student[key] = b[key];
          },
        );
        if (b.classLabel) {
          student.classLabel = b.classLabel;
          student.department = b.classLabel.startsWith('JSS') ? null : b.department || student.department;
        } else if (b.department !== undefined) {
          student.department = b.department;
        }
        return student;
      }
      return { ok: true };
    }
    if (seg[2] === 'enrolments' && m === 'GET') return enrolmentsFor(seg[1]);
    if (seg[2] === 'fee-status' && m === 'GET') return feeStatusFor(seg[1]);
    if (seg[2] === 'class-moves' && student) {
      if (body && body.targetClassId) {
        student.classLabel = body.targetClassId;
        student.department = student.classLabel.startsWith('JSS') ? null : student.department;
      }
      return { ok: true };
    }
    if (seg[2] === 'withdrawals' && student) {
      student.status = 'Withdrawn';
      return { ok: true };
    }
  }

  // AD22 — invoices
  if (seg[0] === 'finance' && seg[1] === 'invoices' && seg.length === 2 && m === 'GET') {
    return paginate(filterInvoices(query), query.page);
  }

  // AD28 — notices
  if (seg[0] === 'notices' && seg.length === 1) {
    if (m === 'GET') return paginate(NOTICES, 1, 20);
    if (m === 'POST') {
      const notice = {
        id: `ntc-${Date.now()}`,
        title: (body && body.title) || 'Untitled announcement',
        body: (body && body.body) || '',
        audience: (body && body.audience) || 'ALL',
        audienceLabel: audienceLabelFor(body && body.audience),
        status: 'Draft',
        publishedAt: null,
      };
      NOTICES = [notice, ...NOTICES];
      return notice;
    }
  }
  if (seg[0] === 'notices' && seg[2] === 'publish') {
    const notice = NOTICES.find((n) => n.id === seg[1]);
    if (notice) {
      notice.status = 'Published';
      notice.publishedAt = todayLabel();
    }
    return { ok: true };
  }
  if (seg[0] === 'notices' && seg[2] === 'archive') {
    const notice = NOTICES.find((n) => n.id === seg[1]);
    if (notice) notice.status = 'Archived';
    return { ok: true };
  }

  // Everything else: answer benignly so no screen ever crashes in demo mode.
  if (m === 'GET') return null;
  return { ok: true };
}
