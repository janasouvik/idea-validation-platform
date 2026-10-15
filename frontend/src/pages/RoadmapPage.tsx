import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Listen',
      status: 'IN_PROGRESS',
      statusLabel: 'Currently Active',
      timeframe: 'Weeks 1 – 4',
      description:
        'Collect real-world problem submissions across student, professional, commuter, and local business communities. Launch public portal and gather primary friction points.',
      deliverables: [
        'Deploy ProblemPulse web platform',
        'Collect at least 50 authentic problem descriptions',
        'Gather volunteers for exploratory follow-up interviews',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Understand',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Weeks 5 – 6',
      description:
        'Cluster submissions by root cause. Conduct 15-minute informal interviews with willing respondents to uncover what really happens behind the reported pain point.',
      deliverables: [
        'Semantic grouping of recurring complaints',
        'Transcribe 10+ user discovery interviews',
        'Identify high-impact cohorts and environmental factors',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Research Existing Solutions',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Weeks 7 – 8',
      description:
        'Examine existing products, mobile apps, government schemes, and informal manual workarounds. Determine why current alternatives fail to satisfy users.',
      deliverables: [
        'Competitive and workaround analysis matrix',
        'Gap assessment: price, complexity, or lack of trust',
        'Formulate initial hypotheses on missing value',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'Validate Demand & Feasibility',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Weeks 9 – 10',
      description:
        'Score candidate problems against our 5-dimension rubric (Frequency, Severity, Unmet Demand, Technical Feasibility, and User Access). Build clickable wireframes or survey prompts.',
      deliverables: [
        'Run weighted priority score across top 5 candidate problems',
        'Test lightweight prototype concepts with volunteers',
        'Assess technical architecture and API requirements',
      ],
    },
    {
      phase: 'Phase 5',
      title: 'Choose Final BTech Major Problem',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Week 11',
      description:
        'Formally select ONE validated problem as the official 4th-year Computer Science major project, backed by user interview data and documented demand.',
      deliverables: [
        'Major project proposal defense with faculty committee',
        'Publish decision memo detailing why this problem was selected',
        'Establish target metrics for success',
      ],
    },
    {
      phase: 'Phase 6',
      title: 'Build the Solution',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Weeks 12 – 20',
      description:
        'Engineer a reliable, accessible, modern web/mobile solution specifically addressing the core pain point identified in Phase 5.',
      deliverables: [
        'Full-stack software architecture and database design',
        'Continuous integration, security rules, and clean code',
        'Production staging deployment',
      ],
    },
    {
      phase: 'Phase 7',
      title: 'Pilot Test & Measure Impact',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      timeframe: 'Weeks 21 – 24',
      description:
        'Release the working product to the original group of respondents who requested it. Measure whether it actually saves them time, money, or stress.',
      deliverables: [
        'Pilot rollout to 20+ real users who submitted feedback',
        'Measure reduction in friction / time saved',
        'Final engineering thesis defense and open-source release',
      ],
    },
  ];

  return (
    <div className="container container-narrow animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
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
          Research &amp; Engineering Plan
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>
          Our 7-Phase Validation Roadmap
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We hold ourselves to transparent academic rigor. Here is how we move from listening to real people all the way to a working final-year engineering capstone.
        </p>
      </div>

      {/* Timeline Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {phases.map((p, index) => {
          const isActive = p.status === 'IN_PROGRESS';
          return (
            <div
              key={p.phase}
              className="card"
              style={{
                padding: '2rem',
                borderLeft: isActive ? '4px solid var(--primary)' : '1px solid var(--border-light)',
                background: isActive ? 'var(--bg-surface)' : 'var(--bg-surface)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {p.phase}
                  </span>
                  <h3 style={{ fontSize: '1.25rem' }}>{p.title}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                    {p.timeframe}
                  </span>
                  <span className={`badge ${isActive ? 'badge-primary' : 'badge-neutral'}`}>
                    {isActive ? <Sparkles size={12} /> : <Clock size={12} />}
                    <span>{p.statusLabel}</span>
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.975rem', color: 'var(--text-body)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {p.description}
              </p>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Key Deliverables
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {p.deliverables.map((d, dIdx) => (
                    <li key={dIdx} style={{ fontSize: '0.875rem', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <CheckCircle2 size={14} color={isActive ? 'var(--primary)' : 'var(--text-dim)'} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roadmap Bottom Action */}
      <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          We are in <strong>Phase 1 (Listen)</strong> right now. Your submission directly shapes the direction.
        </p>
        <Link to="/submit" className="btn btn-primary btn-lg" style={{ gap: '0.45rem' }}>
          <span>Help us complete Phase 1</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
