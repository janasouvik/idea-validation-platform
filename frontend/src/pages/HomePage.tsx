import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlusCircle,
  Search,
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { Category, PublicProblem } from '../types';
import { fetchCategories, fetchPublicProblems } from '../services/api';
import { CategoryIcon } from '../components/CategoryIcon';
import { ProblemCard } from '../components/ProblemCard';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProblems, setFeaturedProblems] = useState<PublicProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, probRes] = await Promise.all([
          fetchCategories(),
          fetchPublicProblems({ limit: 3, sortBy: 'supporters' }),
        ]);
        setCategories(catRes.data || []);
        setFeaturedProblems(probRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      <section
        style={{
          padding: '5rem 0 4rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--hero-gradient)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: 880 }}>
          {/* Main Headline */}
          <h1 style={{ marginBottom: '1.5rem', lineHeight: 1.15 }}>
            The world has problems.{' '}
            <span style={{ color: 'var(--primary)', display: 'inline-block' }}>
              Let&apos;s find the ones worth solving.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-body)',
              lineHeight: 1.65,
              marginBottom: '2.25rem',
              maxWidth: 720,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Every meaningful solution starts with a problem someone actually faces. We are collecting real-world problems from people like you to understand what needs to change—and build something that makes a difference.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <Link to="/submit" className="btn btn-primary btn-lg">
              <PlusCircle size={18} />
              <span>Share a Problem</span>
            </Link>
            <Link to="/problems" className="btn btn-secondary btn-lg">
              <Search size={18} />
              <span>Explore Problems</span>
            </Link>
          </div>

          {/* Trust Statement */}
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            🔒 <strong>No perfect ideas needed.</strong> Just tell us about a real problem you&apos;ve experienced. No account required.
          </p>
        </div>
      </section>

      {/* 2. Why We Are Doing This */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--primary)',
                  marginBottom: '0.75rem',
                  display: 'block',
                }}
              >
                Our Philosophy
              </span>
              <h2 style={{ marginBottom: '1.25rem', lineHeight: 1.25 }}>
                Why build something nobody needs?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Too often, we start with an idea and then search for a problem it might solve. We want to do the opposite.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Uber and Swiggy are examples of businesses that built services around real customer needs. Their journeys remind us that understanding a problem is an important starting point for creating something useful.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, fontWeight: 500 }}>
                We want to listen first, research carefully, and build only after we understand the problem.
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="var(--primary)" />
                <span>Our Problem-First Principles</span>
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong>Evidence over popularity:</strong> We don&apos;t assume the most upvoted post is the most important. Severity and unmet need matter.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong>Human-centered research:</strong> We prioritize conversations with people who live with the problem daily.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong>Privacy by design:</strong> Your email and contact details remain private. We never share them publicly or sell them.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong>Honest reporting:</strong> No fake traction metrics, mock impact statistics, or invented user counts.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Want to Discover (Categories) */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary)',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Focus Domains
            </span>
            <h2 style={{ marginBottom: '1rem' }}>What we want to discover</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Real-world pain points happen across diverse contexts. Explore categories where recurring bottlenecks arise:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/problems?category=${cat.slug}`}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CategoryIcon name={cat.icon} slug={cat.slug} size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                    {cat.name}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                    {cat.description}
                  </p>
                  {typeof cat.approvedProblemCount === 'number' && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {cat.approvedProblemCount} verified {cat.approvedProblemCount === 1 ? 'problem' : 'problems'}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works (4 Steps) */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3.5rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary)',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Methodology
            </span>
            <h2 style={{ marginBottom: '1rem' }}>How it works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              We follow a disciplined four-step validation sequence to turn everyday friction into meaningful software.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'Share',
                desc: 'Tell us about a problem you personally experience. No technical solution or business plan required.',
                icon: PlusCircle,
              },
              {
                step: '02',
                title: 'Discover',
                desc: 'We analyze submissions for recurring patterns, shared root causes, and frequency across cohorts.',
                icon: Search,
              },
              {
                step: '03',
                title: 'Validate',
                desc: 'We research existing workarounds, evaluate why current tools fail, and interview affected users.',
                icon: FileCheck,
              },
              {
                step: '04',
                title: 'Build',
                desc: 'We select the most severe, verified problem and develop an open-source solution for our BTech project.',
                icon: Users,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.25rem',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--border-medium)',
                    lineHeight: 1,
                    opacity: 0.6,
                  }}
                >
                  {s.step}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-muted)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <s.icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '2.5rem',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-muted)',
              border: '1px solid var(--border-light)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            ⚠️ <em>Important clarification:</em> Submitting a problem does not guarantee that a solution will be built. Our goal is thorough research before engineering.
          </div>
        </div>
      </section>

      {/* 5. What Happens to Your Submission? */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary)',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Transparency
            </span>
            <h2>What happens to your submission?</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Grouping &amp; Pattern Identification</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Submissions are reviewed and clustered with similar issues reported by others to determine whether a challenge is isolated or widely experienced.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Consensual User Research</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  If you opt in and provide your email, we may reach out for a 15-minute informal conversation to understand the nuance of your frustration.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Public Discovery (With Your Permission)</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Only submissions with explicit consent are displayed on the public Explore page so other peers can say &ldquo;I experience this too&rdquo;. Your email address is never published.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                4
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Progress Publishing</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  As research advances through our academic roadmap, findings and candidate directions will be posted openly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured / Recent Submissions Preview */}
      {featuredProblems.length > 0 ? (
        <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
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
                  Community Voices
                </span>
                <h2>Recent problems shared</h2>
              </div>
              <Link to="/problems" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
                <span>View all verified problems</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 650 }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary)',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Real-Time Problem Feed
            </span>
            <h2 style={{ marginBottom: '0.85rem' }}>No problems submitted yet</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              ProblemPulse runs in 100% real time with zero mock data. Submissions appear here as soon as they are submitted and approved.
            </p>
            <Link to="/submit" className="btn btn-primary" style={{ gap: '0.45rem' }}>
              <PlusCircle size={18} />
              <span>Be the First to Share a Problem</span>
            </Link>
          </div>
        </section>
      )}

      {/* 7. Final Call to Action */}
      <section style={{ padding: '5.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            You don&apos;t need to have the solution.{' '}
            <span style={{ color: 'var(--primary)', display: 'block' }}>
              Just tell us the problem.
            </span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Take 2 minutes to describe a pain point you encounter in campus life, your job, commuting, or daily routines. Help us pick a challenge that truly matters.
          </p>
          <Link to="/submit" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
            <PlusCircle size={20} />
            <span>Share Your Problem</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
