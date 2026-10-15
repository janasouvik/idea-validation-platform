import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          {/* Column 1: Brand & Academic Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                ProblemPulse
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              An academic problem-discovery initiative created to uncover genuine, recurring challenges faced by real people before building technology solutions.
            </p>
            <div style={{ display: 'inline-block', fontSize: '0.8rem', background: 'var(--bg-surface-muted)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-body)' }}>
              🎓 4th Year BTech Computer Science Major Project
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/problems" style={{ color: 'var(--text-body)' }}>All Reported Problems</Link>
              </li>
              <li>
                <Link to="/submit" style={{ color: 'var(--text-body)' }}>Share Your Experience</Link>
              </li>
              <li>
                <Link to="/roadmap" style={{ color: 'var(--text-body)' }}>Research Roadmap</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-body)' }}>Why We Are Doing This</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Ethics */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Trust & Transparency
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/privacy" style={{ color: 'var(--text-body)' }}>Privacy Policy & Consent</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-body)' }}>Contact the Researcher</Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-body)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Admin Portal <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Guiding Principle */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Our Core Pledge
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
              &ldquo;We will not invent user counts, fake testimonials, or claim problems are solved when they are still in discovery. Problem first, solution second.&rdquo;
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            © {new Date().getFullYear()} ProblemPulse. Designed & built for authentic problem validation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for real-world impact
          </div>
        </div>
      </div>
    </footer>
  );
};
