import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 16px',
        marginTop: 'auto',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          CodeAlpha Full Stack Web Development Internship &mdash; Social Media Platform
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Built with React, Express, MongoDB, Node.js &bull; Developed by <strong style={{ color: 'var(--text-primary)' }}>Rahul Bariki</strong> (CA/DF1/245571)
        </p>
      </div>
    </footer>
  );
}
