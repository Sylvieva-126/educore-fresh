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
  { id: 'inv-1', number: 'INV-2026-0141', studentName: 'Amara Okafor', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28', amount: 85000, paid: 85000 },
  { id: 'inv-2', number: 'INV-2026-0142', studentName: 'Chiamaka Eze', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦45,000', status: 'PartiallyPaid', dueDate: '2026-09-28', amount: 85000, paid: 40000 },
  { id: 'inv-3', number: 'INV-2026-0144', studentName: 'Tunde Balogun', planName: 'Tuition + boarding 2026/2027', amountLabel: '₦120,000', balanceLabel: 'Balance ₦120,000', status: 'Overdue', dueDate: '2026-09-28', amount: 120000, paid: 0 },
  { id: 'inv-4', number: 'INV-2026-0145', studentName: 'Fatima Bello', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28', amount: 85000, paid: 85000 },
  { id: 'inv-5', number: 'INV-2026-0146', studentName: 'Daniel Ogun', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦30,000', status: 'PartiallyPaid', dueDate: '2026-09-28', amount: 85000, paid: 55000 },
  { id: 'inv-6', number: 'INV-2026-0148', studentName: 'Emeka Nwosu', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦85,000', status: 'Draft', dueDate: '2026-09-28', amount: 85000, paid: 0 },
  { id: 'inv-7', number: 'INV-2026-0147', studentName: 'Zainab Musa', planName: 'First Term tuition 2026/2027', amountLabel: '₦85,000', balanceLabel: 'Balance ₦0', status: 'Paid', dueDate: '2026-09-28', amount: 85000, paid: 85000 },
];

// AD23 — payments already recorded on each invoice (office + online).
const INVOICE_PAYMENTS = {
  'inv-2': [
    { id: 'ipm-1', method: 'Paystack (online)', amountLabel: '₦40,000', reference: 'PSK-2201-0920-E', paidAt: '2026-09-20' },
    { id: 'ipm-2', method: 'Cash (office)', amountLabel: '₦15,000', reference: 'RCP-0112', paidAt: '2026-09-05' },
  ],
  'inv-3': [],
  'inv-5': [
    { id: 'ipm-3', method: 'Transfer (office)', amountLabel: '₦55,000', reference: 'RCP-0134', paidAt: '2026-09-18' },
  ],
};

const naira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

function applyInvoicePayment(invoice, amount, method, reference, channel = 'office') {
  // Money rules live in the Java API on the real backend. The demo keeps the
  // same rules locally: never overpay, and status follows balance + due date.
  const applied = Math.max(0, Math.min(amount, invoice.amount - invoice.paid));
  invoice.paid += applied;
  const balance = invoice.amount - invoice.paid;
  invoice.balanceLabel = `Balance ${naira(balance)}`;
  invoice.status =
    balance === 0 ? 'Paid' : invoice.dueDate < todayLabel() ? 'Overdue' : 'PartiallyPaid';
  const row = {
    id: `ipm-${Date.now()}`,
    method: `${method} (${channel})`,
    amountLabel: naira(applied),
    reference: reference || 'Office receipt',
    paidAt: todayLabel(),
  };
  INVOICE_PAYMENTS[invoice.id] = INVOICE_PAYMENTS[invoice.id] || [];
  INVOICE_PAYMENTS[invoice.id].push(row);
  return { applied, row };
}

// AD25 — refund requests raised against payments. State machine:
// Pending → Approved / Rejected → Refunded (Paystack execute or manual).
const REFUND_REQUESTS = [
  {
    id: 'rfr-1',
    paymentId: 'pay-2',
    reference: 'PSK-7719-1102-B',
    studentName: 'Daniel Ogun',
    amountLabel: '₦30,000',
    reason: 'Duplicate payment — the guardian also paid at the office.',
    status: 'Pending',
    createdAt: '2026-11-09',
  },
  {
    id: 'rfr-2',
    paymentId: 'pay-5',
    reference: 'OFF-2026-0032',
    studentName: 'Chiamaka Eze',
    amountLabel: '₦40,000',
    reason: 'Guardian paid at the office after the bank transfer had already gone through.',
    status: 'Pending',
    createdAt: '2026-11-10',
  },
];

// AD05/AD06 — guardians and the children linked to them. Student ids match
// the STUDENTS seed so a child row opens that student's profile.
const GUARDIANS = [
  {
    id: 'gd-1', fullName: 'Mrs. Ngozi Okafor', phone: '+234 803 111 2233', email: 'ngozi.okafor@example.com',
    relationship: 'Mother', status: 'Active', childrenCount: 1,
    children: [{ studentId: 1, name: 'Amara Okafor', classLabel: 'SSS1 A', relationship: 'Mother' }],
  },
  {
    id: 'gd-2', fullName: 'Mr. Chibueze Eze', phone: '+234 805 222 3344', email: 'chibueze.eze@example.com',
    relationship: 'Father', status: 'Active', childrenCount: 2,
    children: [
      { studentId: 2, name: 'Chiamaka Eze', classLabel: 'SSS1 A', relationship: 'Father' },
      { studentId: 12, name: 'Blessing Adeyemi', classLabel: 'JSS3 A', relationship: 'Father' },
    ],
  },
  {
    id: 'gd-3', fullName: 'Alhaji Sani Musa', phone: '+234 806 333 4455', email: 'sani.musa@example.com',
    relationship: 'Father', status: 'Invited', childrenCount: 1,
    children: [{ studentId: 7, name: 'Zainab Musa', classLabel: 'SSS3 A', relationship: 'Father' }],
  },
  {
    id: 'gd-4', fullName: 'Mrs. Funke Balogun', phone: '+234 807 444 5566', email: 'funke.balogun@example.com',
    relationship: 'Mother', status: 'Active', childrenCount: 1,
    children: [{ studentId: 4, name: 'Tunde Balogun', classLabel: 'SSS2 A', relationship: 'Mother' }],
  },
  {
    id: 'gd-5', fullName: 'Mr. Emeka Bello', phone: '+234 808 555 6677', email: 'emeka.bello@example.com',
    relationship: 'Father', status: 'Active', childrenCount: 1,
    children: [{ studentId: 5, name: 'Fatima Bello', classLabel: 'SSS2 A', relationship: 'Father' }],
  },
  {
    id: 'gd-6', fullName: 'Mrs. Adaeze Ogun', phone: '+234 809 666 7788', email: 'adaeze.ogun@example.com',
    relationship: 'Mother', status: 'Active', childrenCount: 1,
    children: [{ studentId: 6, name: 'Daniel Ogun', classLabel: 'SSS3 A', relationship: 'Mother' }],
  },
];

// AD07/AD09 — teachers, their subjects and form-class responsibilities.
const TEACHERS = [
  {
    id: 'tch-1', fullName: 'Mrs. Ifeoma Eze', staffNumber: 'GST/014', phone: '+234 810 111 2020',
    email: 'ifeoma.eze@greenfield.edu.ng', status: 'Active', formClass: 'SSS1 A',
    subjects: ['Biology', 'Agricultural Science'],
  },
  {
    id: 'tch-2', fullName: 'Mr. Ademola Adeyinka', staffNumber: 'GST/022', phone: '+234 810 222 3030',
    email: 'ademola.adeyinka@greenfield.edu.ng', status: 'Active', formClass: 'SSS2 A',
    subjects: ['Economics', 'Commerce'],
  },
  {
    id: 'tch-3', fullName: 'Mr. Kabiru Lawal', staffNumber: 'GST/031', phone: '+234 810 333 4040',
    email: 'kabiru.lawal@greenfield.edu.ng', status: 'On Leave', formClass: null,
    subjects: ['Further Mathematics'],
  },
  {
    id: 'tch-4', fullName: 'Miss Chioma Obi', staffNumber: 'GST/040', phone: '+234 810 444 5050',
    email: 'chioma.obi@greenfield.edu.ng', status: 'Active', formClass: 'JSS1 A',
    subjects: ['English Language', 'Literature'],
  },
  {
    id: 'tch-5', fullName: 'Mr. Danladi Yusuf', staffNumber: 'GST/053', phone: '+234 810 555 6060',
    email: 'danladi.yusuf@greenfield.edu.ng', status: 'Active', formClass: null,
    subjects: ['Basic Science', 'Mathematics'],
  },
];

// AD21 — fee plans per class. Draft until the office issues the bills; issuing
// creates one invoice per ACTIVE student in that class.
const FEE_PLANS = [
  {
    id: 'fp-1', classLabel: 'JSS1 A', title: 'First Term tuition 2026/2027',
    term: '2026/2027 · First Term', amount: 85000, amountLabel: '₦85,000',
    dueDate: '2026-09-28', status: 'Issued', issuedCount: 3,
  },
  {
    id: 'fp-2', classLabel: 'SSS3 A', title: 'First Term tuition 2026/2027',
    term: '2026/2027 · First Term', amount: 85000, amountLabel: '₦85,000',
    dueDate: '2026-09-28', status: 'Issued', issuedCount: 2,
  },
  {
    id: 'fp-3', classLabel: 'JSS2 A', title: 'First Term tuition 2026/2027',
    term: '2026/2027 · First Term', amount: 85000, amountLabel: '₦85,000',
    dueDate: '2026-12-15', status: 'Draft', studentsCount: 2,
  },
  {
    id: 'fp-4', classLabel: 'SSS1 A', title: 'Excursion levy — First Term',
    term: '2026/2027 · First Term', amount: 15000, amountLabel: '₦15,000',
    dueDate: '2026-11-30', status: 'Draft', studentsCount: 3,
  },
];

// AD12/AD13 — the class list and the subject list. Class rows are computed
// from STUDENTS/TEACHERS at read time, so counts survive moves and withdrawals.
const CLASS_NAMES = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'];
const SSS_DEPARTMENTS = {
  'SSS1 A': 'Science',
  'SSS2 A': 'Science',
  'SSS3 A': 'Science',
};
const SUBJECTS = [
  { id: 'sub-1', name: 'Mathematics', department: 'Core', classes: CLASS_NAMES.slice() },
  { id: 'sub-2', name: 'English Language', department: 'Core', classes: CLASS_NAMES.slice() },
  { id: 'sub-3', name: 'Basic Science', department: 'Core', classes: ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A'] },
  { id: 'sub-4', name: 'Igbo Language', department: 'Core', classes: CLASS_NAMES.slice() },
  { id: 'sub-5', name: 'Biology', department: 'Science', classes: ['SSS1 A', 'SSS2 A', 'SSS3 A'] },
  { id: 'sub-6', name: 'Chemistry', department: 'Science', classes: ['SSS1 A', 'SSS2 A', 'SSS3 A'] },
  { id: 'sub-7', name: 'Physics', department: 'Science', classes: ['SSS1 A', 'SSS2 A', 'SSS3 A'] },
  { id: 'sub-8', name: 'Agricultural Science', department: 'Science', classes: ['JSS3 A', 'SSS1 A'] },
  { id: 'sub-9', name: 'Economics', department: 'Humanities / Arts', classes: ['SSS1 A', 'SSS2 A', 'SSS3 A'] },
  { id: 'sub-10', name: 'Government', department: 'Humanities / Arts', classes: ['SSS2 A', 'SSS3 A'] },
  { id: 'sub-11', name: 'Literature', department: 'Humanities / Arts', classes: ['SSS2 A', 'SSS3 A'] },
  { id: 'sub-12', name: 'Commerce', department: 'Business / Commercial', classes: ['SSS1 A', 'SSS2 A', 'SSS3 A'] },
];

function buildClasses() {
  return CLASS_NAMES.map((name, i) => {
    const form = TEACHERS.find((t) => t.formClass === name && t.status === 'Active');
    return {
      id: `cls-${i + 1}`,
      classLabel: name,
      department: SSS_DEPARTMENTS[name] || null, // JSS classes have no department yet
      formTeacherName: form ? form.fullName : 'Not assigned yet',
      studentCount: STUDENTS.filter((s) => s.classLabel === name).length,
      subjectCount: SUBJECTS.filter((s) => s.classes.includes(name)).length,
    };
  });
}

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

/* ── AD16 — Attendance registers (today). Built with a loop so the home
      totals (submitted / expected / missing) stay exactly consistent. ──── */

const REGISTER_CLASSES = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'];
const REGISTER_SLOTS = [
  { subject: 'Class register', time: '08:00' },
  { subject: 'Mathematics', time: '10:30' },
  { subject: 'English Language', time: '12:10' },
];
const REGISTER_TEACHERS = ['Mr. Ade Okafor', 'Mrs. Grace Umeh', 'Mr. Emeka Ubah', 'Miss Halima Yusuf'];

const ATTENDANCE_REGISTERS = (() => {
  const rows = [];
  let absentLeft = 12; // DASHBOARD.absentStudents — spread one per register
  let lateLeft = 4; // DASHBOARD.lateArrivals
  REGISTER_CLASSES.forEach((classLabel, ci) => {
    REGISTER_SLOTS.forEach((slot, si) => {
      const missing = (ci === 1 && si === 0) || (ci === 4 && si === 2) || (ci === 6 && si === 1);
      const submitted = !missing;
      const absentCount = submitted && absentLeft > 0 ? 1 : 0;
      if (absentCount) absentLeft -= 1;
      const lateCount = submitted && lateLeft > 0 ? 1 : 0;
      if (lateCount) lateLeft -= 1;
      rows.push({
        id: `reg-${ci}-${si}`,
        classLabel,
        subject: slot.subject,
        time: slot.time,
        teacher: REGISTER_TEACHERS[(ci + si) % REGISTER_TEACHERS.length],
        status: submitted ? 'Submitted' : 'Missing',
        absentCount,
        lateCount,
        submittedAt: submitted ? slot.time : null,
      });
    });
  });
  return rows;
})();

// Keep AD01's headline numbers derived from the same register rows.
DASHBOARD.registersExpected = ATTENDANCE_REGISTERS.length;
DASHBOARD.registersSubmitted = ATTENDANCE_REGISTERS.filter((r) => r.status === 'Submitted').length;
DASHBOARD.missingRegisters = ATTENDANCE_REGISTERS.length - DASHBOARD.registersSubmitted;

const ATTENDANCE_CORRECTIONS = [
  { id: 'cor-1', classLabel: 'JSS1 B', subject: 'Class register', teacher: 'Mrs. Grace Umeh', detail: 'Chiamaka Eze marked absent — guardian says she arrived late', status: 'Pending', requestedAt: todayLabel() },
  { id: 'cor-2', classLabel: 'SSS3 A', subject: 'Mathematics', teacher: 'Mr. Ade Okafor', detail: 'Daniel Ogun absent but wrote the CA in the hall', status: 'Pending', requestedAt: todayLabel() },
];

/* ── AD19 — Results review (mark packages + report batches) ─────────── */

const MARK_PACKAGES = [
  { id: 'pkg-1', classLabel: 'SSS1 A', subject: 'Mathematics', termLabel: 'First Term', teacherName: 'Mr. Ade Okafor', status: 'ReturnedForCorrections', studentCount: 32, detail: 'CA totals do not match the exam sheet for 2 students', submittedAt: '2026-11-08' },
  { id: 'pkg-2', classLabel: 'SSS2 A', subject: 'Mathematics', termLabel: 'First Term', teacherName: 'Mr. Ade Okafor', status: 'ReturnedForCorrections', studentCount: 28, detail: 'Two absences need a recorded decision', submittedAt: '2026-11-08' },
  { id: 'pkg-3', classLabel: 'SSS1 A', subject: 'English Language', termLabel: 'First Term', teacherName: 'Mrs. Grace Umeh', status: 'Submitted', studentCount: 32, detail: 'Awaiting admin sign-off', submittedAt: '2026-11-09' },
  { id: 'pkg-4', classLabel: 'JSS2 A', subject: 'Basic Science', termLabel: 'First Term', teacherName: 'Mr. Emeka Ubah', status: 'Approved', studentCount: 30, detail: 'Signed off', submittedAt: '2026-11-07' },
];

const REPORT_BATCHES = [
  { id: 'batch-1', classLabel: 'SSS1 A', termLabel: 'First Term 2026/2027', status: 'ReadyToPublish', studentCount: 32, publishedAt: null },
  { id: 'batch-2', classLabel: 'JSS1 A', termLabel: 'First Term 2026/2027', status: 'Published', studentCount: 34, publishedAt: '2026-11-05' },
  { id: 'batch-3', classLabel: 'SSS3 A', termLabel: 'First Term 2026/2027', status: 'Draft', studentCount: 29, publishedAt: null },
];

/* ── AD24 — Payments, Paystack settlements, reconciliation ──────────── */

const SETTLEMENTS = [
  { id: 'set-1', provider: 'Paystack', reference: 'PSK-8842-1103-A', amountLabel: '₦85,000', status: 'Unmatched', paidAt: '2026-11-08', studentName: 'Emeka Nwosu', invoiceNumber: 'INV-2026-0148' },
  { id: 'set-2', provider: 'Paystack', reference: 'PSK-7719-1102-B', amountLabel: '₦30,000', status: 'Unmatched', paidAt: '2026-11-08', studentName: 'Daniel Ogun', invoiceNumber: 'INV-2026-0146' },
  { id: 'set-3', provider: 'Paystack', reference: 'PSK-6620-1101-C', amountLabel: '₦85,000', status: 'Matched', paidAt: '2026-11-06', studentName: 'Zainab Musa', invoiceNumber: 'INV-2026-0147' },
];

const PAYMENTS = [
  { id: 'pay-1', reference: 'PSK-8842-1103-A', studentName: 'Emeka Nwosu', channel: 'Card (Paystack)', amountLabel: '₦85,000', status: 'Unreconciled', paidAt: '2026-11-08 14:22' },
  { id: 'pay-2', reference: 'PSK-7719-1102-B', studentName: 'Daniel Ogun', channel: 'Card (Paystack)', amountLabel: '₦30,000', status: 'Unreconciled', paidAt: '2026-11-08 09:05' },
  { id: 'pay-3', reference: 'PSK-6620-1101-C', studentName: 'Zainab Musa', channel: 'Card (Paystack)', amountLabel: '₦85,000', status: 'Reconciled', paidAt: '2026-11-06 18:40' },
  { id: 'pay-4', reference: 'OFF-2026-0031', studentName: 'Amara Okafor', channel: 'Cash (office)', amountLabel: '₦85,000', status: 'Reconciled', paidAt: '2026-10-30 10:15' },
  { id: 'pay-5', reference: 'OFF-2026-0032', studentName: 'Chiamaka Eze', channel: 'Bank transfer', amountLabel: '₦40,000', status: 'RefundRequested', paidAt: '2026-11-02 11:30' },
];

const RECONCILIATIONS = [
  { id: 'rec-1', paymentRef: 'PSK-6620-1101-C', invoiceNumber: 'INV-2026-0147', amountLabel: '₦85,000', createdBy: 'Admin', createdAt: '2026-11-06' },
  { id: 'rec-2', paymentRef: 'OFF-2026-0031', invoiceNumber: 'INV-2026-0141', amountLabel: '₦85,000', createdBy: 'Admin', createdAt: '2026-10-30' },
];

const PAYMENT_EXCEPTIONS = [
  { id: 'exc-1', reference: 'PSK-5501-1030-D', detail: 'Webhook received for an unknown admission number', amountLabel: '₦25,000', status: 'Open', openedAt: '2026-10-30' },
];

/* ── AD31/AD32 — Complaints (mutable so replies and state moves work) ── */

const COMPLAINTS = [
  {
    id: 'cmp-1',
    guardianName: 'Mrs. Ify Umeh',
    studentName: 'Kelechi Umeh',
    classLabel: 'JSS2 A',
    channel: 'Phone',
    subject: 'Transport route change request',
    detail: 'Requests the afternoon bus to stop at Trans Ekulu junction from next week.',
    status: 'New',
    owner: 'Unassigned',
    openedAt: todayLabel(),
    replies: [],
    notes: [],
    history: [{ id: 'h-1', text: 'Complaint received (phone)', at: todayLabel() }],
  },
  {
    id: 'cmp-2',
    guardianName: 'Mr. Chidi Eze',
    studentName: 'Chiamaka Eze',
    classLabel: 'SSS1 A',
    channel: 'Email',
    subject: 'Extra lessons timing',
    detail: 'Asks whether Saturday extra lessons can move to the afternoon.',
    status: 'In review',
    owner: 'Admin',
    openedAt: '2026-11-06',
    replies: [
      { id: 'r-1', author: 'Admin (office)', text: 'Thank you — the dean of studies will confirm by Friday.', at: '2026-11-06' },
    ],
    notes: [{ id: 'n-1', author: 'Admin', text: 'Timetable committee to decide at the staff briefing.', at: '2026-11-06' }],
    history: [
      { id: 'h-1', text: 'Complaint received (email)', at: '2026-11-06' },
      { id: 'h-2', text: 'Status → In review', at: '2026-11-06' },
    ],
  },
  {
    id: 'cmp-3',
    guardianName: 'Hajiya Amina Mohammed',
    studentName: 'Aisha Mohammed',
    classLabel: 'JSS1 A',
    channel: 'In person',
    subject: 'Locker repair',
    detail: 'Locker door does not close; reported at the bursary.',
    status: 'Resolved',
    owner: 'Admin',
    openedAt: '2026-11-03',
    replies: [{ id: 'r-1', author: 'Admin (office)', text: 'Replaced the latch on 5 November.', at: '2026-11-05' }],
    notes: [],
    history: [{ id: 'h-1', text: 'Status → Resolved', at: '2026-11-05' }],
  },
];

function filterComplaints(query) {
  const q = (query.q || query.search || '').toString().trim().toLowerCase();
  const status = query.status && query.status !== 'all' ? query.status : null;
  return COMPLAINTS.filter((c) => {
    if (status && c.status !== status) return false;
    if (q) {
      const haystack = `${c.guardianName} ${c.studentName} ${c.subject}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/* ── AD11 — School calendar ─────────────────────────────────────────── */

const CALENDAR = {
  sessionLabel: SESSION_LABEL,
  termLabel: 'First Term',
  termStart: '2026-09-14',
  termEnd: '2026-12-11',
  nextTermStart: '2027-01-11',
  keyDates: [
    { id: 'kd-1', date: '2026-11-14', title: 'PTA general meeting', detail: '10:00 am · main hall' },
    { id: 'kd-2', date: '2026-11-27', title: 'Continuous assessment closes', detail: 'All subjects · all classes' },
    { id: 'kd-3', date: '2026-12-04', title: 'First-term examinations begin', detail: 'Timetable on the noticeboard' },
    { id: 'kd-4', date: '2026-12-11', title: 'Term ends / vacation', detail: 'Collection of results from 14 December' },
    { id: 'kd-5', date: '2027-01-11', title: 'Second term begins', detail: 'Boarders return 10 January' },
  ],
  todaySchedule: DASHBOARD.todaySchedule,
};

const SESSIONS_LIST = [
  { id: 'ses-1', label: '2026/2027', status: 'Active', terms: 'First: 14 Sep – 11 Dec 2026 · Second: 11 Jan – 2 Apr 2027 · Third: 26 Apr – 16 Jul 2027' },
  { id: 'ses-2', label: '2025/2026', status: 'Archived', terms: 'Archived — see reports' },
];

/* ── AD29 — Messages / notifications inbox ──────────────────────────── */

const CONVERSATIONS = [
  {
    id: 'cnv-1',
    title: 'Mrs. Ngozi Okafor',
    participantLabel: 'Guardian · Amara Okafor (SSS1 A)',
    unread: 2,
    lastMessage: 'Thank you — she will bring the fee teller tomorrow.',
    lastAt: '2026-11-10 08:05',
    messages: [
      { id: 'm-1', author: 'Admin (office)', text: 'Good morning — the balance on INV-2026-0141 is ₦0; nothing is owed.', at: '2026-11-09 17:20' },
      { id: 'm-2', author: 'Mrs. Ngozi Okafor', text: 'Thank you — she will bring the fee teller tomorrow.', at: '2026-11-10 08:05' },
    ],
  },
  {
    id: 'cnv-3',
    title: 'Mr. Obi Nwosu',
    participantLabel: 'Guardian · Emeka Nwosu (JSS1 A)',
    unread: 1,
    lastMessage: 'Is the bus running on Friday?',
    lastAt: '2026-11-10 07:12',
    messages: [
      { id: 'm-1', author: 'Mr. Obi Nwosu', text: 'Is the bus running on Friday?', at: '2026-11-10 07:12' },
    ],
  },
  {
    id: 'cnv-2',
    title: 'Staff briefing group',
    participantLabel: 'Group · all teachers',
    unread: 0,
    lastMessage: 'Slides for the first-term review are shared.',
    lastAt: '2026-11-09 16:45',
    messages: [
      { id: 'm-1', author: 'Admin (office)', text: 'Slides for the first-term review are shared.', at: '2026-11-09 16:45' },
    ],
  },
];

/* ── The demo router the API client calls in demo mode ──────────────── */

import { cleanText, normalizeEmail, normalizePhone } from '../utils/validators.js';

function paginate(items, page = 1, perPage = 20) {
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

  // AD03/AD33 — enrol one student (the import loop reuses this same route).
  // Values are re-cleaned here so hand-built or CSV-sourced rows arrive
  // trimmed and normalized even if a caller skips the form.
  if (seg[0] === 'student-enrolments' && m === 'POST') {
    const cls = (body && body.classLabel) || 'JSS1 A';
    const student = {
      id: nextStudentId,
      fullName: `${cleanText(body && body.firstName)} ${cleanText(body && body.lastName)}`.trim(),
      admissionNumber: `GSS/2026/${String(nextAdmissionNumber).padStart(4, '0')}`,
      classLabel: cls,
      department: cls.startsWith('JSS') ? null : (body && body.department) || null,
      status: 'Active',
      dateOfBirth: cleanText(body && body.dateOfBirth),
      gender: (body && body.gender) || '',
      admissionDate: todayLabel(),
      guardianName: cleanText(body && body.guardianName),
      guardianPhone: normalizePhone((body && body.guardianPhone) || ''),
      guardianEmail: normalizeEmail((body && body.guardianEmail) || ''),
      address: cleanText(body && body.address),
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
      if (student.status === 'Withdrawn') {
        return { ok: false, error: 'This student has already been withdrawn.' };
      }
      if (student.status === 'Graduated') {
        return { ok: false, error: 'This student has already graduated.' };
      }
      student.status = 'Withdrawn';
      return { ok: true };
    }
  }

  // AD12 — class list and subject list
  if (seg[0] === 'classes' && seg.length === 1) {
    if (m === 'GET') return paginate(buildClasses(), query.page);
    if (m === 'POST') return { ok: false, error: 'Class creation comes with the real backend.' };
  }
  // AD13 — one class workspace: the class, its roster, its subjects
  if (seg[0] === 'classes' && seg.length === 3 && seg[2] === 'workspace' && m === 'GET') {
    const cls = buildClasses().find((c) => c.classLabel === seg[1]);
    if (!cls) return { ok: false, error: 'Class not found.' };
    return {
      ok: true,
      class: cls,
      students: STUDENTS.filter((s) => s.classLabel === seg[1]),
      subjects: SUBJECTS.filter((s) => s.classes.includes(seg[1])),
    };
  }
  if (seg[0] === 'classes' && seg.length === 3 && seg[2] === 'roster' && m === 'GET') {
    return paginate(STUDENTS.filter((s) => s.classLabel === seg[1]), query.page);
  }
  if (seg[0] === 'subjects' && seg.length === 1) {
    if (m === 'GET') return paginate(SUBJECTS, query.page);
    if (m === 'POST') {
      const name = ((body && body.name) || '').trim();
      const department = ((body && body.department) || '').trim();
      if (!name) return { ok: false, error: 'Name the subject.' };
      if (!department) return { ok: false, error: 'Tag the department it belongs to.' };
      if (SUBJECTS.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
        return { ok: false, error: `${name} already exists in the subject list.` };
      }
      const subject = { id: `sub-${Date.now()}`, name, department, classes: [] };
      SUBJECTS.push(subject);
      return { ok: true, subject };
    }
  }

  // AD21 — fee plans: list, create, and issue the bills to a class
  if (seg[0] === 'finance' && seg[1] === 'fee-plans' && seg.length === 2) {
    if (m === 'GET') return paginate(FEE_PLANS, query.page);
    if (m === 'POST') {
      const classLabel = ((body && body.classLabel) || '').trim();
      const title = ((body && body.title) || '').trim();
      const amount = Number(body && body.amount);
      if (!classLabel) return { ok: false, error: 'Choose the class this plan bills.' };
      if (!title) return { ok: false, error: 'Name the plan, e.g. First Term tuition.' };
      if (!amount || amount <= 0) return { ok: false, error: 'Enter the amount in naira.' };
      const dup = FEE_PLANS.find(
        (p) =>
          p.classLabel.toLowerCase() === classLabel.toLowerCase() &&
          p.title.toLowerCase() === title.toLowerCase(),
      );
      if (dup) {
        return {
          ok: false,
          error: `${classLabel} already has "${dup.title}" — issue that plan instead of creating it again.`,
        };
      }
      const plan = {
        id: `fp-${Date.now()}`,
        classLabel,
        title,
        term: (body && body.term) || '2026/2027 · First Term',
        amount,
        amountLabel: naira(amount),
        dueDate: (body && body.dueDate) || '2026-12-31',
        status: 'Draft',
        studentsCount: STUDENTS.filter(
          (s) => s.classLabel === classLabel && s.status === 'Active',
        ).length,
      };
      FEE_PLANS.unshift(plan);
      return { ok: true, plan };
    }
  }
  if (seg[0] === 'finance' && seg[1] === 'fee-plans' && seg.length === 3 && m === 'GET') {
    return FEE_PLANS.find((p) => p.id === seg[2]) || null;
  }
  if (seg[0] === 'finance' && seg[1] === 'fee-plans' && seg.length === 4 && m === 'POST') {
    const plan = FEE_PLANS.find((p) => p.id === seg[2]);
    if (!plan) return { ok: false, error: 'Fee plan not found.' };
    const billable = STUDENTS.filter(
      (s) => s.classLabel === plan.classLabel && s.status === 'Active',
    );
    if (seg[3] === 'issue-preview') {
      return { ok: true, studentCount: billable.length };
    }
    if (seg[3] === 'issue') {
      if (plan.status === 'Issued') {
        return { ok: false, error: 'These bills were already issued.' };
      }
      let num = Math.max(...INVOICES.map((i) => Number(String(i.number).split('-').pop()))) + 1;
      billable.forEach((s) => {
        INVOICES.push({
          id: `inv-${num}`,
          number: `INV-2026-${String(num).padStart(4, '0')}`,
          studentName: s.fullName,
          planName: plan.title,
          amount: plan.amount,
          paid: 0,
          balanceLabel: `Balance ${naira(plan.amount)}`,
          status: plan.dueDate < todayLabel() ? 'Overdue' : 'Draft',
          dueDate: plan.dueDate,
        });
        num += 1;
      });
      plan.status = 'Issued';
      plan.issuedCount = billable.length;
      return { ok: true, issued: billable.length };
    }
  }

  // AD22 — invoices
  if (seg[0] === 'finance' && seg[1] === 'invoices' && seg.length === 2 && m === 'GET') {
    return paginate(filterInvoices(query), query.page);
  }

  // AD23 — one invoice, the payments recorded on it, office payments
  const invoice =
    seg[0] === 'finance' && seg[1] === 'invoices' && seg[2]
      ? INVOICES.find((i) => i.id === seg[2])
      : null;
  if (invoice && seg.length === 3 && m === 'GET') return invoice;
  if (invoice && seg[3] === 'payments' && m === 'GET') {
    return { items: INVOICE_PAYMENTS[invoice.id] || [] };
  }
  if (invoice && seg[3] === 'manual-payments' && m === 'POST') {
    const amount = Number(body && body.amount);
    if (!amount || amount <= 0) return { ok: false, error: 'Enter an amount in naira.' };
    const result = applyInvoicePayment(invoice, amount, (body && body.method) || 'Cash', body && body.reference);
    return { ok: true, applied: result.applied, balanceAfter: invoice.amount - invoice.paid };
  }

  // AD16 — attendance overview, registers, correction requests
  if (seg[0] === 'attendance' && seg[1] === 'overview' && m === 'GET') {
    return {
      schoolName: SCHOOL_NAME,
      sessionLabel: SESSION_LABEL,
      termLabel: 'First Term',
      registersSubmitted: DASHBOARD.registersSubmitted,
      registersExpected: DASHBOARD.registersExpected,
      missingRegisters: DASHBOARD.missingRegisters,
      absentStudents: DASHBOARD.absentStudents,
      lateArrivals: DASHBOARD.lateArrivals,
      correctionRequests: ATTENDANCE_CORRECTIONS.length,
    };
  }
  if (seg[0] === 'attendance' && seg[1] === 'registers' && m === 'GET') {
    // One page holds the whole day — the overview screen shows every register.
    return paginate(ATTENDANCE_REGISTERS, query.page, 50);
  }
  if (seg[0] === 'attendance' && seg[1] === 'correction-requests' && m === 'GET') {
    return paginate(ATTENDANCE_CORRECTIONS, 1, 20);
  }

  // AD19 — results review (packages + report batches)
  if (seg[0] === 'mark-packages' && seg.length === 1 && m === 'GET') {
    return paginate(MARK_PACKAGES, query.page);
  }
  if (seg[0] === 'mark-packages' && seg[2] === 'return' && m === 'POST') {
    const pkg = MARK_PACKAGES.find((p) => p.id === seg[1]);
    if (pkg) {
      pkg.status = 'ReturnedForCorrections';
      pkg.detail = (body && body.reason) || 'Returned for corrections';
    }
    return { ok: true };
  }
  if (seg[0] === 'class-report-batches' && seg.length === 1 && m === 'GET') {
    return paginate(REPORT_BATCHES, query.page);
  }
  if (seg[0] === 'class-report-batches' && seg[2] === 'publish' && m === 'POST') {
    const batch = REPORT_BATCHES.find((b) => b.id === seg[1]);
    if (batch) {
      batch.status = 'Published';
      batch.publishedAt = todayLabel();
    }
    return { ok: true };
  }
  if (seg[0] === 'class-report-batches' && seg[2] === 'reopen' && m === 'POST') {
    const batch = REPORT_BATCHES.find((b) => b.id === seg[1]);
    if (batch) {
      batch.status = 'Draft';
      batch.publishedAt = null;
    }
    return { ok: true };
  }

  // AD19 — Draft / returned batches move to ReadyToPublish on submit-review
  if (seg[0] === 'class-report-batches' && seg[2] === 'submit-review' && m === 'POST') {
    const batch = REPORT_BATCHES.find((b) => b.id === seg[1]);
    if (batch && (batch.status === 'Draft' || batch.status === 'ReturnedForCorrections')) {
      batch.status = 'ReadyToPublish';
    }
    return { ok: true };
  }

  // AD24 — payments, settlements, reconciliation, exceptions
  if (seg[0] === 'finance' && seg[1] === 'payments' && seg.length === 2 && m === 'GET') {
    return paginate(PAYMENTS, query.page);
  }

  // AD25 — one payment (payment detail)
  const paymentRow =
    seg[0] === 'finance' && seg[1] === 'payments' && seg[2]
      ? PAYMENTS.find((p) => p.id === seg[2])
      : null;
  if (paymentRow && seg.length === 3 && m === 'GET') return paymentRow;

  // AD25 — refund requests and their state machine
  if (seg[0] === 'finance' && seg[1] === 'refund-requests' && seg.length === 2) {
    if (m === 'GET') {
      const rows = query.paymentId
        ? REFUND_REQUESTS.filter((r) => r.paymentId === query.paymentId)
        : REFUND_REQUESTS;
      return paginate(rows, query.page);
    }
    if (m === 'POST') {
      const payment = PAYMENTS.find((p) => p.id === (body && body.paymentId));
      if (!payment) return { ok: false, error: 'Unknown payment.' };
      const request = {
        id: `rfr-${Date.now()}`,
        paymentId: payment.id,
        reference: payment.reference,
        studentName: payment.studentName,
        amountLabel: payment.amountLabel,
        reason: (body && body.reason) || '—',
        status: 'Pending',
        createdAt: todayLabel(),
      };
      REFUND_REQUESTS.unshift(request);
      return request;
    }
  }
  const refundRow =
    seg[0] === 'finance' && seg[1] === 'refund-requests' && seg[2]
      ? REFUND_REQUESTS.find((r) => r.id === seg[2])
      : null;
  if (refundRow && seg[3] === 'decision' && m === 'POST') {
    refundRow.status = (body && body.action) === 'approve' ? 'Approved' : 'Rejected';
    return { ok: true, status: refundRow.status };
  }
  if (refundRow && seg[3] === 'execute' && m === 'POST') {
    refundRow.status = 'Refunded';
    return { ok: true, status: 'Refunded' };
  }
  if (refundRow && seg[3] === 'manual-confirmation' && m === 'POST') {
    refundRow.status = 'Refunded';
    return { ok: true, status: 'Refunded' };
  }

  // AD05/AD06 — guardians list and one guardian's profile with child links
  if (seg[0] === 'guardians' && seg.length === 1 && m === 'GET') {
    const q = (query.q || query.search || '').toString().trim().toLowerCase();
    const status = query.status && query.status !== 'all' ? query.status : null;
    const rows = GUARDIANS.filter((g) => {
      if (status && g.status !== status) return false;
      if (q) {
        const kids = g.children.map((c) => c.name).join(' ');
        return `${g.fullName} ${g.email} ${g.phone} ${kids}`.toLowerCase().includes(q);
      }
      return true;
    });
    return paginate(rows, query.page);
  }
  if (seg[0] === 'guardians' && seg.length === 2 && m === 'GET') {
    return GUARDIANS.find((g) => g.id === seg[1]) || null;
  }

  // AD07/AD09 — teachers list and one teacher's responsibilities
  if (seg[0] === 'teachers' && seg.length === 1 && m === 'GET') {
    const q = (query.q || query.search || '').toString().trim().toLowerCase();
    const status = query.status && query.status !== 'all' ? query.status : null;
    const rows = TEACHERS.filter((t) => {
      if (status && t.status !== status) return false;
      if (q) {
        const haystack = `${t.fullName} ${t.staffNumber} ${(t.subjects || []).join(' ')} ${
          t.formClass || ''
        }`.toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
    return paginate(rows, query.page);
  }
  if (seg[0] === 'teachers' && seg.length === 2 && m === 'GET') {
    return TEACHERS.find((t) => t.id === seg[1]) || null;
  }
  if (seg[0] === 'finance' && seg[1] === 'settlements' && seg.length === 2 && m === 'GET') {
    return paginate(SETTLEMENTS, query.page);
  }
  if (seg[0] === 'finance' && seg[1] === 'reconciliations' && seg.length === 2) {
    if (m === 'GET') return paginate(RECONCILIATIONS, query.page);
    if (m === 'POST') {
      const payment = PAYMENTS.find((p) => p.id === (body && body.paymentId));
      if (payment && payment.status === 'Reconciled') {
        return { ok: false, error: 'This settlement is already matched.' };
      }
      if (payment) {
        payment.status = 'Reconciled';
        payment.invoiceNumber = (body && body.invoiceNumber) || payment.invoiceNumber || '—';
        // The board's badge reads the settlement row, so flip it too.
        const settlement = SETTLEMENTS.find((s) => s.reference === payment.reference);
        if (settlement) settlement.status = 'Matched';
        // Money consistency: matched money lands on the invoice it pays.
        const invoice = INVOICES.find((inv) => inv.number === payment.invoiceNumber);
        if (invoice && invoice.amount - invoice.paid > 0) {
          const amount = Number(String(payment.amountLabel).replace(/[^0-9.]/g, ''));
          applyInvoicePayment(invoice, amount, 'Bank transfer', payment.reference, 'Paystack');
        }
      }
      RECONCILIATIONS.unshift({
        id: `rec-${Date.now()}`,
        paymentRef: payment ? payment.reference : '—',
        invoiceNumber: (body && body.invoiceNumber) || '—',
        amountLabel: payment ? payment.amountLabel : '—',
        createdBy: 'Admin',
        createdAt: todayLabel(),
      });
      return { ok: true };
    }
  }
  if (seg[0] === 'finance' && seg[1] === 'exceptions' && seg.length === 2 && m === 'GET') {
    return paginate(PAYMENT_EXCEPTIONS, 1, 20);
  }
  if (seg[0] === 'finance' && seg[1] === 'exceptions' && seg[3] === 'actions' && m === 'POST') {
    const exception = PAYMENT_EXCEPTIONS.find((e) => e.id === seg[2]);
    if (exception) {
      const action = (body && body.action) || 'resolve';
      exception.status = action === 'refund-flag' ? 'Refund flagged' : 'Resolved';
    }
    return { ok: true };
  }

  // AD31/AD32 — complaints: list, detail, replies, notes, state machine
  if (seg[0] === 'complaints' && seg.length === 1) {
    if (m === 'GET') return paginate(filterComplaints(query), query.page);
    if (m === 'POST') {
      const complaint = {
        id: `cmp-${Date.now()}`,
        guardianName: (body && body.guardianName) || 'Guardian',
        studentName: (body && body.studentName) || '',
        classLabel: (body && body.classLabel) || '',
        channel: (body && body.channel) || 'Phone',
        subject: (body && body.subject) || 'New complaint',
        detail: (body && body.detail) || '',
        status: 'New',
        owner: 'Unassigned',
        openedAt: todayLabel(),
        replies: [],
        notes: [],
        history: [{ id: 'h-1', text: 'Complaint received', at: todayLabel() }],
      };
      COMPLAINTS.unshift(complaint);
      return complaint;
    }
  }
  const complaint = seg[0] === 'complaints' && seg[1] ? COMPLAINTS.find((c) => c.id === seg[1]) : null;
  if (complaint && seg.length === 2 && m === 'GET') return complaint;
  if (complaint && seg[2] === 'replies') {
    if (m === 'GET') return { items: complaint.replies };
    complaint.replies.push({
      id: `r-${complaint.replies.length + 1}`,
      author: 'Admin (office)',
      text: (body && body.text) || '',
      at: todayLabel(),
    });
    complaint.history.push({ id: `h-${complaint.history.length + 1}`, text: 'Reply sent to guardian', at: todayLabel() });
    return { ok: true };
  }
  if (complaint && seg[2] === 'internal-notes') {
    if (m === 'GET') return { items: complaint.notes };
    complaint.notes.push({
      id: `n-${complaint.notes.length + 1}`,
      author: 'Admin',
      text: (body && body.text) || '',
      at: todayLabel(),
    });
    return { ok: true };
  }
  if (complaint && seg[2] === 'state-actions' && m === 'POST') {
    const actions = {
      'start-review': 'In review',
      resolve: 'Resolved',
      close: 'Closed',
      reopen: 'In review',
    };
    const next = actions[(body && body.action)];
    if (next) {
      complaint.status = next;
      if (next === 'In review' && complaint.owner === 'Unassigned') complaint.owner = 'Admin';
      complaint.history.push({
        id: `h-${complaint.history.length + 1}`,
        text: `Status → ${next}`,
        at: todayLabel(),
      });
    }
    return complaint;
  }

  // AD11 — school calendar and sessions
  if (seg[0] === 'calendar' && seg.length === 1 && m === 'GET') return CALENDAR;
  if (seg[0] === 'sessions' && seg.length === 1 && m === 'GET') {
    return { items: SESSIONS_LIST };
  }

  // AD29/AD30 — messages inbox and threads
  if (seg[0] === 'conversation-recipients' && m === 'GET') {
    if (query.group) {
      // Two-step "new message": group first, then the people inside it.
      const group = String(query.group);
      if (group === 'All teachers') {
        return {
          items: [...new Set(MARK_PACKAGES.map((p) => p.teacherName))].map((t) => ({
            label: t,
            value: t,
          })),
        };
      }
      const classGroup = group.endsWith(' guardians') ? group.slice(0, -' guardians'.length) : null;
      const guardians = STUDENTS.filter(
        (s) => group === 'All guardians' || (classGroup && s.classLabel === classGroup),
      );
      return {
        items: guardians.map((s) => ({
          label: `${s.guardianName} · guardian of ${s.fullName} (${s.classLabel})`,
          value: s.guardianName,
        })),
      };
    }
    return {
      items: ['All guardians', 'All teachers', 'SSS1 A guardians', 'JSS2 A guardians'],
    };
  }
  if (seg[0] === 'conversations' && seg.length === 1) {
    if (m === 'GET') return paginate(CONVERSATIONS, query.page);
    if (m === 'POST') {
      const recipient = (body && body.recipient) || 'Guardian';
      const conversation = {
        id: `cnv-${Date.now()}`,
        title: (body && body.title) || recipient,
        participantLabel: recipient,
        unread: 0,
        lastMessage: (body && body.text) || '',
        lastAt: todayLabel(),
        messages: [],
      };
      CONVERSATIONS.unshift(conversation);
      return conversation;
    }
  }
  const conversation =
    seg[0] === 'conversations' && seg[1] ? CONVERSATIONS.find((c) => c.id === seg[1]) : null;
  if (conversation && seg[2] === 'messages') {
    if (m === 'GET') return paginate(conversation.messages, query.page, 20);
    conversation.messages.push({
      id: `m-${conversation.messages.length + 1}`,
      author: 'Admin (office)',
      text: (body && body.text) || '',
      at: todayLabel(),
    });
    conversation.lastMessage = (body && body.text) || conversation.lastMessage;
    return { ok: true };
  }
  if (conversation && seg[2] === 'read' && m === 'PUT') {
    conversation.unread = 0;
    return { ok: true };
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
