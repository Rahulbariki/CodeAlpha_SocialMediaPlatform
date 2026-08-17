# CodeAlpha Task 2 - Social Media Platform (CodeAlpha_SocialMediaPlatform)

**Intern:** Rahul Bariki (CA/DF1/245571)  
**Domain:** Full Stack Web Development (MERN)  
**Internship Duration:** 20th August 2026 - 20th September 2026  

---

## Overview

**AlphaPulse** is a modern, high-performance Social Media Platform built with the **MERN** stack (MongoDB, Express.js, React + Vite, Node.js). It enables users to create profiles, publish rich discussions with media attachments, interact through like toggles and comments, follow other creators, and discover trending topics across a responsive interface.

---

## Core Task Requirements & Features

### 1. User Profiles & Authentication
- Secure authentication using JSON Web Tokens (JWT) and bcrypt password hashing.
- Real-time user registration storing credentials in MongoDB / Database.
- User profile pages with bio, avatar, follower/following metrics, and authored posts.
- In-place profile customization modal (display name, bio, avatar).

### 2. Posts & Rich Interactions
- Post creation supporting rich text, topic hashtags, and image attachments.
- Interactive like toggle with optimistic UI counter updates.
- Comment drawer with author avatars, relative timestamps, and instant comment posting.
- Lightbox fullscreen media preview.
- Post bookmarking / pin-to-saved functionality.
- Post deletion for authored content.

### 3. Follow & Discovery System
- Follow and unfollow creators with real-time stat synchronization.
- Following Feed: Personalized stream of posts from followed creators.
- Explore Feed: Global community stream.
- Live search bar and topic filter chips.
- Suggested creators sidebar with quick follow actions.

---

## Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) with fallback memory data store |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Styling** | Modern Dark Slate Design System (Plus Jakarta Sans, Inter, CSS Custom Properties) |

---

## Repository Directory Structure

```
CodeAlpha_SocialMediaPlatform/
├── server/
│   ├── config/          # Database connection (db.js)
│   ├── controllers/     # Business logic (authController, userController, postController)
│   ├── middleware/      # Auth (auth.js) and Error handler (errorHandler.js)
│   ├── models/          # Mongoose Schemas (User.js, Post.js, Comment.js)
│   ├── routes/          # Express routes (authRoutes, userRoutes, postRoutes)
│   ├── .env             # Environment configuration
│   ├── seed.js          # Database seeder script
│   ├── server.js        # Main Express API entrypoint
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/          # Axios client with JWT interceptor
    │   ├── components/   # Navbar, Footer, PostCard, CreatePostModal, ProtectedRoute
    │   ├── context/      # AuthContext
    │   ├── pages/        # FeedPage, ProfilePage, PostDetailPage, LoginPage, RegisterPage
    │   ├── App.jsx       # Route definitions & global modals
    │   ├── main.jsx      # React DOM entrypoint
    │   └── index.css     # Modern Dark Theme CSS Design System
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Quick Start & Local Setup

### 1. Start the Backend Server
```bash
cd CodeAlpha_SocialMediaPlatform/server
npm install
npm start        # Runs Express API on http://localhost:5001
```

### 2. Start the Frontend Client
```bash
cd CodeAlpha_SocialMediaPlatform/client
npm install
npm run dev      # Runs React Vite client on http://localhost:3001
```

---

## Verification & Submission Checklist

- [x] Full MERN stack architecture implemented (MongoDB, Express, React, Node).
- [x] User registration, login, and profile management with bcrypt password hashing.
- [x] Post composer with media attachments, like toggle, and comment threads.
- [x] Creator follow/unfollow system with personalized and explore feeds.
- [x] Search, hashtag filtering, and bookmarking.
- [x] Modern, clean, and responsive UI without emotes or placeholder design patterns.
