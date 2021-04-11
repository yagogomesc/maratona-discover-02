const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    let statusCount = {
      progress: 0,
      done: 0,
      total: Job.get().length,
    };

    // Total de horas por dia de cada job em progresso
    let jobTotalHours = 0;

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

    // qtd de horas que quero trabalhar
    // MENOS
    // quantidade de horas/dia de cada job em progress
    const freeHours = Profile.get()["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: Profile.get(),
      statusCount,
      freeHours,
    });
  },
};
