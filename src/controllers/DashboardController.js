const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const job = Job.get();
    const profile = await Profile.get();
    let statusCount = {
      progress: 0,
      done: 0,
      total: job.length,
    };

    // Total de horas por dia de cada job em progresso
    let jobTotalHours = 0;

    const updatedJobs = job.map((job) => {
      // Ajustes no jobs
      // calculo de tempo restante
      const remaining = JobUtils.remainingDays(job);

      const status = remaining <= 0 ? "done" : "progress";
      statusCount[status] += 1;

      // Total de horas por dia de cada job em progresso
      jobTotalHours =
        status == "progress"
          ? jobTotalHours + Number(job["daily-hours"])
          : jobTotalHours;
      // if (status === "progress") {
      //   jobTotalHours += Number(job["daily-hours"]);
      // }

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
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile,
      statusCount,
      freeHours,
    });
  },
};
