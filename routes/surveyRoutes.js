const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

// Get access to the model CLASS
const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for voting!");
  });

  // call requireLogin and then requireCredits if encountering this route - ORDER SENSITIVE
  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    // Pull out the following properties from the req.body object ES2015
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title, //ES2015 short hand with same names
      subject,
      body,
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })), // return object with property of email and value of email
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Great place to send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user); // send back to the browser using the returned user model which is less stale
    } catch (err) {
      // 422 unprocessable entity
      res.status(422).send(err);
    }
  });
};
