const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  // Note 2nd parameter is a reference to a function that we are telling Express to run when
  // ever a POST request is received to the specified route
  app.post("/api/stripe", requireLogin, async (req, res) => {
    // going to actually do the charge to the credit cars from the back end server
    console.log(req.body);
    // Create the actual charge to credit card
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      source: req.body.id,
    });
    console.log(charge);

    // User Model = req.user - user is set up by PassPort middleware
    req.user.credits += 5;

    // persist to the databaseby calling save on the User Model???
    const user = await req.user.save();

    // Update the browser
    res.send(user);
  });
};
