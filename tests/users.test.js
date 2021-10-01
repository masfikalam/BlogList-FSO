const User = require("../models/users");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
jest.setTimeout(100000);

describe("adding users", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const hashed = await bcrypt.hash("password123", 10);
    const user = new User({
      name: "Arto Hallas",
      username: "artohallas",
      password: hashed,
    });
    await user.save();
  });

  test("add valid user", async () => {
    const hashed = await bcrypt.hash("adaislove123", 10);
    const user = new User({
      name: "Ada Lovelace",
      username: "adalovelace",
      password: hashed,
    });
    await user.save();

    const res = await api.get("/api/users");
    expect(res.body).toHaveLength(2);
  });

  test("don't add invalid user", async () => {
    const user = new User({
      name: "Arto Hallas",
      username: "artohallas",
      password: "samepassword",
    });

    await api.post("/api/users").send(user).expect(500);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
