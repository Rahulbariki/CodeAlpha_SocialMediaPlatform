import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreatePostModal from './components/CreatePostModal';

import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lastCreatedPost, setLastCreatedPost] = useState(null);

  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <FeedPage
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    lastCreatedPost={lastCreatedPost}
                  />
                }
              />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>

          <CreatePostModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onPostCreated={(newPost) => {
              setLastCreatedPost(newPost);
            }}
          />

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

