import getPostModel from '../models/post.mjs';
import getCommentModel from '../models/comment.mjs';
import getUserDataModel from "../models/userData.mjs"

export async function addCommunityPost(req, res) {
	const UserData = getUserDataModel() ;
	const Post = getPostModel() ;

    try {
        const userData = await UserData.findOne({ _id: req.session.userId });

        const communityPost = new Post({
            username: userData.userProfile.userName,
            profileImg: userData.userProfile.imageUrl,
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
	const Post = getPostModel() ;

    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function addComment(req, res) {
	const UserData = getUserDataModel() ;
	const Comment = getCommentModel() ;
	const Post = getPostModel() ;

    try {
        const userData = await UserData.findOne({ _id: req.session.userId });

        const comment = new Comment({
            username: userData.userProfile.userName, // *** This looks dangerous!!! Please check. :) ***
            profileImg: userData.userProfile.imageUrl,
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

export async function likePost(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.postId });
        if (post.likes.includes(req.session.userId)) {
            post.likes = post.likes.filter(id => id != req.session.userId);
            await post.save();
            return res.send({ message: "like removed" });
        } else {
            post.likes.push(req.session.userId);
            await post.save();
            return res.send({ message: "like added" });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function lolPost(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.postId });
        if (post.lols.includes(req.session.userId)) {
            post.lols = post.lols.filter(id => id != req.session.userId);
            await post.save();
            return res.send({ message: "lol removed" });
        } else {
            post.lols.push(req.session.userId);
            await post.save();
            return res.send({ message: "lol added" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getCommentsForPost(req, res) {
	const Post = getPostModel() ;
	const Comment = getCommentModel() ;

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
	const Comment = getCommentModel() ;

    try {
        const comment = await Comment.findOne({ _id: req.params.id });
        return res.send(comment);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getPostById(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.id });
        return res.send(post);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getLikesArray(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.postId });
        return res.send([post.likes.length]);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getLolsArray(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.postId });
        return res.send([post.lols.length]);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}

export async function getCommentArray(req, res) {
	const Post = getPostModel() ;

    try {
        const post = await Post.findOne({ _id: req.params.postId });
        return res.send([post.comments.length]);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong!" })
    }
}