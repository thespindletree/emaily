module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    return res.status(403).send({ error: "Not enough credits!" }); // HTTP Forbidden
  }

  next(); // allow progression onto the next middleware
};
