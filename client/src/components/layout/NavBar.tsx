const navLinks = [
  { label: 'Home', active: false },
  { label: 'Call list', active: true },
  { label: 'Applicants', active: false },
  { label: 'Calendar', active: false },
  { label: 'Reports', active: false },
  { label: 'SMS/Email', active: false },
  { label: 'Settings', active: false },
  { label: 'AI', active: false },
];

export function NavBar() {
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
      {/* Left links */}
      <div className="flex items-center gap-1">
        {navLinks.map((link) => (
          <button
            key={link.label}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 6,
              fontWeight: link.active ? 600 : 400,
              color: link.active ? '#2d7dd2' : '#475569',
              backgroundColor: link.active ? '#eff6ff' : 'transparent',
              fontSize: 13,
            }}
          >
            {link.label}
          </button>
        ))}
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
          }}
        >
          Mega Chat
        </button>
      </div>
    </nav>
  );
}
