const express = require('express');
const Comments = require("../schemas/comment");
const router = express.Router();

router.post("/comments/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const createdAt = new Date();
    const { user, password, content } = req.body;

    if (user && password && content) {
        const createComment = await Comments.create({
            postId: _postId, user, password, content, createdAt
        });
        res.json({ message: "Comment created." })
    } else if (user && password) {
        res.status(400);
        res.json({ message: "Please enter the comment content." });
    } else {
        res.status(400);
        res.json({ message: "The data format is incorrect." });
    }
});

router.get("/comments/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const commentsList = await Comments.find({ postId: _postId });

    const result = commentsList.map((comment) => {
        return {
            commentId: comment._id,
            user: comment.user,
            content: comment.content,
            createdAt: comment.createdAt
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
});

router.put("/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;

    if (password && content) {
        const findComment = await Comments.find({ "_id": _commentId });
        const commentPassword = findComment[0].password;

        if (commentPassword === password) {
            await Comments.updateOne({ "_id": _commentId }, { $set: { content } })
        }

        res.json({ message: "Comment edited." });
    } else if (password) {
        res.status(400);
        res.json({ message: "Please enter the comment content." });
    } else {
        res.status(400);
        res.json({ message: "Please enter the password and comment content." });
    }

});

router.delete("/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password } = req.body;

    if (password) {
        const findComment = await Comments.find({ "_id": _commentId });
        const commentPassword = findComment[0].password;

        if (commentPassword === password) {
            await Comments.deleteOne({ "_id": _commentId })
        }

        res.json({ message: "Post deleted." });
    } else {
        res.status(400);
        res.json({ message: "Please enter the password." });
    }

})

module.exports = router;