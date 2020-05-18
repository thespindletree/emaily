const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

class Mailer extends helper.Mail {
  // Note the destructurised 1st parameter instead of survey object
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("jim@avocethorizons.co.uk");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body); // inherited - have to call this to register body content to mailer
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    // pull out email property from every recipient
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalise = new helper.Personalization();
    this.recipients.forEach((recipient) => {
      personalise.addTo(recipient);
    });
    this.addPersonalization(personalise); // inherited - have to call this
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON(), // inherited
    });

    const response = await this.sgApi.API(request); // have to call this API method - does the actual sending
    return response;
  }
}

module.exports = Mailer;
