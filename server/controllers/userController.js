const User = require('../models/User');
const { memoryUsers } = require('./authController');

// @desc Get user profile by ID or username
// @route GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers', 'name username avatar')
        .populate('following', 'name username avatar');
      if (user) return res.json(user);
    } catch (dbErr) {
      // Fall through
    }

    const memUser = memoryUsers.find(
      (u) => String(u._id) === String(req.params.id) || u.username === req.params.id
    );

    if (memUser) {
      const { password, ...userData } = memUser;
      return res.json(userData);
    }

    res.status(404).json({ message: 'User profile not found' });
  } catch (error) {
    next(error);
  }
};

// @desc Follow / Unfollow User
// @route PUT /api/users/:id/follow
const followUnfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (String(targetUserId) === String(currentUserId)) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
      const targetUser = await User.findById(targetUserId);
      const currentUser = await User.findById(currentUserId);

      if (targetUser && currentUser) {
        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
          // Unfollow
          currentUser.following = currentUser.following.filter((id) => String(id) !== String(targetUserId));
          targetUser.followers = targetUser.followers.filter((id) => String(id) !== String(currentUserId));
        } else {
          // Follow
          currentUser.following.push(targetUserId);
          targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.json({
          isFollowing: !isFollowing,
          followersCount: targetUser.followers.length,
          followingCount: currentUser.following.length
        });
      }
    } catch (dbErr) {
      // Fall through to memory logic
    }

    const cUser = memoryUsers.find((u) => String(u._id) === String(currentUserId));
    const tUser = memoryUsers.find((u) => String(u._id) === String(targetUserId));

    if (cUser && tUser) {
      const isFollowing = cUser.following.includes(String(targetUserId));

      if (isFollowing) {
        cUser.following = cUser.following.filter((id) => String(id) !== String(targetUserId));
        tUser.followers = tUser.followers.filter((id) => String(id) !== String(currentUserId));
      } else {
        cUser.following.push(String(targetUserId));
        tUser.followers.push(String(currentUserId));
      }

      return res.json({
        isFollowing: !isFollowing,
        followersCount: tUser.followers.length,
        followingCount: cUser.following.length
      });
    }

    res.status(404).json({ message: 'User not found for follow action' });
  } catch (error) {
    next(error);
  }
};

// @desc Get suggested users to follow
// @route GET /api/users/suggested
const getSuggestedUsers = async (req, res, next) => {
  try {
    try {
      const users = await User.find({ _id: { $ne: req.user._id } })
        .select('name username avatar bio followers')
        .limit(5);
      if (users && users.length > 0) return res.json(users);
    } catch (dbErr) {
      // Fall through
    }

    const suggestions = memoryUsers.filter((u) => String(u._id) !== String(req.user._id));
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile (name, bio, avatar)
// @route PUT /api/users/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);
      if (user) {
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;

        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          followers: updatedUser.followers,
          following: updatedUser.following
        });
      }
    } catch (dbErr) {
      // Fall through to memory logic
    }

    const memUser = memoryUsers.find((u) => String(u._id) === String(userId));
    if (memUser) {
      if (name) memUser.name = name;
      if (bio !== undefined) memUser.bio = bio;
      if (avatar !== undefined) memUser.avatar = avatar;

      const { password, ...safeData } = memUser;
      return res.json(safeData);
    }

    res.status(404).json({ message: 'User not found for update' });
  } catch (error) {
    next(error);
  }
};

// @desc Search users by query
// @route GET /api/users/search
const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q ? req.query.q.trim().toLowerCase() : '';
    if (!query) {
      return res.json([]);
    }

    try {
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } }
        ]
      })
        .select('-password')
        .limit(10);

      if (users && users.length > 0) return res.json(users);
    } catch (dbErr) {
      // Fall through
    }

    const matched = memoryUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          (u.bio && u.bio.toLowerCase().includes(query))
      )
      .map(({ password, ...rest }) => rest);

    res.json(matched);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  searchUsers
};

