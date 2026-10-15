import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';
import { PublicProblem } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { supportProblem } from '../services/api';

interface ProblemCardProps {
  problem: PublicProblem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const [supportCount, setSupportCount] = useState(problem.supportCount);
  const [hasSupported, setHasSupported] = useState(false);
  const [supporting, setSupporting] = useState(false);

  const handleSupport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSupported || supporting) return;

    try {
      setSupporting(true);
      const res = await supportProblem(problem.id);
      setSupportCount(res.supportCount);
      setHasSupported(true);
    } catch (err: any) {
      console.error('Support error:', err);
    } finally {
      setSupporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDATING':
        return <span className="badge badge-success">Active Validation</span>;
      case 'RESEARCHING':
        return <span className="badge badge-primary">In Research</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-warning">Under Review</span>;
      case 'SELECTED':
        return <span className="badge badge-success">Selected for Build</span>;
      default:
        return <span className="badge badge-neutral">Discovery</span>;
    }
  };

  const formatImpact = (impact: string) => {
    return impact.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Category & Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 600 }}>
          <CategoryIcon name={problem.category.icon} slug={problem.category.slug} size={15} />
          <span>{problem.category.name}</span>
        </div>
        {getStatusBadge(problem.researchStatus)}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem', lineHeight: 1.35 }}>
        <Link to={`/problems/${problem.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
          {problem.title}
        </Link>
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-body)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
        }}
      >
        {problem.description}
      </p>

      {/* Key Metadata Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span
          style={{
            fontSize: '0.775rem',
            background: 'var(--bg-surface-muted)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Users size={12} /> {problem.targetAudience}
        </span>
        <span
          style={{
            fontSize: '0.775rem',
            background: 'var(--bg-surface-muted)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <AlertCircle size={12} /> {formatImpact(problem.impact)}
        </span>
        {problem.broadLocation && (
          <span
            style={{
              fontSize: '0.775rem',
              background: 'var(--bg-surface-muted)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <MapPin size={12} /> {problem.broadLocation}
          </span>
        )}
      </div>

      {/* Card Footer with Support Button & Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-light)',
          marginTop: 'auto',
        }}
      >
        <button
          onClick={handleSupport}
          disabled={supporting || hasSupported}
          className={`btn btn-sm ${hasSupported ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
          title="I experience this problem too"
        >
          <ThumbsUp size={14} fill={hasSupported ? '#ffffff' : 'none'} />
          <span>{hasSupported ? 'Supported' : 'Experience this'}</span>
          <span
            style={{
              background: hasSupported ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-active)',
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              marginLeft: '0.2rem',
            }}
          >
            {supportCount}
          </span>
        </button>

        <span style={{ fontSize: '0.775rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} />
          {new Date(problem.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};
