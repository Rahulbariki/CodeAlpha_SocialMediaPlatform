import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Plus, LogOut, Compass, Home, User, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenCreateModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFeedActive = location.pathname === '/' && !location.search.includes('tab=explore');
  const isExploreActive = location.search.includes('tab=explore');

  return (
    <header
      style={{
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}
          >
            Alpha<span style={{ color: 'var(--accent-primary)' }}>Pulse</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link
            to="/"
            className={`btn ${isFeedActive ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
            style={{
              borderColor: isFeedActive ? 'var(--accent-primary)' : 'transparent',
              color: isFeedActive ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <Home size={16} strokeWidth={2} />
            <span>Feed</span>
          </Link>

          <Link
            to="/?tab=explore"
            className={`btn ${isExploreActive ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
            style={{
              borderColor: isExploreActive ? 'var(--accent-primary)' : 'transparent',
              color: isExploreActive ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <Compass size={16} strokeWidth={2} />
            <span>Explore</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <button
                onClick={onOpenCreateModal}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Create Post</span>
              </button>

              <Link
                to={`/profile/${user._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                title="View Profile"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="avatar"
                  style={{ width: '34px', height: '34px' }}
                />
              </Link>

              <button
                onClick={logout}
                className="btn btn-ghost btn-icon btn-sm"
                title="Log Out"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={16} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
