// backend/jobStateManager.js

class JobStateManager {
    constructor() {
      this.activeJobs = new Map();
      this.cancelledJobs = new Set();
    }
  
    markJobActive(jobId) {
      this.activeJobs.set(jobId, true);
    }
  
    markJobCancelled(jobId) {
      this.cancelledJobs.add(jobId);
    }
  
    isJobCancelled(jobId) {
      return this.cancelledJobs.has(jobId);
    }
  
    removeJob(jobId) {
      this.activeJobs.delete(jobId);
      this.cancelledJobs.delete(jobId);
    }
  
    isJobActive(jobId) {
      return this.activeJobs.has(jobId);
    }
  
    async handleJobCancellation(job) {
      try {
        const { inputPath } = job.data;
        const { outputPath } = job.returnvalue || {};
  
        this.markJobCancelled(job.id);
  
        // Try to clean up files
        if (inputPath) await fs.unlink(inputPath).catch(() => {});
        if (outputPath) await fs.unlink(outputPath).catch(() => {});
  
        await job.remove();
        console.log(`Job ${job.id} cancelled and cleaned up`);
      } catch (error) {
        console.error(`Error handling job cancellation for ${job.id}:`, error);
      } finally {
        this.removeJob(job.id);
      }
    }
  }
  
  const jobStateManager = new JobStateManager();
  module.exports = jobStateManager;