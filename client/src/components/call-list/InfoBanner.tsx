import { Info } from 'lucide-react';

interface Props {
  type: 'active' | 'passive';
}

const config = {
  active: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1e40af',
    icon: '#3b82f6',
    text: 'Active candidates applied within the last 14 days or have a scheduled interview. Complete this list before working passive candidates.',
  },
  passive: {
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#92400e',
    icon: '#f59e0b',
    text: 'Work passive candidates only after your active call list is clear. Re-engage candidates are higher priority — they\'ve shown prior interest.',
  },
};

export function InfoBanner({ type }: Props) {
  const c = config[type];
  return (
    <div
      style={{
        backgroundColor: c.bg,
        border: `0.5px solid ${c.border}`,
        borderRadius: 8,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
      }}
    >
      <Info size={15} color={c.icon} style={{ flexShrink: 0 }} />
      <span style={{ color: c.color, fontSize: 13 }}>{c.text}</span>
    </div>
  );
}
