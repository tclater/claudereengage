interface Props {
  activeTab: 'active' | 'passive';
  onTabChange: (tab: 'active' | 'passive') => void;
  activeCount: number;
  passiveCount: number;
}

export function TabSwitcher({ activeTab, onTabChange, activeCount, passiveCount }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Pill container */}
      <div
        style={{
          display: 'inline-flex',
          border: '0.5px solid #d1d5db',
          borderRadius: 20,
          padding: 3,
          backgroundColor: 'white',
        }}
      >
        <button
          onClick={() => onTabChange('active')}
          style={{
            borderRadius: 20,
            padding: '5px 16px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: activeTab === 'active' ? '#2d7dd2' : 'transparent',
            color: activeTab === 'active' ? 'white' : '#64748b',
            transition: 'all 0.15s',
          }}
        >
          Active Candidates
          <span
            style={{
              backgroundColor: activeTab === 'active' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
              color: activeTab === 'active' ? 'white' : '#475569',
              borderRadius: 10,
              padding: '1px 7px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange('passive')}
          style={{
            borderRadius: 20,
            padding: '5px 16px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: activeTab === 'passive' ? '#b05a00' : 'transparent',
            color: activeTab === 'passive' ? 'white' : '#64748b',
            transition: 'all 0.15s',
          }}
        >
          Passive Candidates
          <span
            style={{
              backgroundColor: activeTab === 'passive' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
              color: activeTab === 'passive' ? 'white' : '#475569',
              borderRadius: 10,
              padding: '1px 7px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {passiveCount}
          </span>
        </button>
      </div>
    </div>
  );
}
