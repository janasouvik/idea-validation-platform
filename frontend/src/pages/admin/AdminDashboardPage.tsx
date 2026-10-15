import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Lock,
  MessageSquare,
  History,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sliders,
  X,
  Plus,
  RefreshCw,
  Award,
} from 'lucide-react';
import { AdminProblem, DashboardStats, ModerationStatus, ResearchStatus } from '../../types';
import {
  getAuthToken,
  clearAuthToken,
  fetchAdminDashboard,
  fetchAdminProblems,
  fetchAdminProblemById,
  updateModerationStatus,
  updateResearchStatus,
  updateRubricScore,
  addResearchNote,
  deleteProblem,
  API_BASE,
} from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [moderationFilter, setModerationFilter] = useState('ALL');
  const [researchFilter, setResearchFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');

  // Selected Problem Drawer
  const [selectedProblem, setSelectedProblem] = useState<AdminProblem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Rubric Scoring State
  const [scoreFreq, setScoreFreq] = useState(3);
  const [scoreSev, setScoreSev] = useState(3);
  const [scoreUnmet, setScoreUnmet] = useState(3);
  const [scoreFeas, setScoreFeas] = useState(3);
  const [scoreAccess, setScoreAccess] = useState(3);
  const [savingScore, setSavingScore] = useState(false);

  // Notes State
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Status transition note
  const [statusTransitionNote, setStatusTransitionNote] = useState('');

  const loadDashboardData = async () => {
    try {
      const [statsRes, problemsRes] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminProblems({
          search: search.trim() || undefined,
          moderationStatus: moderationFilter !== 'ALL' ? moderationFilter : undefined,
          researchStatus: researchFilter !== 'ALL' ? researchFilter : undefined,
          sortBy,
          limit: 50,
        }),
      ]);

      setStats(statsRes.data);
      setProblems(problemsRes.data || []);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
        clearAuthToken();
        navigate('/admin/login');
      } else {
        console.error('Error loading dashboard data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [moderationFilter, researchFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDashboardData();
  };

  const handleSelectProblem = async (prob: AdminProblem) => {
    setLoadingDetail(true);
    try {
      const res = await fetchAdminProblemById(prob.id);
      setSelectedProblem(res.data);

      // Initialize rubric sliders
      setScoreFreq(res.data.scoreFrequency || 3);
      setScoreSev(res.data.scoreSeverity || 3);
      setScoreUnmet(res.data.scoreUnmetDemand || 3);
      setScoreFeas(res.data.scoreFeasibility || 3);
      setScoreAccess(res.data.scoreUserAccess || 3);
    } catch (err) {
      console.error('Error fetching problem details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleModerationChange = async (status: ModerationStatus) => {
    if (!selectedProblem) return;
    try {
      await updateModerationStatus(selectedProblem.id, status);
      setSelectedProblem({ ...selectedProblem, moderationStatus: status });
      loadDashboardData();
    } catch (err) {
      alert('Failed to update moderation status');
    }
  };

  const handleResearchStatusChange = async (status: ResearchStatus) => {
    if (!selectedProblem) return;
    try {
      await updateResearchStatus(selectedProblem.id, status, statusTransitionNote || undefined);
      setStatusTransitionNote('');
      const refreshed = await fetchAdminProblemById(selectedProblem.id);
      setSelectedProblem(refreshed.data);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update research status');
    }
  };

  const handleSaveRubric = async () => {
    if (!selectedProblem) return;
    try {
      setSavingScore(true);
      const res = await updateRubricScore(selectedProblem.id, {
        scoreFrequency: scoreFreq,
        scoreSeverity: scoreSev,
        scoreUnmetDemand: scoreUnmet,
        scoreFeasibility: scoreFeas,
        scoreUserAccess: scoreAccess,
      });
      setSelectedProblem({ ...selectedProblem, priorityScore: res.data.priorityScore });
      loadDashboardData();
    } catch (err) {
      alert('Failed to save score');
    } finally {
      setSavingScore(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem || !newNote.trim()) return;
    try {
      setSavingNote(true);
      await addResearchNote(selectedProblem.id, newNote);
      setNewNote('');
      const refreshed = await fetchAdminProblemById(selectedProblem.id);
      setSelectedProblem(refreshed.data);
    } catch (err) {
      alert('Failed to add research note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteProblem = async () => {
    if (!selectedProblem) return;
    if (!window.confirm('Are you sure you want to permanently delete this submission? This cannot be undone.')) {
      return;
    }
    try {
      await deleteProblem(selectedProblem.id);
      setSelectedProblem(null);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete problem');
    }
  };

  const handleExportCsv = () => {
    const token = getAuthToken();
    fetch(`${API_BASE}/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `problempulse_research_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert('CSV Export failed'));
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  // Live Rubric Calculation
  const currentCalculatedScore =
    scoreFreq * 5 + scoreSev * 5 + scoreUnmet * 4 + scoreFeas * 3 + scoreAccess * 3;

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
            Research Operations
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.2rem' }}>
            Validation &amp; Research Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={handleExportCsv} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Submissions</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {stats.totalSubmissions}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '1.25rem',
              borderColor: stats.pendingCount > 0 ? 'var(--warning-border)' : 'var(--border-light)',
              background: stats.pendingCount > 0 ? 'var(--warning-bg)' : 'var(--bg-surface)',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: stats.pendingCount > 0 ? 'var(--warning-text)' : 'var(--text-muted)', fontWeight: 600 }}>
              Pending Moderation
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: stats.pendingCount > 0 ? 'var(--warning-text)' : 'var(--text-main)', marginTop: '0.25rem' }}>
              {stats.pendingCount}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Public Approved</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.25rem' }}>
              {stats.approvedCount}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Validating</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              {stats.researchBreakdown.VALIDATING || 0}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Testing Volunteers</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {stats.totalVolunteers}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 240px', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, description, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">Filter</button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            value={moderationFilter}
            onChange={(e) => setModerationFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Moderation</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved Public</option>
            <option value="REJECTED">Rejected</option>
            <option value="SPAM">Marked Spam</option>
          </select>

          <select
            className="form-control"
            value={researchFilter}
            onChange={(e) => setResearchFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Research Phases</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESEARCHING">Researching</option>
            <option value="VALIDATING">Validating</option>
            <option value="SELECTED">Selected</option>
            <option value="NOT_SELECTED">Not Selected</option>
          </select>

          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="createdAt">Newest First</option>
            <option value="priorityScore">Highest Priority Score</option>
            <option value="supportCount">Most Supported</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-muted)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Problem Title &amp; Domain</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Contact Email (Private)</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Moderation</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Research Phase</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Priority Score</th>
              <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading database submissions...
                </td>
              </tr>
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No submissions found matching criteria.
                </td>
              </tr>
            ) : (
              problems.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    background: selectedProblem?.id === p.id ? 'var(--primary-subtle)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectProblem(p)}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.category.name} • {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    {p.contactEmail ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
                        <Lock size={12} color="var(--primary)" />
                        {p.contactEmail}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Anonymous</span>
                    )}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`badge ${
                        p.moderationStatus === 'APPROVED'
                          ? 'badge-success'
                          : p.moderationStatus === 'PENDING'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {p.moderationStatus}
                    </span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-neutral">
                      {p.researchStatus.replace('_', ' ')}
                    </span>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    {p.priorityScore ? (
                      <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Award size={14} />
                        {p.priorityScore}/100
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Unscored</span>
                    )}
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProblem(p);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Review</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Drawer / Modal */}
      {selectedProblem && (
        <div className="modal-overlay" onClick={() => setSelectedProblem(null)}>
          <div
            className="modal-content animate-fade-in"
            style={{ maxWidth: 760, padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                  {selectedProblem.category.name}
                </span>
                <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>{selectedProblem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="btn btn-subtle btn-sm"
                style={{ padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Private Contact Box */}
            <div
              style={{
                background: 'var(--bg-surface-muted)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <strong>Contact Email:</strong>{' '}
                {selectedProblem.contactEmail ? (
                  <a href={`mailto:${selectedProblem.contactEmail}`}>{selectedProblem.contactEmail}</a>
                ) : (
                  'None provided'
                )}
              </div>
              <div>
                <strong>Follow-up consent:</strong>{' '}
                <span style={{ color: selectedProblem.followUpConsent ? 'var(--success-text)' : 'var(--text-muted)' }}>
                  {selectedProblem.followUpConsent ? 'Yes (Consented)' : 'No'}
                </span>
              </div>
              <div>
                <strong>Public consent:</strong>{' '}
                <span>{selectedProblem.publicDisplayConsent ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Narrative & Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Description
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedProblem.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Cohort</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedProblem.targetAudience}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported Frequency</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedProblem.frequency}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported Impact</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedProblem.impact}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Region / Location</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedProblem.broadLocation || 'Unspecified'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Current Workaround:</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{selectedProblem.currentWorkaround}</p>
            </div>

            {selectedProblem.missingFromSolutions && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Missing From Existing Solutions:</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{selectedProblem.missingFromSolutions}</p>
              </div>
            )}

            {/* Section: Moderation Actions */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-surface-muted)', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.65rem' }}>Public Moderation Status</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleModerationChange('APPROVED')}
                  className={`btn btn-sm ${selectedProblem.moderationStatus === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <CheckCircle size={14} /> Approve for Public
                </button>
                <button
                  onClick={() => handleModerationChange('REJECTED')}
                  className={`btn btn-sm ${selectedProblem.moderationStatus === 'REJECTED' ? 'btn-danger' : 'btn-secondary'}`}
                >
                  <XCircle size={14} /> Reject
                </button>
                <button
                  onClick={() => handleModerationChange('SPAM')}
                  className={`btn btn-sm ${selectedProblem.moderationStatus === 'SPAM' ? 'btn-danger' : 'btn-secondary'}`}
                >
                  <AlertTriangle size={14} /> Mark Spam
                </button>
                <button
                  onClick={() => handleModerationChange('PENDING')}
                  className={`btn btn-sm ${selectedProblem.moderationStatus === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Reset Pending
                </button>
              </div>
            </div>

            {/* Section: Research Phase Transition */}
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.65rem' }}>Internal Research Lifecycle</h4>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={selectedProblem.researchStatus}
                  onChange={(e) => handleResearchStatusChange(e.target.value as ResearchStatus)}
                >
                  <option value="NEW">New</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESEARCHING">Researching</option>
                  <option value="VALIDATION_NEEDED">Validation Needed</option>
                  <option value="VALIDATING">Validating</option>
                  <option value="SELECTED">Selected for Capstone</option>
                  <option value="NOT_SELECTED">Not Selected</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  style={{ flex: 1, minWidth: 200 }}
                  placeholder="Optional note for status audit history..."
                  value={statusTransitionNote}
                  onChange={(e) => setStatusTransitionNote(e.target.value)}
                />
              </div>

              {/* Status History */}
              {selectedProblem.statusHistory && selectedProblem.statusHistory.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Transition History:</strong>
                  <ul style={{ listStyle: 'none', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {selectedProblem.statusHistory.map((h) => (
                      <li key={h.id}>
                        • {h.previousStatus} → <strong>{h.newStatus}</strong> ({new Date(h.createdAt).toLocaleDateString()})
                        {h.note && ` — "${h.note}"`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Section: 5-Dimension Research Priority Rubric */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-surface-muted)', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} color="var(--primary)" />
                  <span>Research Prioritization Rubric (0 – 100)</span>
                </h4>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Calculated Score: {currentCalculatedScore}/100
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Frequency (25% weight): <strong>{scoreFreq} / 5</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scoreFreq}
                    onChange={(e) => setScoreFreq(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Severity / Pain (25% weight): <strong>{scoreSev} / 5</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scoreSev}
                    onChange={(e) => setScoreSev(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Evidence of Unmet Demand (20% weight): <strong>{scoreUnmet} / 5</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scoreUnmet}
                    onChange={(e) => setScoreUnmet(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Technical Feasibility (15% weight): <strong>{scoreFeas} / 5</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scoreFeas}
                    onChange={(e) => setScoreFeas(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Access to Users for Validation (15% weight): <strong>{scoreAccess} / 5</strong></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scoreAccess}
                    onChange={(e) => setScoreAccess(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveRubric}
                disabled={savingScore}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                {savingScore ? 'Saving Score...' : 'Save Rubric Priority Assessment'}
              </button>
            </div>

            {/* Section: Private Research Notes */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={16} color="var(--primary)" />
                <span>Private Research Notes</span>
              </h4>

              {/* Notes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
                {selectedProblem.researchNotes && selectedProblem.researchNotes.length > 0 ? (
                  selectedProblem.researchNotes.map((note) => (
                    <div
                      key={note.id}
                      style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--bg-surface-muted)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                        <span>{note.author.name}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    No notes recorded yet.
                  </p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add qualitative interview observation or research note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                />
                <button type="submit" disabled={savingNote || !newNote.trim()} className="btn btn-secondary btn-sm">
                  {savingNote ? 'Adding...' : 'Add Note'}
                </button>
              </form>
            </div>

            {/* Drawer Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={handleDeleteProblem}
                className="btn btn-danger btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Trash2 size={14} />
                <span>Delete Submission</span>
              </button>

              <button
                onClick={() => setSelectedProblem(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
