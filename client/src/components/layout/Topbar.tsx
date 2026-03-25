import { Settings, Bell, ChevronDown } from 'lucide-react';

export function Topbar() {
  return (
    <header
      style={{ borderBottom: '0.5px solid #d1d5db' }}
      className="bg-white flex items-center justify-between px-4 h-11"
    >
      {/* Left: Logo + App name + Account switcher */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div
          style={{ backgroundColor: '#2d7dd2', borderRadius: 6 }}
          className="w-7 h-7 flex items-center justify-center text-white font-bold text-sm"
        >
          A
        </div>
        <span style={{ color: '#1e293b', fontWeight: 600, fontSize: 14 }}>
          ApplicantStream
        </span>

        {/* Account switcher pill */}
        <button
          style={{
            border: '0.5px solid #d1d5db',
            borderRadius: 20,
            padding: '3px 10px',
            backgroundColor: '#f8fafc',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <span style={{ color: '#1e293b', fontWeight: 500 }}>Acme Staffing</span>
          <span style={{ color: '#94a3b8' }}>·</span>
          <span>J. Rivera</span>
          <ChevronDown size={12} color="#94a3b8" />
        </button>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-3">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Settings size={16} color="#64748b" />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, position: 'relative' }}>
          <Bell size={16} color="#64748b" />
          <span
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: '1.5px solid white',
            }}
          />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#2d7dd2',
              color: 'white',
              fontWeight: 600,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            JR
          </div>
          <span style={{ color: '#374151', fontWeight: 500 }}>J. Rivera</span>
          <ChevronDown size={12} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
}
