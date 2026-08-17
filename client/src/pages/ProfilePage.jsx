import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { UserCheck, UserPlus, CheckCircle2, BookOpen, Edit2, X, Bookmark, Layers, Image as ImageIcon } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfileUser(data);
      setEditName(data.name || '');
      setEditBio(data.bio || '');
      setEditAvatar(data.avatar || '');

      if (currentUser && data.followers) {
        setIsFollowing(data.followers.some((f) => String(f._id || f) === String(currentUser._id)));
      }

      // Fetch posts by this user
      const feedRes = await API.get('/posts/feed?explore=true');
      const allPosts = Array.isArray(feedRes.data) ? feedRes.data : [];
      const filteredPosts = allPosts.filter(
        (p) => String(p.author?._id) === String(data._id) || p.author?.username === data.username
      );
      setUserPosts(filteredPosts);

      // If own profile, fetch saved posts
      if (currentUser && String(currentUser._id) === String(data._id)) {
        const savedRes = await API.get('/posts/feed?saved=true');
        setSavedPosts(Array.isArray(savedRes.data) ? savedRes.data : []);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUserPosts([]);
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!currentUser) {
      alert('Please log in to follow creators.');
      return;
    }
    try {
      const { data } = await API.put(`/users/${profileUser._id}/follow`);
      setIsFollowing(data.isFollowing);
      setProfileUser((prev) => ({
        ...prev,
        followers: data.isFollowing
          ? [...(prev.followers || []), currentUser._id]
          : (prev.followers || []).filter((f) => String(f._id || f) !== String(currentUser._id))
      }));
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await API.put('/users/profile', {
        name: editName,
        bio: editBio,
        avatar: editAvatar
      });
      setProfileUser((prev) => ({ ...prev, ...data }));
      updateUser(data);
      setIsEditModalOpen(false);
      setToastMsg('Profile updated successfully.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setUserPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
      setSavedPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
    } catch (error) {
      alert('Failed to delete post.');
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '500px', margin: '40px auto' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>The requested user account does not exist.</p>
        <Link to="/" className="btn btn-primary btn-sm">
          Return to Feed
        </Link>
      </div>
    );
  }

  const isSelf = currentUser && String(currentUser._id) === String(profileUser._id);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Toast */}
      {toastMsg && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '10px 18px',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 300,
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
        {/* Banner */}
        <div
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
            position: 'relative'
          }}
        />

        <div style={{ padding: '0 24px 24px' }}>
          {/* Avatar & Follow button row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: '-45px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <img
              src={profileUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={profileUser.name}
              className="avatar"
              style={{
                width: '90px',
                height: '90px',
                border: '4px solid var(--bg-surface)',
                boxShadow: 'var(--shadow-md)'
              }}
            />

            <div>
              {isSelf ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                currentUser && (
                  <button
                    onClick={handleToggleFollow}
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={14} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {/* User details */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{profileUser.name}</h1>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              @{profileUser.username}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, maxWidth: '640px' }}>
              {profileUser.bio || 'Member of the AlphaPulse community.'}
            </p>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {userPosts.length}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                Posts
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {profileUser.followers?.length || 0}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                Followers
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {profileUser.following?.length || 0}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                Following
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('posts')}
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
        >
          <BookOpen size={15} />
          <span>Posts ({userPosts.length})</span>
        </button>
        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          >
            <Bookmark size={15} />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Stream */}
      {activeTab === 'posts' ? (
        userPosts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.92rem' }}>No posts published by this creator yet.</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeletePost={handleDeletePost}
            />
          ))
        )
      ) : savedPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.92rem' }}>No saved posts in your bookmarks.</p>
        </div>
      ) : (
        savedPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeletePost={handleDeletePost}
          />
        ))
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-icon btn-sm"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio Headline</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell the community about yourself..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
