import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Compass, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
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
          About The Initiative
        </span>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          What if we listened before deciding what to build?
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
          ProblemPulse is an early-stage problem-discovery initiative created to understand real-world challenges, learn from the people experiencing them, and identify opportunities for meaningful solutions.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', background: 'var(--bg-surface)' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          The Origin: 4th-Year BTech Major Project
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Every engineering student faces the fourth-year capstone question: <em>&ldquo;What should I build for my final year major project?&rdquo;</em>
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Most of the time, students pick a trendy buzzword—AI, blockchain, or another generic clone—and build something in isolation that nobody will ever touch after graduation.
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
          <strong>ProblemPulse is our effort to break that cycle.</strong> Before writing a single line of project code, we want to talk to students, professionals, local business owners, and commuters. We want to discover where people genuinely lose time, money, or peace of mind.
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Our Guiding Principles</h2>
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="var(--primary)" />
              <span>1. Problem-First Mindset</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Companies like Uber and Swiggy didn&apos;t succeed because of fancy algorithms alone—they addressed concrete transportation bottlenecks and everyday food delivery hurdles. Solutions only create value when they resolve authentic pain points.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span>2. Evidence Over Popularity</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              A problem that is upvoted by 100 people casually browsing social media might be a minor annoyance. A problem experienced by 10 people who lose ₹10,000 every month is a severe challenge. We weigh severity and willingness to adopt solutions above simple virality.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HeartHandshake size={20} color="var(--primary)" />
              <span>3. Honest Communication &amp; Privacy</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              We will never invent user statistics, pretend our initiative has thousands of active enterprises, or claim we have solved problems before we have actually validated them. And your private contact info is never shared or published.
            </p>
          </div>
        </div>
      </div>

      {/* What we can and cannot promise */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem', background: 'var(--bg-surface-muted)' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          What We Can and Cannot Promise
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--success-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} /> What we promise:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem', color: 'var(--text-body)' }}>
              <li>• We will read and classify every legitimate submission.</li>
              <li>• We will protect your email and keep follow-up consensual.</li>
              <li>• We will share research progress publicly on our roadmap.</li>
              <li>• We will build an open-source solution for the chosen problem.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--danger-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              ⚠️ What we cannot promise:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem', color: 'var(--text-body)' }}>
              <li>• We cannot guarantee that every submitted problem will be built.</li>
              <li>• We cannot provide personal customer support for existing software tools.</li>
              <li>• We cannot accept commercial advertising or promotional submissions.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/submit" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
          <span>Contribute a Problem</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
