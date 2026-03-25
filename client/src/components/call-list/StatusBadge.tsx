import type { CandidateStatus, PassiveStatus } from '../../types/candidate';

const badgeConfig: Record<string, { bg: string; color: string; label: string }> = {
  open:           { bg: '#e6f1fb', color: '#0c447c', label: 'Open' },
  left_message:   { bg: '#eaf3de', color: '#27500a', label: 'Left msg' },
  interview:      { bg: '#eeedfe', color: '#3c3489', label: 'Interview' },
  reengage:       { bg: '#faeeda', color: '#633806', label: 'Re-engage' },
  passive_source: { bg: '#fbeaf0', color: '#72243e', label: 'Passive source' },
  removed:        { bg: '#f3f4f6', color: '#6b7280', label: 'Removed' },
  on_hold:        { bg: '#f3f4f6', color: '#6b7280', label: 'On hold' },
};

interface Props {
  status: CandidateStatus | PassiveStatus;
}

export function StatusBadge({ status }: Props) {
  const config = badgeConfig[status] ?? { bg: '#f3f4f6', color: '#6b7280', label: status };
  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: 20,
        padding: '2px 10px',
        fontWeight: 600,
        fontSize: 12,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {config.label}
    </span>
  );
}
