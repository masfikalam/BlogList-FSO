const supertest = require("supertest");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
jest.setTimeout(100000);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmRhX2RyYWdvbiIsImlkIjoiNjE1NzBlNmRiMTE5OWIyZGM5NGNiMGI0IiwiaWF0IjoxNjMzMTAzNTE3LCJleHAiOjE2MzMxMDcxMTd9.ojMOJ6oHmtmey9RyHhvUj0yjI677JYFaWk6qX_HQ2EU";
const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const objects = blogs.map((b) => new Blog(b));
  const array = objects.map((obj) => obj.save());
  await Promise.all(array);
});

describe("viewing blogs", () => {
  test("return all blogs in JSON", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body).toHaveLength(blogs.length);
    expect(Object.values(res.headers)).toContain(
      "application/json; charset=utf-8"
    );
  });

  test("unique id property", async () => {
    const res = await api.get("/api/blogs");
    const ids = res.body.map((b) => b.id);
    expect(ids).toBeDefined();
  });

  test("default like value 0", async () => {
    const newBlog = {
      author: "Jon Doe",
      title: "JavaScript Spread Operator",
      url: "https://javascript.info",
    };

    const rebecca = await api.get("/api/users");
    console.log(rebecca.body);

    const res = await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog);
    expect(res.body.likes).toBe(0);
  });
});

describe("adding blogs", () => {
  test("can add valid blog", async () => {
    const newBlog = {
      author: "Jon Doe",
      title: "JavaScript Arrow Functions",
      url: "https://reactjs.org",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const res = await api.get("/api/blogs");
    const title = res.body.map((r) => r.title);

    expect(res.body).toHaveLength(blogs.length + 1);
    expect(title).toContain("JavaScript Arrow Functions");
  });

  test("cannot add invalid blog", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send({ author: "Jon Doe" })
      .expect(400);
  });

  test("cannot add without token", async () => {
    const newBlog = {
      author: "Jon Doe",
      title: "JavaScript Arrow Functions",
      url: "https://reactjs.org",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("authorization", "abcd1234")
      .send(newBlog)
      .expect(401);
  });
});

describe("edit/delete blogs", () => {
  test("cannot modify by invalid id", async () => {
    await api.put("/api/blogs").send("abcd1234").expect(404);
  });

  test("cannot delete by invalid id", async () => {
    await api
      .delete("/api/blogs")
      .set("Authorization", token)
      .send("abcd1234")
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
