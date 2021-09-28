const { mostBlogs, mostLikes } = require("../utils/list_helper");

const authors = [
  {
    author: "Michael Chan",
    likes: 32,
    blogs: 10,
  },
  {
    author: "Edsger W. Dijkstra",
    likes: 6,
    blogs: 2,
  },
  {
    author: "Edsger W. Dijkstra",
    likes: 76,
    blogs: 15,
  },
  {
    author: "Robert C. Martin",
    likes: 22,
    blogs: 6,
  },
  {
    author: "Robert C. Martin",
    likes: 0,
    blogs: 1,
  },
  {
    author: "Robert C. Martin",
    likes: 5,
    blogs: 1,
  },
];

describe("return top author", () => {
  test("most number of blogs", () => {
    expect(mostBlogs(authors)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 76,
      blogs: 15,
    });
  });

  test("most number of likes", () => {
    expect(mostLikes(authors)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 76,
      blogs: 15,
    });
  });
});
