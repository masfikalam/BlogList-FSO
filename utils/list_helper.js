const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blogs) => sum + blogs.likes, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map((b) => b.likes));
  return blogs.find((b) => b.likes === mostLikes);
};

const mostBlogs = (authors) => {
  const most = Math.max(...authors.map((a) => a.blogs));
  return authors.find((a) => a.blogs === most);
};

const mostLikes = (authors) => {
  const most = Math.max(...authors.map((a) => a.likes));
  return authors.find((a) => a.likes === most);
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
