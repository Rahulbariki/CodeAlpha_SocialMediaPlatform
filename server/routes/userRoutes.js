const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/suggested', protect, getSuggestedUsers);
router.get('/search', searchUsers);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', getUserProfile);
router.put('/:id/follow', protect, followUnfollowUser);

module.exports = router;

