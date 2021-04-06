const express = require("express");
const routes = express();

const views = __dirname + "/views/";

const Profile = {
  data: {
    name: "Yago",
    avatar: "https://github.com/yagogomesc.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render(views + "profile", { profile: Profile.data });
    },
    update(req, res) {
      // req.body para pegar os dados
      const data = req.body;
      // definir quantas semanas tem num ano : 52
      const weeksPerYear = 52;
      // Remover as semanas de férias do ano, para pegar quantas semanas tem em um mes
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
      // Quantas horas por semanas estou trabalhando
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
      // total de horas trabalhadas no mes
      const monthlyTotalHours = weekTotalHours * weeksPerMonth;

      // Qual sera o valor da minha hora?
      const valueHour = data["monthly-budget"] / monthlyTotalHours;
      console.log(req.body);
      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour,
      };

      return res.redirect("/profile");
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),
    },
  ],
  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        // Ajustes no jobs
        // calculo de tempo restante
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data["value-hour"] * job["total-hours"],
        };
      });

      return res.render(views + "/index", {
        jobs: updatedJobs,
        profile: Profile.data,
      });
    },
    create(req, res) {
      return res.render(views + "job");
    },
    save(req, res) {
      // req.body = {name: '', 'daily-hours':'', 'total-hours': ''}
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(),
      });

      return res.redirect("/");
    },
    show(req, res) {
      const jobId = req.params.id;
      const job = Job.data.find((job) => Number(job.id) === Number(jobId));
      if (!job) {
        return res.send("Job not found!");
      }
      return res.render(views + "job-edit", { job });
    },
  },
  services: {
    remainingDays(job) {
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

      const createdDate = new Date(job.created_at);
      const dueDay = createdDate.getDate() + Number(remainingDays);
      const dueDateInMs = createdDate.setDate(dueDay);

      const timeDiffInMs = dueDateInMs - Date.now();
      // Transformar milisegundos em dias
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    },
  },
};

routes.get("/", Job.controllers.index);

routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);

routes.get("/job/:id", Job.controllers.show);

routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
