import Post from '../models/post.mjs';
import Comment from '../models/comment.mjs';
import UserData from "../models/userData.mjs"

export async function addCommunityPost(req, res) {

    try {
        const communityPost = new Post({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            date: new Date(),
            comments: req.body.comments,
            likes: req.body.likes
        });
        await communityPost.save();
        return res.send(communityPost._id);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getCommunityPosts(req, res) {
    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function addComment(req, res) {
    try {
        const userData = await UserData.findOne({ _id: req.session.userId });

        const comment = new Comment({
            username: req.body.username || userData.userProfile.userName,
            text: req.body.text,
            date: new Date()
        });
        await comment.save();
        const post = await Post.findOne({ _id: req.params.postId });
        post.comments.push(comment._id);
        await post.save();

        return res.send(comment._id);
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getCommentsForPost(req, res) {
    try {
        const post = await Post.findOne({ _id: req.params.postId });
        const commentsIds = post.comments;
        const comments = await Comment.find({ _id: { $in: commentsIds } })

        return res.send(comments);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getComment(req, res) {
    try {
        const comment = await Comment.findOne({ _id: req.params.id });
        return res.send(comment);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getPostById(req, res) {
    try {
        const post = await Post.findOne({ _id: req.params.id });
        return res.send(post);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}