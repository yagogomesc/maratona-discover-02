const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() });
  },
  async update(req, res) {
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

    const profile = await Profile.get();

    await Profile.update({
      ...profile,
      ...req.body,
      "value-hour": valueHour,
    });

    return res.redirect("/profile");
  },
};
