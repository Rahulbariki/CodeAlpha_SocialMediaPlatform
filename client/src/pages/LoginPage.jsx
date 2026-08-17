import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Activity, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '420px', margin: '48px auto' }}>
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
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Enter your credentials to access your account.
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
                style={{ paddingLeft: '38px' }}
              />
              <Mail
                size={16}
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
                placeholder="Enter password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', paddingRight: '38px' }}
              />
              <Lock
                size={16}
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px 16px', fontSize: '0.95rem', marginTop: '6px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
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
          Do not have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
