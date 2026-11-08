/**
 * Route registry — all 34 admin screens from the design handoff (AD01–AD34),
 * with their official titles. Five are built; the rest resolve to
 * PlaceholderScreen until the team builds them (same pattern, one at a time).
 */
import AdminHomeView from './AdminHomeView';
import StudentListView from './StudentListView';
import StudentProfileView from './StudentProfileView';
import InvoiceListView from './InvoiceListView';
import NoticesView from './NoticesView';
import PlaceholderScreen from './PlaceholderScreen';

export const ADMIN_SCREENS = {
  AD01: { name: 'AdminHome', title: 'Admin home', Component: AdminHomeView, tab: 'Home' },
  AD02: { name: 'StudentList', title: 'Student list', Component: StudentListView, tab: 'Students' },
  AD03: { name: 'StudentForm', title: 'Register or edit a student', tab: 'Students' },
  AD04: {
    name: 'StudentProfile',
    title: 'Student profile',
    Component: StudentProfileView,
    tab: 'Students',
  },
  AD05: { name: 'GuardianList', title: 'Parents and guardians list', tab: 'More' },
  AD06: { name: 'GuardianProfile', title: 'Guardian profile and child links', tab: 'More' },
  AD07: { name: 'TeacherList', title: 'Teachers list', tab: 'More' },
  AD08: { name: 'TeacherForm', title: 'Register or edit a teacher', tab: 'More' },
  AD09: { name: 'TeacherProfile', title: 'Teacher profile and responsibilities', tab: 'More' },
  AD10: { name: 'SchoolSettings', title: 'School settings and admin access', tab: 'More' },
  AD11: { name: 'Calendar', title: 'School calendar and daily times', tab: 'Academics' },
  AD12: { name: 'AcademicStructure', title: 'Classes, subjects and departments', tab: 'Academics' },
  AD13: { name: 'ClassWorkspace', title: 'One class and its student list', tab: 'Academics' },
  AD14: { name: 'TimetableBuilder', title: 'Build the weekly timetable', tab: 'Academics' },
  AD15: { name: 'TimetablePublish', title: 'Review and publish the timetable', tab: 'Academics' },
  AD16: { name: 'AttendanceOverview', title: 'Attendance and absence follow-up', tab: 'Academics' },
  AD17: { name: 'RegisterReview', title: 'View or correct a class register', tab: 'Academics' },
  AD18: { name: 'AssessmentRules', title: 'Set exams and grading rules', tab: 'Academics' },
  AD19: { name: 'ResultsReview', title: 'Review and publish results', tab: 'Academics' },
  AD20: { name: 'Reports', title: 'Reports', tab: 'Academics' },
  AD21: { name: 'FeePlans', title: 'Set fees and issue bills', tab: 'Fees' },
  AD22: { name: 'InvoiceList', title: 'Student invoices', Component: InvoiceListView, tab: 'Fees' },
  AD23: { name: 'InvoiceDetail', title: 'Invoice detail and office payment', tab: 'Fees' },
  AD24: { name: 'PaymentsBoard', title: 'Payments and money checks', tab: 'Fees' },
  AD25: { name: 'PaymentDetail', title: 'Payment detail and refund review', tab: 'Fees' },
  AD26: { name: 'PromotionPreview', title: 'Preview promotion or completion', tab: 'More' },
  AD27: { name: 'PromotionApprove', title: 'Approve promotion and graduation', tab: 'More' },
  AD28: { name: 'Notices', title: 'School announcements', Component: NoticesView, tab: 'More' },
  AD29: { name: 'MessageInbox', title: 'School messages', tab: 'More' },
  AD30: { name: 'Conversation', title: 'One private conversation', tab: 'More' },
  AD31: { name: 'ComplaintsList', title: 'Complaints list', tab: 'More' },
  AD32: { name: 'ComplaintDetail', title: 'Complaint details and resolution', tab: 'More' },
  AD33: { name: 'ImportsExports', title: 'Bring in or download school data', tab: 'More' },
  AD34: { name: 'AuditTrail', title: 'School change history', tab: 'More' },
};

/**
 * Resolve a registry entry to a renderable screen component. Built screens
 * render directly; the rest get a PlaceholderScreen with the recipe.
 */
export function screenComponent(adCode) {
  const entry = ADMIN_SCREENS[adCode];
  if (!entry) return undefined;
  if (entry.Component) return entry.Component;
  return function AdPlaceholder() {
    return <PlaceholderScreen adCode={adCode} title={entry.title} />;
  };
}
