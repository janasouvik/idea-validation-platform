import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  PlusCircle,
  Search,
  MapPin,
  Info,
  ShieldCheck,
  Menu,
  X,
  Home,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark / Light Theme State with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('problempulse_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('problempulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/problems', icon: Search },
    { name: 'Roadmap', path: '/roadmap', icon: MapPin },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-link" onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={20} />
          </div>
          <span>ProblemPulse</span>
          <span className="brand-badge">Research</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: isActive(item.path) ? 600 : 500,
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark/light theme"
              style={{
                padding: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                borderColor: 'var(--border-light)',
              }}
            >
              {theme === 'dark' ? (
                <Sun size={17} color="#fbbf24" />
              ) : (
                <Moon size={17} color="var(--text-muted)" />
              )}
            </button>

            <Link to="/submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <PlusCircle size={16} />
              <span>Share a Problem</span>
            </Link>

            <Link
              to="/admin"
              className="btn btn-outline btn-sm"
              title="Researcher Admin Portal"
              style={{
                borderColor: 'var(--border-light)',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={16} />
              <span className="admin-btn-text">Admin</span>
            </Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.65rem 0',
                color: isActive(item.path) ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive(item.path) ? 600 : 500,
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <span style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-main)' }}>
              Appearance
            </span>
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.35rem 0.75rem', gap: '0.4rem' }}
            >
              {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <Link
            to="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
            }}
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </header>
  );
};
