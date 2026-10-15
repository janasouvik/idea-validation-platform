import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { adminLogin } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await adminLogin({ email, password });
      navigate('/admin');
    } catch (err: any) {
      const msg = err.message === 'Failed to fetch'
        ? 'Cannot reach backend server. Please ensure the backend is running on port 5001 (npm run dev in backend).'
        : (err.message || 'Login failed. Please check credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@problempulse.org');
    setPassword('AdminSecure2026!');
  };

  return (
    <div className="container container-narrow animate-fade-in" style={{ padding: '5rem 1.5rem', maxWidth: 460 }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <Activity size={24} />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Researcher Portal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Sign in to review submissions, manage validation status, and score problem priorities.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="adminEmail">
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="adminEmail"
                type="email"
                className="form-control"
                placeholder="admin@problempulse.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="adminPassword">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="adminPassword"
                type="password"
                className="form-control"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', gap: '0.5rem', padding: '0.75rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign in to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Local development credentials initialized in PostgreSQL:
          </p>
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="btn btn-subtle btn-sm"
            style={{ fontSize: '0.8rem', border: '1px dashed var(--border-medium)' }}
          >
            Auto-fill Default Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
