const { dummy, totalLikes, favoriteBlog } = require("../utils/list_helper");

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

test("dummy returns 1", () => {
  expect(dummy([1, 2, 3])).toBe(1);
});

describe("count total likes", () => {
  test("likes of empty list", () => {
    expect(totalLikes([])).toBe(0);
  });

  test("likes of single item", () => {
    expect(totalLikes([blogs[0]])).toBe(7);
  });

  test("likes of fulfilled list", () => {
    expect(totalLikes(blogs)).toBe(36);
  });
});

describe("return favorite blog", () => {
  test("among one blog", () => {
    expect(favoriteBlog([blogs[2]])).toEqual(blogs[2]);
  });

  test("among all blogs", () => {
    expect(favoriteBlog(blogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    });
  });
});
