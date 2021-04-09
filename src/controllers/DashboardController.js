const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    const updatedJobs = Job.get().map((job) => {
      // Ajustes no jobs
      // calculo de tempo restante
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"]),
      };
    });

    const activeJobs = updatedJobs.filter((job) => job.status === "progress");
    const finishedJobs = updatedJobs.filter((job) => job.status === "done");

    return res.render("index", {
      jobs: updatedJobs,
      profile: Profile.get(),
      activeJobs,
      finishedJobs,
    });
  },
};
