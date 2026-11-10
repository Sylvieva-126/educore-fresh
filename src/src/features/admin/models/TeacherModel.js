/** AD07/AD08/AD09 — Teachers: list, registration, assignments, access, timetable. */
import { api, normalizePage } from '../api/client';
import { endpoints } from '../api/endpoints';

export const TeacherModel = {
  async list(filters = {}) {
    const page = normalizePage(await api.get(endpoints.teachers.list, null, filters));
    return {
      ...page,
      items: page.items.map((t) => ({
        id: t.id,
        name: t.fullName || t.name || '',
        staffNumber: t.staffNumber || '',
        status: t.status || 'Active',
      })),
    };
  },

  async create(body) {
    return api.post(endpoints.teachers.create, null, body);
  },

  async byId(teacherId) {
    return api.get(endpoints.teachers.byId, { teacherId });
  },

  async update(teacherId, body) {
    return api.patch(endpoints.teachers.byId, { teacherId }, body);
  },

  /** Current teaching responsibilities (class/subject pairs). */
  async assignments(teacherId) {
    return api.get(endpoints.teachers.assignments, { teacherId });
  },

  /** Change responsibilities; the backend checks clashes and permissions. */
  async changeAssignments(body) {
    return api.post(endpoints.teachers.assignmentChanges, null, body);
  },

  async retryProvisioning(teacherId) {
    return api.post(endpoints.teachers.retryProvisioning, { teacherId });
  },

  /** Deactivate/reactivate app access. */
  async changeAccess(teacherId, body) {
    return api.post(endpoints.teachers.accessChange, { teacherId }, body);
  },

  async timetable(teacherId) {
    return api.get(endpoints.teachers.timetable, { teacherId });
  },

  async invite(body) {
    return api.post(endpoints.students.inviteAccount, null, body);
  },
};

export default TeacherModel;
