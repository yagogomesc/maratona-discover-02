const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    const jobs = Job.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    const updatedJobs = Job.get().map((job) => {
      // Ajustes no jobs
      // calculo de tempo restante
      const remaining = JobUtils.remainingDays(job);

      const status = remaining <= 0 ? "done" : "progress";
      statusCount[status] += 1;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"]),
      };
    });

    return res.render("index", {
      jobs: updatedJobs,
      profile: Profile.get(),
      statusCount,
    });
  },
};
