import type { Page } from '../../App';

interface NavLink {
  label: string;
  page: Page;
}

const navLinks: NavLink[] = [
  { label: 'Home',       page: 'home' },
  { label: 'Applicants', page: 'applicants' },
  { label: 'Call List',  page: 'call-list' },
  { label: 'Calendar',   page: 'calendar' },
  { label: 'Pipeline',   page: 'pipeline' },
  { label: 'Reports',    page: 'reports' },
  { label: 'SMS/Email',  page: 'sms-email' },
  { label: 'Re-engage',  page: 'reengagement' },
  { label: 'Settings',   page: 'settings' },
  { label: 'AI',         page: 'ai' },
];

// Per-section accent colors
const ACCENT: Partial<Record<Page, { color: string; bg: string }>> = {
  applicants:   { color: '#0a66c2', bg: '#e8f0fe' },
  calendar:     { color: '#be185d', bg: '#fdf2f8' },   // matches 1st interview pink
  pipeline:     { color: '#0f766e', bg: '#f0fdfa' },
  reengagement: { color: '#7c3aed', bg: '#f5f3ff' },
};
const DEFAULT_ACCENT = { color: '#2d7dd2', bg: '#eff6ff' };

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <nav
      style={{
        borderBottom: '0.5px solid #d1d5db',
        backgroundColor: 'white',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 36,
      }}
    >
      {/* Left nav links */}
      <div className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = currentPage === link.page;
          const accent   = ACCENT[link.page] ?? DEFAULT_ACCENT;

          return (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: 6,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? accent.color : '#475569',
                backgroundColor: isActive ? accent.bg : 'transparent',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'background 0.1s, color 0.1s',
                position: 'relative',
              }}
            >
              {link.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 8,
                    right: 8,
                    height: 2,
                    backgroundColor: accent.color,
                    borderRadius: 1,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-2">
        {['CVs', 'SCP'].map((label) => (
          <button
            key={label}
            style={{
              border: '0.5px solid #d1d5db',
              borderRadius: 8,
              padding: '3px 12px',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
        <button
          style={{
            backgroundColor: '#2d7dd2',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '4px 14px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Mega Chat
        </button>
      </div>
    </nav>
  );
}
