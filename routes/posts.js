const express = require('express');
const Posts = require("../schemas/post");
const router = express.Router();

router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;
    const createdAt = new Date();

    if (user && password && title && content) {
        const createPost = await Posts.create({ user, password, title, content, createdAt });

        res.json({ message: "You created a post." });
    } else {
        res.status(400);
        res.json({ message: "The data format is incorrect." });
    }
})

router.get("/posts", async (req, res) => {
    const postsList = await Posts.find({});
    const result = postsList.map((post) => {
        return {
            postId: post["_id"],
            user: post.user,
            title: post.title,
            createdAt: post.createdAt
        }
    });
    const sortedResult = result.sort((a, b) => {
        const date1 = a.createdAt;
        const date2 = b.createdAt;
        if (date1 < date2) {
            return 1
        } else if (date1 > date2) {
            return -1
        } else {
            return 1
        }
    });
    res.json({ data: sortedResult });
})

router.get("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const findPost = await Posts.find({ "_id": _postId });
    const post = findPost[0];
    const result = {
        postId: _postId,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt
    }
    res.json({ data: result });
})

router.put("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password, title, content } = req.body;

    if (password && title && content) {
        const findPost = await Posts.find({ "_id": _postId });
        const postPassword = findPost[0].password;

        if (postPassword === password) {
            await Posts.updateOne({ "_id": _postId }, { $set: { title, content } })
        }

        res.json({ message: "Post edited." });
    } else {
        res.status(400);
        res.json({ message: "The data format is incorrect." });
    }
});

router.delete("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;

    if (password) {
        const findPost = await Posts.find({ "_id": _postId });
        const postPassword = findPost[0].password;

        if (postPassword === password) {
            await Posts.deleteOne({ "_id": _postId })
        }

        res.json({ message: "Post deleted." });
    } else {
        res.status(400);
        res.json({ message: "Please enter the password." });
    }
});

module.exports = router;