const postsRouter = require("./posts");
const commentsRouter = require("./comments");

const index = [postsRouter, commentsRouter]

module.exports = index;