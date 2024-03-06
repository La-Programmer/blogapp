import Post from '../models/PostSchema.js';

// Function to increment the number of comments of a particular post or comment
async function incrementCommentCount(postId) {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { comment_number: 1 } },
      { new: true }
    );
    console.log(updatedPost);
  } catch (error) {
    console.log(error);
  }
}

export default incrementCommentCount;
