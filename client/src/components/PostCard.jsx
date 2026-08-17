import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Share2, Trash2, Send, CheckCircle2, Bookmark, Maximize2, X, MoreHorizontal } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSecs = Math.floor((now - date) / 1000);

  if (diffInSecs < 60) return 'Just now';
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

export default function PostCard({ post, onDeletePost }) {
  const { user } = useAuth();

  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(
    user ? (post.likes || []).some((id) => String(id) === String(user._id)) : false
  );
  const [isBookmarked, setIsBookmarked] = useState(
    user ? (post.bookmarks || []).some((id) => String(id) === String(user._id)) : false
  );
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const [showLightbox, setShowLightbox] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleToggleLike = async () => {
    if (!user) {
      alert('Please log in to like posts.');
      return;
    }

    // Optimistic UI update
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikes((prev) =>
      nextIsLiked ? [...prev, user._id] : prev.filter((id) => String(id) !== String(user._id))
    );

    try {
      const { data } = await API.post(`/posts/${post._id}/like`);
      setLikes(data.likes || []);
      setIsLiked(data.isLiked);
    } catch (error) {
      // Rollback on error
      setIsLiked(!nextIsLiked);
      setLikes(post.likes || []);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      alert('Please log in to save posts.');
      return;
    }
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    try {
      const { data } = await API.post(`/posts/${post._id}/bookmark`);
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      // Local fallback
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      alert('Please log in to comment.');
      return;
    }

    setCommenting(true);
    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setComments((prev) => [...prev, data]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const handleSharePost = () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const author = post.author || {
    name: 'User',
    username: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  };

  const renderContentWithTags = (content) => {
    if (!content) return null;
    const tokens = content.split(/(\s+)/);
    return tokens.map((token, idx) => {
      if (token.startsWith('#') && token.length > 1) {
        return (
          <span key={idx} className="badge badge-primary" style={{ margin: '0 2px' }}>
            {token}
          </span>
        );
      }
      return token;
    });
  };

  return (
    <>
      <article className="card" style={{ padding: '20px', marginBottom: '16px', position: 'relative' }}>
        {/* Share Toast Notification */}
        {shareToast && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'var(--accent-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10
            }}
          >
            Post link copied to clipboard
          </div>
        )}

        {/* Post Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <Link
            to={`/profile/${author._id || author.username}`}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <img
              src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={author.name}
              className="avatar"
              style={{ width: '42px', height: '42px' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {author.name}
                </span>
                <CheckCircle2 size={14} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                @{author.username} &bull; {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={handleToggleBookmark}
              className="btn btn-ghost btn-icon btn-sm"
              title={isBookmarked ? 'Saved' : 'Save post'}
              style={{ color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            {user && String(author._id) === String(user._id) && (
              <button
                onClick={() => {
                  if (window.confirm('Delete this post permanently?')) {
                    onDeletePost && onDeletePost(post._id);
                  }
                }}
                className="btn btn-ghost btn-icon btn-sm"
                title="Delete post"
                style={{ color: 'var(--text-muted)' }}
              >
                <Trash2 size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Post Content */}
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            marginBottom: '14px',
            whiteSpace: 'pre-line'
          }}
        >
          {renderContentWithTags(post.content)}
        </p>

        {/* Image Attachment */}
        {post.image && (
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '14px',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
            onClick={() => setShowLightbox(true)}
          >
            <img
              src={post.image}
              alt="Post media attachment"
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Maximize2 size={12} /> View Fullscreen
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={handleToggleLike}
            className="btn btn-ghost btn-sm"
            style={{
              color: isLiked ? 'var(--status-danger)' : 'var(--text-secondary)'
            }}
          >
            <Heart size={16} fill={isLiked ? 'var(--status-danger)' : 'none'} />
            <span>{likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <MessageSquare size={16} />
            <span>{comments.length}</span>
          </button>

          <button
            onClick={handleSharePost}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--text-secondary)', marginLeft: 'auto' }}
            title="Share post"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Write a comment..."
                className="form-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ fontSize: '0.88rem', padding: '8px 12px' }}
              />
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 14px' }}
              >
                <Send size={14} />
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {comments.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
                  No comments yet. Start the conversation.
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <div
                    key={comment._id || idx}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <img
                        src={
                          comment.author?.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                        }
                        alt="Comment author avatar"
                        className="avatar"
                        style={{ width: '22px', height: '22px' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {comment.author?.name || 'User'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        @{comment.author?.username || 'user'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '30px' }}>
                      {comment.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="modal-backdrop" onClick={() => setShowLightbox(false)}>
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: '10px' }}
            >
              <X size={16} /> Close
            </button>
            <img
              src={post.image}
              alt="Fullscreen Media View"
              style={{
                maxWidth: '90vw',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
