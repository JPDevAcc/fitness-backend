import Post from '../models/post.mjs';

export async function addCommunityPost(req, res) {

    try {

        const communityPost = new Post({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            comments: req.body.comments,
            likes: req.body.likes
        });

        await communityPost.save();
        return res.send({ message: "Post added successfully!" });
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