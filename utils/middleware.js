const jwt = require("jsonwebtoken");
const User = require("../models/users");

const reqLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Method: ", req.method);
    console.log("Path: ", req.path);
    console.log("Body: ", req.body);
    console.log("----------------");
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.get("authorization");
  const auth = jwt.verify(token, process.env.JWT_SECRET);

  if (auth.id) {
    const user = await User.findById(auth.id);
    req.user = user._id;
    next();
  } else {
    res.status(401).end();
  }
};

const errHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (err.name === "MongoServerError") {
    return res.status(400).json({ error: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  next(err);
};

module.exports = {
  reqLogger,
  userExtractor,
  errHandler,
};
