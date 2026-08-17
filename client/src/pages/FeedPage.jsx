import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Compass,
  Radio,
  Plus,
  UserPlus,
  TrendingUp,
  Edit3,
  CheckCircle2,
  Search,
  Bookmark,
  Hash,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: 'FullStack', count: '1.8k posts' },
  { tag: 'React', count: '1.4k posts' },
  { tag: 'NodeJS', count: '920 posts' },
  { tag: 'WebDevelopment', count: '840 posts' },
  { tag: 'DesignSystems', count: '610 posts' }
];

export default function FeedPage({ onOpenCreateModal, lastCreatedPost }) {
  const { user } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const activeTabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    activeTabParam === 'explore' ? 'explore' : activeTabParam === 'saved' ? 'saved' : 'feed'
  );

  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    if (activeTabParam === 'explore') setActiveTab('explore');
    else if (activeTabParam === 'saved') setActiveTab('saved');
    else setActiveTab('feed');
  }, [activeTabParam]);

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchSuggestedUsers();
    }
  }, [activeTab, user, searchQuery, selectedTag]);

  // Reactive prepend when post created
  useEffect(() => {
    if (lastCreatedPost) {
      setPosts((prev) => [lastCreatedPost, ...prev.filter((p) => p._id !== lastCreatedPost._id)]);
    }
  }, [lastCreatedPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = '/posts/feed?';
      if (activeTab === 'explore') url += 'explore=true&';
      if (activeTab === 'saved') url += 'saved=true&';
      if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery.trim())}&`;
      if (selectedTag) url += `tag=${encodeURIComponent(selectedTag)}&`;

      const { data } = await API.get(url);
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch feed posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const { data } = await API.get('/users/suggested');
      setSuggestedUsers(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => String(p._id) !== String(postId)));
    } catch (error) {
      alert('Failed to delete post.');
    }
  };

  const handleFollowUser = async (targetId) => {
    try {
      await API.put(`/users/${targetId}/follow`);
      fetchSuggestedUsers();
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 280px',
          gap: '24px',
          alignItems: 'start',
          width: '100%'
        }}
      >
        {/* LEFT COLUMN: Profile widget */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
          {user ? (
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="avatar"
                style={{ width: '64px', height: '64px', margin: '0 auto 12px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{user.name}</h3>
                <CheckCircle2 size={14} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                @{user.username}
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                  lineHeight: 1.4
                }}
              >
                {user.bio || 'Member of AlphaPulse community.'}
              </p>
              <Link to={`/profile/${user._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Profile
              </Link>
            </div>
          ) : (
            <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Join AlphaPulse</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                Create an account to publish discussions, follow creators, and interact with the community.
              </p>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Sign Up Free
              </Link>
            </div>
          )}

          {/* Quick Filter Tags */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Filter Topics
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={() => setSelectedTag('')}
                className={`btn ${!selectedTag ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ padding: '3px 8px', fontSize: '0.78rem' }}
              >
                All Topics
              </button>
              {TRENDING_TOPICS.map((t) => (
                <button
                  key={t.tag}
                  onClick={() => setSelectedTag(selectedTag === t.tag ? '' : t.tag)}
                  className={`btn ${selectedTag === t.tag ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                >
                  #{t.tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Composer, Tabs, Posts */}
        <main>
          {/* Quick Post Composer Card */}
          {user && (
            <div
              className="card"
              style={{
                padding: '16px 20px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="avatar"
                style={{ width: '38px', height: '38px' }}
              />
              <button
                onClick={onOpenCreateModal}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Start a discussion or share an update...
              </button>
              <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm">
                <Plus size={15} strokeWidth={2.5} />
                <span>Post</span>
              </button>
            </div>
          )}

          {/* Search bar */}
          <div
            className="card"
            style={{
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search posts, creators, or topics..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                boxShadow: 'none',
                padding: '2px 0',
                fontSize: '0.9rem',
                background: 'transparent'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ color: 'var(--text-muted)', padding: '2px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tabs Container */}
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('feed')}
              className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            >
              <Radio size={15} />
              <span>Following Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            >
              <Compass size={15} />
              <span>Explore</span>
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              >
                <Bookmark size={15} />
                <span>Saved Posts</span>
              </button>
            )}
          </div>

          {/* Active Tag indicator */}
          {selectedTag && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                background: 'var(--bg-surface-elevated)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                width: 'fit-content',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Filtered by #{selectedTag}</span>
              <button
                onClick={() => setSelectedTag('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Posts Stream */}
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem' }}>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  marginBottom: '14px'
                }}
              >
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                No Posts Found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 16px' }}>
                {searchQuery || selectedTag
                  ? 'No posts matched your current search filters. Try adjusting your query.'
                  : activeTab === 'saved'
                  ? 'You have not saved any posts yet.'
                  : 'Follow other creators or explore the global community stream.'}
              </p>
              {user && (
                <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm">
                  <Plus size={15} />
                  <span>Create First Post</span>
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeletePost={handleDeletePost}
              />
            ))
          )}
        </main>

        {/* RIGHT COLUMN: Trending topics & Suggested users */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
          {/* Trending Topics */}
          <div className="card" style={{ padding: '18px' }}>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)'
              }}
            >
              <TrendingUp size={16} style={{ color: 'var(--accent-primary)' }} />
              Trending Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TRENDING_TOPICS.map((topic) => (
                <div
                  key={topic.tag}
                  onClick={() => setSelectedTag(topic.tag)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    #{topic.tag}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {topic.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Creators */}
          <div className="card" style={{ padding: '18px' }}>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)'
              }}
            >
              <Users size={16} style={{ color: 'var(--accent-secondary)' }} />
              Suggested Creators
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {suggestedUsers.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  All suggested creators followed.
                </p>
              ) : (
                suggestedUsers.map((creator) => (
                  <div
                    key={creator._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <Link
                      to={`/profile/${creator._id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flex: 1,
                        minWidth: 0,
                        textDecoration: 'none'
                      }}
                    >
                      <img
                        src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                        alt={creator.name}
                        className="avatar"
                        style={{ width: '34px', height: '34px' }}
                      />
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                          }}
                        >
                          {creator.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          @{creator.username}
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleFollowUser(creator._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      <UserPlus size={13} />
                      <span>Follow</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
