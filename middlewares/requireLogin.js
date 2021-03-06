module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "You must log in!" }); // HTTP Unauthorised
  }

  next(); // allow progression onto the next middleware
};
