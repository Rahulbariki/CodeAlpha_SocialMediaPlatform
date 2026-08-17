import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AtSign, Image as ImageIcon, Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const res = await register(name, username, email, password, bio, avatar);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="card" style={{ padding: '32px 28px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '14px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Create an Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Join the community to publish posts, follow creators, and interact.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--status-danger)',
              fontSize: '0.88rem',
              fontWeight: 500,
              marginBottom: '20px'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <User
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  style={{ paddingLeft: '36px' }}
                />
                <AtSign
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
              />
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio (Optional)</label>
            <input
              type="text"
              placeholder="Software Engineer & Web Developer"
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <ImageIcon
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 16px', fontSize: '0.95rem', marginTop: '6px' }}
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)'
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
