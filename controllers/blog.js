const blogRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/users");

blogRouter.get("/", async (req, res) => {
  const data = await Blog.find({}).populate("user", {
    password: 0,
    notes: 0,
  });
  res.json(data);
});

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog ? res.json(blog) : res.status(404).end();
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    const blog = new Blog({ ...req.body, user: user._id });

    const data = await blog.save();
    user.notes = [...user.notes, data._id];

    user.save();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog && blog.user.toString() === req.user.toString()) {
      await Blog.findByIdAndDelete(req.params.id);
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.put("/:id", async (req, res, next) => {
  try {
    const data = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
