import React, { useState } from 'react';
import { X, Image as ImageIcon, Hash, Sparkles, Send } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_TOPICS = ['FullStack', 'React', 'NodeJS', 'WebDevelopment', 'DesignSystems', 'Database'];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddTopic = (topic) => {
    const tag = `#${topic}`;
    if (!content.includes(tag)) {
      setContent((prev) => (prev ? `${prev.trim()} ${tag}` : tag));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Post content cannot be empty.');
      return;
    }
    setErrorMsg('');

    setSubmitting(true);
    try {
      const { data } = await API.post('/posts', { content, image });
      if (onPostCreated) onPostCreated(data);
      setContent('');
      setImage('');
      setShowImageInput(false);
      onClose();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to publish post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Create New Post
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
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
              marginBottom: '16px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* User preview */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{user.username}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <textarea
              required
              rows={5}
              maxLength={500}
              placeholder="What are you working on or thinking about?"
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: '120px', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {content.length}/500
              </span>
            </div>
          </div>

          {/* Quick topic tags */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
              Add Topic Tag:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTED_TOPICS.map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => handleAddTopic(topic)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    padding: '3px 8px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <Hash size={12} strokeWidth={2} />
                  <span>{topic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle image input */}
          {!showImageInput && !image && (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              <ImageIcon size={15} />
              <span>Attach Image URL</span>
            </button>
          )}

          {(showImageInput || image) && (
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                <span>Image Attachment URL</span>
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    setShowImageInput(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0 4px', fontSize: '0.75rem', height: 'auto' }}
                >
                  Remove
                </button>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              {image && (
                <div
                  style={{
                    marginTop: '8px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    maxHeight: '160px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={image}
                    alt="Post Preview"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn btn-primary"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
