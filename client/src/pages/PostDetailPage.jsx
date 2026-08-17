import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
        <p>Loading post discussion...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '500px', margin: '40px auto' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Post Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
          This post does not exist or has been removed.
        </p>
        <Link to="/" className="btn btn-primary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <Link
        to="/"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '16px', display: 'inline-flex' }}
      >
        <ArrowLeft size={15} />
        <span>Back to Feed</span>
      </Link>
      <PostCard post={post} />
    </div>
  );
}
