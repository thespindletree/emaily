const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url"); // from node.js system
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

// Get access to the model CLASS
const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false, // dont retrieve recipients subducuments
    });

    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  // app.post("/api/surveys/webhooks", (req, res) => {
  //   const events = _.map(req.body, ({ email, url }) => {
  //     const p = new Path("/api/surveys/:surveyId/:choice");

  //     const match = p.test(new URL(url).pathname);
  //     if (match) {
  //       return {
  //         email,
  //         surveyId: match.surveyId, // cant destructure here cos p.test might return null
  //         choice: match.choice,
  //       };
  //     }
  //   });

  //   const compactEvents = _.compact(events); //create an array with any "falsey" values removed
  //   // from the input array - (false, null, "", undefined, NaN)

  //   const uniqueEvents = _.uniqBy(compactEvents, "email, surveyId"); // remove duplicates
  //   res.send({});
  // });
  // EQUIVALENT BELOW using Lodash CHAIN

  app.post("/api/surveys/webhooks", (req, res) => {
    _.chain(req.body)
      .map(({ email, url }) => {
        const p = new Path("/api/surveys/:surveyId/:choice");

        const match = p.test(new URL(url).pathname);
        if (match) {
          return {
            email,
            surveyId: match.surveyId, // cant destructure here cos p.test might return null
            choice: match.choice,
          };
        }
      })
      .compact()
      .uniqBy("email, surveyId")
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    res.send({});
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
