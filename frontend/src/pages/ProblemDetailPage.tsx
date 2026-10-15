import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  FlaskConical,
  Flag,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  Briefcase,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { PublicProblem } from '../types';
import {
  fetchPublicProblemById,
  supportProblem,
  submitTestInterest,
  reportAbuse,
} from '../services/api';
import { CategoryIcon } from '../components/CategoryIcon';
import { ProblemCard } from '../components/ProblemCard';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [problem, setProblem] = useState<PublicProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Support State
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [supporting, setSupporting] = useState(false);

  // Test Interest Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testSuccess, setTestSuccess] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);

  // Copy Link State
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProblem() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPublicProblemById(id);
        setProblem(res.data);
        setSupportCount(res.data.supportCount);
      } catch (err: any) {
        setError(err.message || 'Problem submission not found');
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [id]);

  const handleSupport = async () => {
    if (!id || hasSupported || supporting) return;
    try {
      setSupporting(true);
      const res = await supportProblem(id);
      setSupportCount(res.supportCount);
      setHasSupported(true);
    } catch (err) {
      console.error('Support error:', err);
    } finally {
      setSupporting(false);
    }
  };

  const handleTestInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmittingTest(true);
      await submitTestInterest(id, {
        email: testEmail.trim() || undefined,
        roleOrBackground: testRole.trim() || undefined,
      });
      setTestSuccess(true);
      setTimeout(() => {
        setShowTestModal(false);
        setTestSuccess(false);
        setTestEmail('');
        setTestRole('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit interest');
    } finally {
      setSubmittingTest(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reportReason) return;
    try {
      setSubmittingReport(true);
      await reportAbuse(id, {
        reason: reportReason,
        details: reportDetails.trim() || undefined,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
        setReportDetails('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to report problem');
    } finally {
      setSubmittingReport(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading problem report details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="container container-narrow" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Problem Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {error || 'The requested problem is not public or does not exist.'}
        </p>
        <Link to="/problems" className="btn btn-primary">
          Back to All Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="container container-narrow animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Back Button */}
      <Link
        to="/problems"
        className="btn btn-subtle btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: '0.4rem', paddingLeft: 0 }}
      >
        <ArrowLeft size={16} />
        <span>Back to exploration</span>
      </Link>

      {/* Main Header Card */}
      <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            <CategoryIcon name={problem.category.icon} slug={problem.category.slug} size={18} />
            <span>{problem.category.name}</span>
          </div>
          <span className="badge badge-primary">{problem.researchStatus.replace('_', ' ')}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '2.15rem', marginBottom: '1.25rem', lineHeight: 1.25 }}>
          {problem.title}
        </h1>

        {/* Narrative Description */}
        <div
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-main)',
            lineHeight: 1.7,
            marginBottom: '1.75rem',
            whiteSpace: 'pre-line',
          }}
        >
          {problem.description}
        </div>

        {/* Key Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-surface-muted)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={12} /> Target Audience
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {problem.targetAudience}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} /> Frequency
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {problem.frequency}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={12} /> Primary Impact
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {problem.impact.replace('_', ' ')}
            </div>
          </div>

          {problem.broadLocation && (
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} /> Region
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {problem.broadLocation}
              </div>
            </div>
          )}
        </div>

        {/* Current Workaround */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Briefcase size={16} color="var(--primary)" />
            <span>How people currently deal with it</span>
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            {problem.currentWorkaround}
          </p>
        </div>

        {/* What is missing */}
        {problem.missingFromSolutions && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>What is missing from existing alternatives</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              {problem.missingFromSolutions}
            </p>
          </div>
        )}

        {/* Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          {/* Support Vote */}
          <button
            onClick={handleSupport}
            disabled={supporting || hasSupported}
            className={`btn ${hasSupported ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.5rem' }}
          >
            <ThumbsUp size={16} fill={hasSupported ? '#ffffff' : 'none'} />
            <span>{hasSupported ? 'Supported' : 'I experience this too'}</span>
            <span
              style={{
                background: hasSupported ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-active)',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
              }}
            >
              {supportCount}
            </span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Help Test Button */}
            <button
              onClick={() => setShowTestModal(true)}
              className="btn btn-outline btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <FlaskConical size={15} />
              <span>Help Test Solution</span>
            </button>

            {/* Copy Share Link */}
            <button onClick={copyUrl} className="btn btn-subtle btn-sm" title="Copy link to problem">
              <Share2 size={15} />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Abuse Report */}
            <button
              onClick={() => setShowReportModal(true)}
              className="btn btn-subtle btn-sm"
              title="Report inappropriate content"
              style={{ color: 'var(--text-dim)' }}
            >
              <Flag size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Problems in Category */}
      {problem.related && problem.related.length > 0 && (
        <div style={{ marginTop: '3.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
            Related problems in {problem.category.name}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {problem.related.map((rel) => (
              <div key={rel.id} className="card card-interactive" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                  <Link to={`/problems/${rel.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                    {rel.title}
                  </Link>
                </h4>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {rel.description}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {rel.supportCount} people experience this
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Help Test Solution */}
      {showTestModal && (
        <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Help Test a Potential Solution
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              If our fourth-year CS team builds a prototype or interviews users for this problem, would you like to be notified?
            </p>

            {testSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--success-text)' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600 }}>Thank you for volunteering!</p>
              </div>
            ) : (
              <form onSubmit={handleTestInterestSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="testEmail">
                    Your Email (Optional, strictly private)
                  </label>
                  <input
                    id="testEmail"
                    type="email"
                    className="form-control"
                    placeholder="student@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="testRole">
                    Your Role or Relevant Context (Optional)
                  </label>
                  <input
                    id="testRole"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 3rd year student in hostel, daily suburban commuter"
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTest}
                    className="btn btn-primary btn-sm"
                  >
                    {submittingTest ? 'Saving...' : 'Register Testing Interest'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Report Abuse */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Report Inappropriate Content
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Help keep our research platform authentic. Let us know if this entry contains spam, harassment, or sensitive personal data.
            </p>

            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--success-text)' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600 }}>Report submitted. Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reason">
                    Reason <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="reason"
                    className="form-control"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="SPAM_PROMOTION">Spam or commercial promotion</option>
                    <option value="PERSONAL_INFO">Exposes private or personal info</option>
                    <option value="INAPPROPRIATE">Harassment or abusive language</option>
                    <option value="NOT_A_PROBLEM">Not a problem report (e.g. gibberish)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="details">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    id="details"
                    className="form-control"
                    placeholder="Any context to help moderators review this..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    style={{ minHeight: 80 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport || !reportReason}
                    className="btn btn-danger btn-sm"
                  >
                    {submittingReport ? 'Reporting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
