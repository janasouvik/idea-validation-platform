import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2, User } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container container-narrow animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--primary)',
            marginBottom: '0.4rem',
            display: 'block',
          }}
        >
          Get in Touch
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>
          Contact the Researcher
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Have a question about the project, want to suggest an interview participant, or request a submission correction?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" />
            <span>Academic Project Details</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            <strong>Project:</strong> ProblemPulse — Problem Discovery Initiative
            <br />
            <strong>Institution:</strong> 4th-Year BTech Computer Science &amp; Engineering
            <br />
            <strong>Primary Contact:</strong>{' '}
            <a href="mailto:admin@problempulse.org">admin@problempulse.org</a>
          </p>

          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-surface-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            We usually respond to research inquiries and submission deletion requests within 24 to 48 hours.
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Send a Message</h3>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--success-text)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Message Received</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                Thank you, {name}. We will get back to you at {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contactName">Your Name</label>
                <input
                  id="contactName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Souvik or Anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactUserEmail">Email Address</label>
                <input
                  id="contactUserEmail"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactMsg">Message / Inquiry</label>
                <textarea
                  id="contactMsg"
                  className="form-control"
                  style={{ minHeight: 100 }}
                  placeholder="How can we help or collaborate?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
