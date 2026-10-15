import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { PublicProblem, Category } from '../types';
import { fetchPublicProblems, fetchCategories } from '../services/api';
import { ProblemCard } from '../components/ProblemCard';

export const ExploreProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState<PublicProblem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';
  const sortBy = (searchParams.get('sortBy') as 'recent' | 'supporters') || 'recent';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch Categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Problems
  useEffect(() => {
    async function loadProblems() {
      setLoading(true);
      try {
        const res = await fetchPublicProblems({
          page: currentPage,
          limit: 9,
          search: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          sortBy,
        });

        setProblems(res.data || []);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalCount(res.pagination.total || 0);
      } catch (err) {
        console.error('Failed to load problems', err);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, currentPage]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || (key === 'page' && value === '1')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') {
      next.delete('page'); // Reset to page 1 on filter changes
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', localSearch.trim());
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Title & Introduction */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.65rem' }}>
          Explore Reported Problems
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Browse verified real-world challenges submitted by students, working professionals, and communities.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 280px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search problems by keyword, cohort, or workaround..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort by:</span>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="recent">Most Recent</option>
              <option value="supporters">Most Supported</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Status:</span>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => updateParam('status', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Research Phases</option>
              <option value="NEW">Discovery</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESEARCHING">In Research</option>
              <option value="VALIDATING">Active Validation</option>
              <option value="SELECTED">Selected for Project</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => updateParam('category', 'all')}
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`btn btn-sm ${selectedCategory === cat.slug ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Showing <strong>{totalCount}</strong> verified {totalCount === 1 ? 'problem' : 'problems'}
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <p>Loading problems from database...</p>
        </div>
      ) : problems.length === 0 ? (
        /* Empty State */
        <div
          className="card"
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            maxWidth: 580,
            margin: '0 auto',
          }}
        >
          <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No problems found yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ProblemPulse operates in 100% real time with zero mock data. No approved submissions match this criteria yet. Be the first to share an authentic problem you experience!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setLocalSearch('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Clear All Filters
              </button>
            )}
            <a href="/submit" className="btn btn-primary btn-sm">
              Submit an Authentic Problem
            </a>
          </div>
        </div>
      ) : (
        /* Problems Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => updateParam('page', (currentPage - 1).toString())}
            disabled={currentPage <= 1}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => updateParam('page', (currentPage + 1).toString())}
            disabled={currentPage >= totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
