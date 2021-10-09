const userRouter = require("express").Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.get("/", async (req, res) => {
  let data = await User.find({}).populate("notes", { author: 0, user: 0 });
  data = data.map((d) => {
    return {
      id: d.id,
      name: d.name,
      notes: d.notes,
      username: d.username,
    };
  });

  res.json(data);
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("notes", {
      title: 1,
      id: 1,
    });
    delete user.password;
    user
      ? res.json({ name: user.name, id: user.id, blogs: user.notes })
      : res.status(404).end();
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    if (body.username.length < 3 || body.password.length < 3) {
      res.status(400).json({ message: "too short username or password" });
    } else {
      const hashed = await bcrypt.hash(req.body.password, 10);
      const user = new User({ ...req.body, password: hashed });
      const data = await user.save();
      res.json(data);
    }
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);

      if (password) {
        const payload = { username: user.username, id: user._id };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });
        res.status(200).send({ token, ...payload });
      } else {
        res.status(401).json({ error: "invalid password" });
      }
    } else {
      res.status(401).json({ error: "invalid username" });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).end();
});

module.exports = userRouter;
