const reqLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Method: ", req.method);
    console.log("Path: ", req.path);
    console.log("Body: ", req.body);
    console.log("----------------");
  }
  next();
};

const errHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

module.exports = {
  reqLogger,
  errHandler,
};
