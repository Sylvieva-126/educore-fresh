/** AD19 — Review and publish results: mark packages, report batches, review issues. */
import { api, normalizePage } from '../api/client';
import { endpoints } from '../api/endpoints';

export const ResultsModel = {
  async markPackages(query) {
    return normalizePage(await api.get(endpoints.results.markPackages, null, query));
  },

  async markPackageById(packageId) {
    return api.get(endpoints.results.markPackageById, { packageId });
  },

  /** Send a package back to the teacher (e.g. inconsistent marks). */
  async returnPackage(packageId, body) {
    return api.post(endpoints.results.returnPackage, { packageId }, body);
  },

  /** Decide how absences are recorded in a package. */
  async resolveAbsences(packageId, body) {
    return api.post(endpoints.results.absenceResolutions, { packageId }, body);
  },

  async reportBatches(query) {
    return normalizePage(await api.get(endpoints.results.reportBatches, null, query));
  },

  async reportBatchById(batchId) {
    return api.get(endpoints.results.reportBatchById, { batchId });
  },

  async returnBatch(batchId, body) {
    return api.post(endpoints.results.returnBatch, { batchId }, body);
  },

  /** Publish → report cards appear in Student/Parent apps. */
  async publishBatch(batchId) {
    return api.post(endpoints.results.publishBatch, { batchId });
  },

  async reopenBatch(batchId) {
    return api.post(endpoints.results.reopenBatch, { batchId });
  },

  async raiseReviewIssue(body) {
    return api.post(endpoints.results.reviewIssues, null, body);
  },

  async resolveReviewIssue(issueId, body) {
    return api.post(endpoints.results.resolveIssue, { issueId }, body);
  },
};

export default ResultsModel;
