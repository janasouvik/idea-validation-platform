import React from 'react';
import { ShieldCheck, Lock, Eye, Trash2, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
          Privacy &amp; Data Ethics
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Last updated: October 2026. How we protect your data across the ProblemPulse research platform.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--primary)" />
            <span>1. What Data We Collect</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            When you submit a problem report, we collect:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            <li>The problem narrative, category, target audience, frequency, and impact description.</li>
            <li>Broad location (e.g. city or state, optional). We never ask for street addresses or GPS coordinates.</li>
            <li>Your contact email (optional). This is stored strictly in protected database tables and is never published or exposed through public APIs.</li>
            <li>Hashed anonymous tokens (SHA-256) for abuse prevention and duplicate vote tracking. We do not store raw IP logs.</li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="var(--primary)" />
            <span>2. Public vs. Private Information</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            Only submissions with explicit consent (&ldquo;Public display consent&rdquo;) and approved through moderator review are shown in the public directory. Your personal email address, internal researcher notes, and IP hashes are <strong>never</strong> returned by public endpoints.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>3. How We Use Contact Details</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            If you provide your email and tick the follow-up consent checkbox, the academic project team may contact you to ask follow-up questions or offer early access to validation prototypes. We never send advertising, promotional campaigns, or third-party marketing.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trash2 size={18} color="var(--primary)" />
            <span>4. Right to Deletion &amp; Correction</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            If you wish to edit, unpublish, or permanently delete any problem submission you previously sent, contact the project researcher at{' '}
            <a href="mailto:admin@problempulse.org" style={{ fontWeight: 600 }}>admin@problempulse.org</a> with your submission title or email. We will purge the record within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
