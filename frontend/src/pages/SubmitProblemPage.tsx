import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  Lock,
} from 'lucide-react';
import { Category, Frequency, Impact, Willingness } from '../types';
import { fetchCategories, submitProblem } from '../services/api';

export const SubmitProblemPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('WEEKLY');
  const [impact, setImpact] = useState<Impact>('TIME_WASTED');
  const [impactDetails, setImpactDetails] = useState('');
  const [currentWorkaround, setCurrentWorkaround] = useState('');
  const [missingFromSolutions, setMissingFromSolutions] = useState('');
  const [willingnessToTest, setWillingnessToTest] = useState<Willingness>('YES');
  const [broadLocation, setBroadLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [followUpConsent, setFollowUpConsent] = useState(false);
  const [publicDisplayConsent, setPublicDisplayConsent] = useState(true);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        setCategories(res.data || []);
        if (res.data?.length > 0) {
          setCategoryId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (title.trim().length < 5) {
      setErrorMessage('Please enter a descriptive title of at least 5 characters.');
      return;
    }
    if (description.trim().length < 20) {
      setErrorMessage('Please describe the problem in at least 20 characters so researchers can understand it.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please choose a relevant category.');
      return;
    }
    if (targetAudience.trim().length < 2) {
      setErrorMessage('Please specify who experiences this problem.');
      return;
    }
    if (currentWorkaround.trim().length < 5) {
      setErrorMessage('Please describe how this is currently handled or if there is no workable solution.');
      return;
    }

    try {
      setSubmitting(true);
      await submitProblem({
        title,
        description,
        categoryId,
        targetAudience,
        frequency,
        impact,
        impactDetails: impactDetails.trim() || undefined,
        currentWorkaround,
        missingFromSolutions: missingFromSolutions.trim() || undefined,
        willingnessToTest,
        broadLocation: broadLocation.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        followUpConsent,
        publicDisplayConsent,
      });

      setSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit problem. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (submittedSuccess) {
    return (
      <div className="container container-narrow animate-fade-in" style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            background: 'var(--success-bg)',
            color: 'var(--success-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid var(--success-border)',
          }}
        >
          <CheckCircle size={32} />
        </div>

        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
          Thank you for sharing your experience
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Your problem has been recorded in our research database. Your experience may help us understand challenges that deserve better solutions.
        </p>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            textAlign: 'left',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>Next steps for this submission</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-body)' }}>
            <li>• Our research team will review the submission to group it with similar pain points.</li>
            <li>• If you agreed to public display, it will be listed in the problem directory after moderation.</li>
            <li>• If you provided an email, we may invite you for a short research chat as validation progresses.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/problems" className="btn btn-primary btn-lg">
            <span>Explore Other Problems</span>
            <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setImpactDetails('');
              setCurrentWorkaround('');
              setMissingFromSolutions('');
              setBroadLocation('');
              setContactEmail('');
              setSubmittedSuccess(false);
            }}
            className="btn btn-secondary btn-lg"
          >
            Submit Another Problem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container container-narrow animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Header */}
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
          Authentic Problem Discovery
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          What problem do you wish someone would solve?
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Tell us about something frustrating, expensive, time-consuming, difficult, or unnecessarily complicated in your daily life.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.95rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-md)' }}>
        {/* 1. Problem Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            <span>1. Problem Title <span style={{ color: '#ef4444' }}>*</span></span>
            <span className="form-hint">{title.length}/150</span>
          </label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="e.g. Finding affordable student accommodation without broker extortion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />
          <span className="form-hint">A concise summary of the core frustration.</span>
        </div>

        {/* 2. Problem Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            <span>2. Detailed Problem Description <span style={{ color: '#ef4444' }}>*</span></span>
            <span className="form-hint">{description.length}/3000</span>
          </label>
          <textarea
            id="description"
            className="form-control"
            style={{ minHeight: 130 }}
            placeholder="Describe what happens, when it happens, and what makes it frustrating. Real personal experiences are much more helpful than abstract theories."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={3000}
            required
          />
        </div>

        {/* 3. Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            <span>3. Domain / Category <span style={{ color: '#ef4444' }}>*</span></span>
          </label>
          {loadingCategories ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Loading categories...</div>
          ) : (
            <select
              id="category"
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 4. Who experiences this problem? */}
        <div className="form-group">
          <label className="form-label" htmlFor="targetAudience">
            <span>4. Who experiences this problem? <span style={{ color: '#ef4444' }}>*</span></span>
          </label>
          <input
            id="targetAudience"
            type="text"
            className="form-control"
            placeholder="e.g. Outstation college students, junior software developers, local bakery owners"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            maxLength={150}
            required
          />
        </div>

        {/* 5. Frequency & Impact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="frequency">
              <span>5. Frequency <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <select
              id="frequency"
              className="form-control"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="OCCASIONALLY">Occasionally</option>
              <option value="RARELY">Rarely</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="impact">
              <span>6. Primary Impact <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <select
              id="impact"
              className="form-control"
              value={impact}
              onChange={(e) => setImpact(e.target.value as Impact)}
            >
              <option value="TIME_WASTED">Time Wasted</option>
              <option value="MONEY_LOST">Money Lost</option>
              <option value="UNNECESSARY_EFFORT">Unnecessary Effort</option>
              <option value="STRESS">Mental Stress &amp; Anxiety</option>
              <option value="MISSED_OPPORTUNITIES">Missed Opportunities</option>
              <option value="OTHER">Other Burden</option>
            </select>
          </div>
        </div>

        {/* 7. Current Workaround */}
        <div className="form-group">
          <label className="form-label" htmlFor="workaround">
            <span>7. How do you currently deal with it? <span style={{ color: '#ef4444' }}>*</span></span>
          </label>
          <textarea
            id="workaround"
            className="form-control"
            style={{ minHeight: 90 }}
            placeholder="e.g. Messy WhatsApp groups, manual Excel sheets, asking friends, or just tolerating the hassle..."
            value={currentWorkaround}
            onChange={(e) => setCurrentWorkaround(e.target.value)}
            maxLength={2000}
            required
          />
        </div>

        {/* 8. What is missing from current solutions? (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="missing">
            <span>8. What is missing from current solutions? (Optional)</span>
          </label>
          <textarea
            id="missing"
            className="form-control"
            style={{ minHeight: 80 }}
            placeholder="e.g. Existing portals don't verify real reviews; everything feels biased towards the landlord..."
            value={missingFromSolutions}
            onChange={(e) => setMissingFromSolutions(e.target.value)}
            maxLength={2000}
          />
        </div>

        {/* 9. Willingness to test & Broad Location */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="willingness">
              <span>9. Would you test a solution?</span>
            </label>
            <select
              id="willingness"
              className="form-control"
              value={willingnessToTest}
              onChange={(e) => setWillingnessToTest(e.target.value as Willingness)}
            >
              <option value="YES">Yes, definitely</option>
              <option value="MAYBE">Maybe, depends on the approach</option>
              <option value="NO">Not currently</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              <span>10. Broad Location (Optional)</span>
            </label>
            <input
              id="location"
              type="text"
              className="form-control"
              placeholder="e.g. Kolkata, Bengaluru, Pune"
              value={broadLocation}
              onChange={(e) => setBroadLocation(e.target.value)}
              maxLength={100}
            />
            <span className="form-hint">City or region only. No exact address needed.</span>
          </div>
        </div>

        {/* 11. Follow-up Contact Email (Optional & Private) */}
        <div className="form-group" style={{ background: 'var(--bg-surface-muted)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <label className="form-label" htmlFor="contactEmail">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} color="var(--primary)" />
              <span>11. Follow-up Email (Optional &amp; Strictly Private)</span>
            </span>
          </label>
          <input
            id="contactEmail"
            type="email"
            className="form-control"
            placeholder="your.email@example.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <span className="form-hint" style={{ marginTop: '0.35rem', display: 'block' }}>
            We will never display your email publicly, send marketing spam, or share it with third parties.
          </span>
        </div>

        {/* 12. Consents */}
        <div style={{ margin: '1.5rem 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={followUpConsent}
              onChange={(e) => setFollowUpConsent(e.target.checked)}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              I agree to be contacted via email strictly for research interviews or prototype feedback regarding this problem.
            </span>
          </label>

          <label className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={publicDisplayConsent}
              onChange={(e) => setPublicDisplayConsent(e.target.checked)}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              I consent to displaying this problem narrative publicly in the ProblemPulse discovery directory so others can validate it (your email is never displayed).
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={submitting}
          style={{ width: '100%', gap: '0.6rem' }}
        >
          <Send size={18} />
          <span>{submitting ? 'Submitting for Research...' : 'Submit Real Problem'}</span>
        </button>
      </form>
    </div>
  );
};
