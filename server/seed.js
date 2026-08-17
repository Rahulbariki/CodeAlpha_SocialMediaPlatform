const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const { defaultDemoUsers } = require('./controllers/authController');

dotenv.config();

const seedSocialData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codealpha_socialmedia');
    console.log('MongoDB Connected for Social Media Seeding...');

    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    const createdUsers = await User.create(
      defaultDemoUsers.map((u) => {
        const { _id, ...userRest } = u;
        return userRest;
      })
    );

    console.log(`Seeded ${createdUsers.length} users successfully!`);

    const firstUser = createdUsers[0];

    const post1 = await Post.create({
      author: firstUser._id,
      content: 'Building fullstack web applications with modern architecture patterns! What projects are you working on this month? 🚀💻',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
      likes: [createdUsers[1]._id]
    });

    await Comment.create({
      post: post1._id,
      author: createdUsers[1]._id,
      text: 'Looks awesome! Love the glassmorphic aesthetics and modular layout.'
    });

    console.log('Seeded sample posts & comments successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedSocialData();
