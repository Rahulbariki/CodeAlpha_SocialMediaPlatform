const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const defaultDemoPosts = [
  {
    _id: 'post_1',
    author: {
      _id: 'user_alex',
      name: 'Alex Rivera',
      username: 'alex_dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
    },
    content: 'Just launched our fullstack architecture with multi-layer JWT authentication, optimized Mongoose schema design, and modular Express routes. What features are you building this week? #FullStack #React',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    likes: ['user_sarah', 'user_marcus'],
    bookmarks: ['user_sarah'],
    comments: [
      {
        _id: 'comment_1',
        author: {
          _id: 'user_sarah',
          name: 'Sarah Chen',
          username: 'sarah_ui',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
        },
        text: 'The architecture layout looks very solid. Great work on the design tokens and structure.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'post_2',
    author: {
      _id: 'user_sarah',
      name: 'Sarah Chen',
      username: 'sarah_ui',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
    },
    content: 'Frontend Architecture Tip: Establish a single source of truth for design tokens (colors, spacing, typography) using CSS custom properties. It makes theming and responsive scaling seamless across all viewports. #DesignSystems #WebDevelopment',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
    likes: ['user_alex'],
    bookmarks: [],
    comments: [
      {
        _id: 'comment_2',
        author: {
          _id: 'user_marcus',
          name: 'Marcus Vance',
          username: 'marcus_v',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80'
        },
        text: 'Agreed. CSS variables paired with fluid typography gives the best responsive output.',
        createdAt: new Date(Date.now() - 5400000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _id: 'post_3',
    author: {
      _id: 'user_marcus',
      name: 'Marcus Vance',
      username: 'marcus_v',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80'
    },
    content: 'Reviewing RESTful API optimization strategies: ETag caching, token bucket rate limiting, and gzip compression middleware in Express. Reduces response payload sizes by over 65 percent. #NodeJS #WebDevelopment',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    likes: ['user_alex', 'user_sarah'],
    bookmarks: ['user_alex'],
    comments: [],
    createdAt: new Date(Date.now() - 28800000).toISOString()
  }
];


let memoryPosts = [...defaultDemoPosts];

// @desc Create a new Post
// @route POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    try {
      const post = await Post.create({
        author: req.user._id,
        content,
        image: image || ''
      });

      const populatedPost = await Post.findById(post._id).populate('author', 'name username avatar');
      if (populatedPost) {
        memoryPosts.unshift(populatedPost);
        return res.status(201).json(populatedPost);
      }
    } catch (dbErr) {
      // Fall through to memory creation
    }

    const newPost = {
      _id: 'post_' + Date.now(),
      author: {
        _id: req.user._id,
        name: req.user.name || 'Demo Creator',
        username: req.user.username || 'democreator',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      },
      content,
      image: image || '',
      likes: [],
      bookmarks: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    memoryPosts.unshift(newPost);
    return res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// @desc Get Feed Posts (or Explore or Search)
// @route GET /api/posts/feed
const getFeedPosts = async (req, res, next) => {
  try {
    const { explore, q, tag, saved } = req.query;

    try {
      let query = {};

      if (q) {
        query.content = { $regex: q.trim(), $options: 'i' };
      } else if (tag) {
        query.content = { $regex: '#' + tag.trim(), $options: 'i' };
      } else if (!explore && req.user && req.user.following && req.user.following.length > 0) {
        query = { author: { $in: [...req.user.following, req.user._id] } };
      }

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .populate('author', 'name username avatar')
        .populate({
          path: 'comments',
          populate: { path: 'author', select: 'name username avatar' }
        });

      if (posts && posts.length > 0) return res.json(posts);
    } catch (dbErr) {
      // Fall through to memory
    }

    let filtered = [...memoryPosts];

    if (q) {
      const searchLower = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.content.toLowerCase().includes(searchLower) ||
          p.author?.name?.toLowerCase().includes(searchLower) ||
          p.author?.username?.toLowerCase().includes(searchLower)
      );
    } else if (tag) {
      const tagLower = '#' + tag.toLowerCase();
      filtered = filtered.filter((p) => p.content.toLowerCase().includes(tagLower));
    } else if (saved && req.user) {
      filtered = filtered.filter((p) => (p.bookmarks || []).includes(String(req.user._id)));
    } else if (!explore && req.user && req.user.following && req.user.following.length > 0) {
      const followingList = [...req.user.following.map(String), String(req.user._id)];
      const followingPosts = filtered.filter((p) => followingList.includes(String(p.author?._id)));
      if (followingPosts.length > 0) {
        filtered = followingPosts;
      }
    }

    res.json(filtered);
  } catch (error) {
    next(error);
  }
};

// @desc Get single post with comments
// @route GET /api/posts/:id
const getPostById = async (req, res, next) => {
  try {
    try {
      const post = await Post.findById(req.params.id)
        .populate('author', 'name username avatar')
        .populate({
          path: 'comments',
          populate: { path: 'author', select: 'name username avatar' }
        });

      if (post) return res.json(post);
    } catch (dbErr) {
      // Fall through
    }

    const memPost = memoryPosts.find((p) => String(p._id) === String(req.params.id));
    if (memPost) return res.json(memPost);

    res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    next(error);
  }
};

// @desc Like / Unlike Post
// @route POST /api/posts/:id/like
const toggleLikePost = async (req, res, next) => {
  try {
    const userId = req.user._id;

    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
          post.likes = post.likes.filter((id) => String(id) !== String(userId));
        } else {
          post.likes.push(userId);
        }
        await post.save();
        return res.json({ likes: post.likes, isLiked: !isLiked });
      }
    } catch (dbErr) {
      // Fall through to memory logic
    }

    const memPost = memoryPosts.find((p) => String(p._id) === String(req.params.id));
    if (memPost) {
      if (!memPost.likes) memPost.likes = [];
      const isLiked = memPost.likes.includes(String(userId));
      if (isLiked) {
        memPost.likes = memPost.likes.filter((id) => String(id) !== String(userId));
      } else {
        memPost.likes.push(String(userId));
      }
      return res.json({ likes: memPost.likes, isLiked: !isLiked });
    }

    res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    next(error);
  }
};

// @desc Bookmark / Unbookmark Post
// @route POST /api/posts/:id/bookmark
const toggleBookmarkPost = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const memPost = memoryPosts.find((p) => String(p._id) === String(req.params.id));
    if (memPost) {
      if (!memPost.bookmarks) memPost.bookmarks = [];
      const isBookmarked = memPost.bookmarks.includes(String(userId));
      if (isBookmarked) {
        memPost.bookmarks = memPost.bookmarks.filter((id) => String(id) !== String(userId));
      } else {
        memPost.bookmarks.push(String(userId));
      }
      return res.json({ bookmarks: memPost.bookmarks, isBookmarked: !isBookmarked });
    }

    res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    next(error);
  }
};

