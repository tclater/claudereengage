import type { Candidate } from '../../types/candidate';

interface CardDef {
  label: string;
  subtext: string;
  value: number;
  color: string;
}

interface Props {
  tab: 'active' | 'passive';
  candidates: Candidate[];
}

export function SummaryCards({ tab, candidates }: Props) {
  const active = candidates.filter((c) => c.type === 'active');
  const passive = candidates.filter((c) => c.type === 'passive');

  const activeCards: CardDef[] = [
    {
      label: 'Open',
      subtext: 'Needs first contact',
      value: active.filter((c) => c.status === 'open').length,
      color: '#2d7dd2',
    },
    {
      label: 'Left message',
      subtext: 'Awaiting callback',
      value: active.filter((c) => c.status === 'left_message').length,
      color: '#16a34a',
    },
    {
      label: 'Interviews',
      subtext: 'Scheduled',
      value: active.filter((c) => c.status === 'interview').length,
      color: '#7c3aed',
    },
    {
      label: 'Total active',
      subtext: 'Last 14 days',
      value: active.length,
      color: '#0f172a',
    },
  ];

  const passiveCards: CardDef[] = [
    {
      label: 'Re-engage',
      subtext: '30+ days since contact',
      value: passive.filter((c) => c.passiveGroup === 'reengage').length,
      color: '#b05a00',
    },
    {
      label: 'Passive sources',
      subtext: 'Long-term pipeline',
      value: passive.filter((c) => c.passiveGroup === 'passive_source').length,
      color: '#9d174d',
    },
    {
      label: 'Total passive',
      subtext: 'All time',
      value: passive.length,
      color: '#0f172a',
    },
  ];

  const cards = tab === 'active' ? activeCards : passiveCards;

  return (
    <div className="flex gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            backgroundColor: 'white',
            border: '0.5px solid #e2e8f0',
            borderRadius: 10,
            padding: '12px 18px',
            minWidth: 130,
            flex: 1,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: card.color, lineHeight: 1 }}>
            {card.value}
          </div>
          <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 4 }}>{card.label}</div>
          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{card.subtext}</div>
        </div>
      ))}
    </div>
  );
}
