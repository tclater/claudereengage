import { useState, useMemo } from 'react';
import { Bot, Star, Filter, X, ChevronRight, Clock } from 'lucide-react';
import type { PipelineCandidate, PipelineStage } from '../../data/mockPipelineCandidates';
import { mockPipelineCandidates } from '../../data/mockPipelineCandidates';
import { BOARD_COLORS } from '../../data/mockApplicants';

// ─── Stage config ─────────────────────────────────────────────────────────────
interface StageConfig {
  id: PipelineStage;
  label: string;
  color: string;
  bg: string;
  headerBg: string;
  dotColor: string;
}

const STAGES: StageConfig[] = [
  { id: 'applied',     label: 'Applied',       color: '#1e40af', bg: '#eff6ff', headerBg: '#dbeafe', dotColor: '#3b82f6' },
  { id: 'reviewing',   label: 'Reviewing',     color: '#5b21b6', bg: '#f5f3ff', headerBg: '#ede9fe', dotColor: '#8b5cf6' },
  { id: 'call_list',   label: 'Call List',     color: '#0f766e', bg: '#f0fdfa', headerBg: '#ccfbf1', dotColor: '#14b8a6' },
  { id: 'contacted',   label: 'Contacted',     color: '#92400e', bg: '#fffbeb', headerBg: '#fde68a', dotColor: '#f59e0b' },
  { id: 'interview_1', label: '1st Interview', color: '#be185d', bg: '#fdf2f8', headerBg: '#fbcfe8', dotColor: '#ec4899' },
  { id: 'interview_2', label: '2nd Interview', color: '#c2410c', bg: '#fff7ed', headerBg: '#fed7aa', dotColor: '#fb923c' },
  { id: 'interview_3', label: '3rd Interview', color: '#3730a3', bg: '#eef2ff', headerBg: '#c7d2fe', dotColor: '#818cf8' },
  { id: 'interview_4', label: '4th Interview', color: '#6b21a8', bg: '#faf5ff', headerBg: '#e9d5ff', dotColor: '#c084fc' },
  { id: 'offer',       label: 'Offer',         color: '#15803d', bg: '#f0fdf4', headerBg: '#bbf7d0', dotColor: '#22c55e' },
  { id: 'placed',      label: 'Placed',        color: '#1e3a8a', bg: '#eff6ff', headerBg: '#93c5fd', dotColor: '#1d4ed8' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={9}
          fill={i <= rating ? '#f59e0b' : 'none'}
          stroke={i <= rating ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const cfg = BOARD_COLORS[source as keyof typeof BOARD_COLORS] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderRadius: 4,
        padding: '1px 5px',
        fontSize: 9,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {source}
    </span>
  );
}

// ─── Candidate card ───────────────────────────────────────────────────────────
interface CardProps {
  candidate: PipelineCandidate;
  stageColor: string;
  onClick: () => void;
}

function CandidateCard({ candidate, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'white',
        border: `0.5px solid ${candidate.fromReengagement ? '#ddd6fe' : '#e2e8f0'}`,
        borderRadius: 8,
        padding: '10px 11px',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 4px 12px rgba(0,0,0,0.10)'
          : candidate.fromReengagement
          ? '0 1px 4px rgba(124,58,237,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Passive campaign accent line */}
      {candidate.fromReengagement && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 3,
            backgroundColor: '#7c3aed',
            borderRadius: '8px 0 0 8px',
          }}
        />
      )}

      <div style={{ paddingLeft: candidate.fromReengagement ? 6 : 0 }}>
        {/* Top row: avatar + name + AI badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: candidate.avatarColor,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {candidate.avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {candidate.firstName} {candidate.lastName}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {candidate.jobTitle}
            </div>
          </div>

          {/* Reengagement indicator */}
          {candidate.fromReengagement && (
            <div
              title={`From campaign: ${candidate.campaignName}`}
              style={{
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                borderRadius: 6,
                padding: '2px 5px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexShrink: 0,
              }}
            >
              <Bot size={9} />
              <span style={{ fontSize: 8, fontWeight: 700 }}>RE</span>
            </div>
          )}
        </div>

        {/* Source badge + days in stage */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SourceBadge source={candidate.source} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: candidate.daysInStage > 7 ? '#dc2626' : '#94a3b8' }}>
            <Clock size={9} />
            {candidate.daysInStage === 0 ? 'Today' : `${candidate.daysInStage}d`}
          </div>
        </div>

        {/* Stars */}
        {candidate.rating > 0 && (
          <div style={{ marginTop: 5 }}>
            <StarRow rating={candidate.rating} />
          </div>
        )}

        {/* Campaign name pill */}
        {candidate.fromReengagement && candidate.campaignName && (
          <div
            style={{
              marginTop: 6,
              backgroundColor: '#f5f3ff',
              borderRadius: 4,
              padding: '2px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Bot size={8} style={{ color: '#7c3aed', flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: '#7c3aed', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate.campaignName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Candidate detail drawer ──────────────────────────────────────────────────
function CandidateDrawer({ candidate, stage, onClose }: { candidate: PipelineCandidate; stage: StageConfig; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.25)', zIndex: 50 }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 340,
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: stage.headerBg, padding: '16px 18px', borderBottom: `0.5px solid ${stage.dotColor}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stage.label}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: candidate.avatarColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {candidate.avatarInitials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                {candidate.firstName} {candidate.lastName}
              </div>
              <div style={{ fontSize: 12, color: '#475569' }}>{candidate.jobTitle}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          {/* Reengagement highlight */}
          {candidate.fromReengagement && (
            <div
              style={{
                backgroundColor: '#f5f3ff',
                border: '0.5px solid #ddd6fe',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 16,
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              <Bot size={16} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#5b21b6', marginBottom: 2 }}>
                  From Re-engagement Campaign
                </div>
                <div style={{ fontSize: 11, color: '#7c3aed' }}>{candidate.campaignName}</div>
              </div>
            </div>
          )}

          {/* Details grid */}
          {[
            { label: 'Source',         value: candidate.source },
            { label: 'Candidate Type', value: candidate.sourceType.charAt(0).toUpperCase() + candidate.sourceType.slice(1) },
            { label: 'Days in Stage',  value: candidate.daysInStage === 0 ? 'Just arrived' : `${candidate.daysInStage} day${candidate.daysInStage !== 1 ? 's' : ''}` },
            { label: 'Rating',         value: candidate.rating > 0 ? `${candidate.rating} / 5` : 'Unrated' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '0.5px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
            </div>
          ))}

          {/* Stage trail */}
          <div style={{ marginTop: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>Pipeline Stage</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
              {STAGES.map((s, idx) => {
                const currentIdx = STAGES.findIndex(st => st.id === candidate.stage);
                const isPast    = idx < currentIdx;
                const isCurrent = s.id === candidate.stage;
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        backgroundColor: isCurrent ? s.headerBg : isPast ? '#f0fdf4' : '#f8fafc',
                        border: `1px solid ${isCurrent ? s.dotColor : isPast ? '#86efac' : '#e2e8f0'}`,
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 9,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? s.color : isPast ? '#16a34a' : '#94a3b8',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {isCurrent ? `● ${s.label}` : isPast ? `✓ ${s.label}` : s.label}
                    </div>
                    {idx < STAGES.length - 1 && (
                      <ChevronRight size={10} style={{ color: '#d1d5db', flexShrink: 0, margin: '0 1px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 18px', borderTop: '0.5px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <button
            style={{
              flex: 1,
              backgroundColor: '#2d7dd2',
              color: 'white',
              border: 'none',
              borderRadius: 7,
              padding: '8px 0',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Move Stage
          </button>
          <button
            style={{
              border: '0.5px solid #d1d5db',
              borderRadius: 7,
              background: 'white',
              color: '#374151',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function PipelineBoardPage() {
  const [candidates] = useState<PipelineCandidate[]>(mockPipelineCandidates);
  const [selected, setSelected] = useState<PipelineCandidate | null>(null);
  const [filterReengage, setFilterReengage] = useState(false);
  const [filterSource, setFilterSource] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      if (filterReengage && !c.fromReengagement) return false;
      if (filterSource !== 'all' && c.source !== filterSource) return false;
      return true;
    });
  }, [candidates, filterReengage, filterSource]);

  const byStage = useMemo(() => {
    const map = new Map<PipelineStage, PipelineCandidate[]>();
    STAGES.forEach(s => map.set(s.id, []));
    filtered.forEach(c => map.get(c.stage)?.push(c));
    return map;
  }, [filtered]);

  const reengageCount   = candidates.filter(c => c.fromReengagement).length;
  const totalCount      = candidates.length;
  const allSources      = [...new Set(candidates.map(c => c.source))].sort();
  const selectedStage   = selected ? STAGES.find(s => s.id === selected.stage)! : null;

  const hasFilters = filterReengage || filterSource !== 'all';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      {/* Page header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '0.5px solid #e2e8f0',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pipeline Board</h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: '1px 0 0' }}>
            {totalCount} candidates across {STAGES.length} stages
            {reengageCount > 0 && (
              <span style={{ marginLeft: 8, color: '#7c3aed', fontWeight: 600 }}>
                · {reengageCount} from re-engagement campaigns
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Reengagement filter toggle */}
          <button
            onClick={() => setFilterReengage(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              border: `1px solid ${filterReengage ? '#7c3aed' : '#d1d5db'}`,
              borderRadius: 7,
              background: filterReengage ? '#f5f3ff' : 'white',
              color: filterReengage ? '#7c3aed' : '#374151',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: filterReengage ? 700 : 500,
            }}
          >
            <Bot size={13} />
            Re-engaged only
          </button>

          {/* Source filter */}
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              border: `1px solid ${hasFilters ? '#2d7dd2' : '#d1d5db'}`,
              borderRadius: 7,
              background: hasFilters ? '#eff6ff' : 'white',
              color: hasFilters ? '#2d7dd2' : '#374151',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <Filter size={13} />
            Filters
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => { setFilterReengage(false); setFilterSource('all'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                border: '0.5px solid #fecaca',
                borderRadius: 7,
                background: 'white',
                color: '#dc2626',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div
          style={{
            backgroundColor: '#fafafa',
            borderBottom: '0.5px solid #e2e8f0',
            padding: '8px 20px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Source:</span>
          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
            style={{ border: '0.5px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#374151' }}
          >
            <option value="all">All sources</option>
            {allSources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          backgroundColor: '#fafafa',
          borderBottom: '0.5px solid #e2e8f0',
          padding: '5px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#64748b' }}>
          <div style={{ width: 3, height: 14, backgroundColor: '#7c3aed', borderRadius: 2 }} />
          <Bot size={10} style={{ color: '#7c3aed' }} />
          Purple bar + RE badge = came from re-engagement campaign
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#dc2626' }}>
          <Clock size={10} />
          Red day count = overdue (&gt;7 days in stage)
        </div>
      </div>

      {/* Kanban board */}
      <div
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '12px 16px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        {STAGES.map(stage => {
          const stageCandidates = byStage.get(stage.id) ?? [];
          return (
            <div
              key={stage.id}
              style={{
                width: 200,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
              }}
            >
              {/* Column header */}
              <div
                style={{
                  backgroundColor: stage.headerBg,
                  border: `0.5px solid ${stage.dotColor}50`,
                  borderRadius: '8px 8px 0 0',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: stage.dotColor,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>
                    {stage.label}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: stage.dotColor + '22',
                    color: stage.color,
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards column */}
              <div
                style={{
                  backgroundColor: stage.bg + '80',
                  border: `0.5px solid ${stage.dotColor}30`,
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '8px',
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  minHeight: 80,
                }}
              >
                {stageCandidates.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#cbd5e1',
                      fontSize: 11,
                      padding: '20px 0',
                    }}
                  >
                    Empty
                  </div>
                ) : (
                  stageCandidates.map(candidate => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      stageColor={stage.color}
                      onClick={() => setSelected(candidate)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail drawer */}
      {selected && selectedStage && (
        <CandidateDrawer
          candidate={selected}
          stage={selectedStage}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
