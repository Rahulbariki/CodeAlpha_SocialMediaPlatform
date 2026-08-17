const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
  getPostById,
  toggleLikePost,
  toggleBookmarkPost,
  addCommentToPost,
  deletePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createPost);

router.get('/feed', protect, getFeedPosts);

router.route('/:id')
  .get(getPostById)
  .delete(protect, deletePost);

router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/bookmark', protect, toggleBookmarkPost);
router.post('/:id/comment', protect, addCommentToPost);

module.exports = router;