// @desc Comment on Post
// @route POST /api/posts/:id/comment
const addCommentToPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    try {
      const comment = await Comment.create({
        post: req.params.id,
        author: req.user._id,
        text
      });

      const post = await Post.findById(req.params.id);
      if (post) {
        post.comments.push(comment._id);
        await post.save();
      }

      const populatedComment = await Comment.findById(comment._id).populate('author', 'name username avatar');
      return res.status(201).json(populatedComment);
    } catch (dbErr) {
      const newComment = {
        _id: 'comment_' + Date.now(),
        author: {
          _id: req.user._id,
          name: req.user.name || 'Demo Creator',
          username: req.user.username || 'democreator',
          avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        },
        text,
        createdAt: new Date().toISOString()
      };

      const memPost = memoryPosts.find((p) => String(p._id) === String(req.params.id));
      if (memPost) {
        if (!memPost.comments) memPost.comments = [];
        memPost.comments.push(newComment);
      }
      return res.status(201).json(newComment);
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete Post
// @route DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        if (String(post.author) !== String(req.user._id)) {
          return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        await post.deleteOne();
      }
    } catch (dbErr) {
      // Fall through
    }

    memoryPosts = memoryPosts.filter((p) => String(p._id) !== String(req.params.id));
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getPostById,
  toggleLikePost,
  toggleBookmarkPost,
  addCommentToPost,
  deletePost
};

