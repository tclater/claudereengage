import { useState, useMemo } from 'react';
import { Users, UserCheck, UserX, ArrowUpRight, Filter, X } from 'lucide-react';
import type { Applicant, ApplicantStatus } from '../../types/candidate';
import { mockApplicants, BOARD_COLORS } from '../../data/mockApplicants';

type Tab = 'active' | 'passive';

const STATUS_CONFIG: Record<ApplicantStatus, { label: string; bg: string; color: string }> = {
  new:      { label: 'New',      bg: '#eff6ff', color: '#2563eb' },
  reviewed: { label: 'Reviewed', bg: '#f5f3ff', color: '#7c3aed' },
  pushed:   { label: 'In Call List', bg: '#f0fdf4', color: '#16a34a' },
  rejected: { label: 'Rejected', bg: '#fef2f2', color: '#dc2626' },
};

function ApplicantStatusBadge({ status }: { status: ApplicantStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
}

function JobBoardBadge({ board }: { board: string }) {
  const cfg = BOARD_COLORS[board as keyof typeof BOARD_COLORS] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderRadius: 6,
        padding: '2px 9px',
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {board}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface ApplicantRowProps {
  applicant: Applicant;
  onPush: (id: string) => void;
  onReject: (id: string) => void;
  onReview: (id: string) => void;
}

function ApplicantRow({ applicant, onPush, onReject, onReview }: ApplicantRowProps) {
  const [hovered, setHovered] = useState(false);
  const isPushed = applicant.status === 'pushed';
  const isRejected = applicant.status === 'rejected';

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ backgroundColor: hovered ? '#f8fafc' : 'white', transition: 'background 0.1s' }}
    >
      {/* Name */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
          {applicant.firstName} {applicant.lastName}
        </span>
      </td>
      {/* Job Title */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9', color: '#475569', fontSize: 13 }}>
        {applicant.jobTitle}
      </td>
      {/* Job Board */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
        <JobBoardBadge board={applicant.jobBoard} />
      </td>
      {/* Application Date */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
        {formatDate(applicant.applicationDate)}
      </td>
      {/* Status */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
        <ApplicantStatusBadge status={applicant.status} />
      </td>
      {/* Messages */}
      {applicant.candidateType === 'passive' && (
        <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9', color: '#64748b', fontSize: 13, textAlign: 'center' }}>
          {applicant.messagesLeft ?? '—'}
        </td>
      )}
      {applicant.candidateType === 'active' && (
        <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }} />
      )}
      {/* Email */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
        <a href={`mailto:${applicant.email}`} style={{ color: '#2d7dd2', fontSize: 12, textDecoration: 'none' }}>
          {applicant.email}
        </a>
      </td>
      {/* Phone */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9', color: '#64748b', fontSize: 13, whiteSpace: 'nowrap' }}>
        {applicant.cellPhone}
      </td>
      {/* Actions */}
      <td style={{ padding: '10px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Review */}
          {applicant.status === 'new' && (
            <button
              onClick={() => onReview(applicant.id)}
              title="Mark as reviewed"
              style={{
                border: '0.5px solid #d1d5db',
                borderRadius: 6,
                background: 'white',
                color: '#7c3aed',
                cursor: 'pointer',
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Review
            </button>
          )}
          {/* Push to Call List */}
          {!isPushed && !isRejected && (
            <button
              onClick={() => onPush(applicant.id)}
              title="Push to Call List"
              style={{
                border: 'none',
                borderRadius: 6,
                background: '#2d7dd2',
                color: 'white',
                cursor: 'pointer',
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ArrowUpRight size={12} />
              Call List
            </button>
          )}
          {/* Reject */}
          {!isRejected && !isPushed && (
            <button
              onClick={() => onReject(applicant.id)}
              title="Reject"
              style={{
                border: '0.5px solid #fecaca',
                borderRadius: 6,
                background: 'white',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function ApplicantsPage() {
  const [tab, setTab] = useState<Tab>('active');
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBoard, setFilterBoard] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const activeApplicants  = useMemo(() => applicants.filter(a => a.candidateType === 'active'),  [applicants]);
  const passiveApplicants = useMemo(() => applicants.filter(a => a.candidateType === 'passive'), [applicants]);

  const current = tab === 'active' ? activeApplicants : passiveApplicants;

  const filtered = useMemo(() => {
    return current.filter(a => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterBoard !== 'all' && a.jobBoard !== filterBoard) return false;
      return true;
    });
  }, [current, filterStatus, filterBoard]);

  // Sort: new first, then reviewed, then pushed/rejected
  const sorted = useMemo(() => {
    const order: ApplicantStatus[] = ['new', 'reviewed', 'pushed', 'rejected'];
    return [...filtered].sort((a, b) => {
      const od = order.indexOf(a.status) - order.indexOf(b.status);
      if (od !== 0) return od;
      return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
    });
  }, [filtered]);

  // Summary counts
  const newCount      = current.filter(a => a.status === 'new').length;
  const reviewedCount = current.filter(a => a.status === 'reviewed').length;
  const pushedCount   = current.filter(a => a.status === 'pushed').length;

  // Unique boards for filter
  const boards = useMemo(() => [...new Set(current.map(a => a.jobBoard))], [current]);

  const handlePush = (id: string) =>
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'pushed' } : a));

  const handleReject = (id: string) =>
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));

  const handleReview = (id: string) =>
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'reviewed' } : a));

  const clearFilters = () => { setFilterStatus('all'); setFilterBoard('all'); };
  const hasFilters = filterStatus !== 'all' || filterBoard !== 'all';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Applicants</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
          Review incoming applications and push qualified candidates to the call list.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: <Users size={16} />, label: 'New Applicants',   value: newCount,                   bg: '#eff6ff', color: '#2563eb' },
          { icon: <UserCheck size={16} />, label: 'Reviewed',     value: reviewedCount,              bg: '#f5f3ff', color: '#7c3aed' },
          { icon: <ArrowUpRight size={16} />, label: 'In Call List', value: pushedCount,             bg: '#f0fdf4', color: '#16a34a' },
          { icon: <UserX size={16} />, label: 'Total',            value: current.length,             bg: '#f8fafc', color: '#475569' },
        ].map(card => (
          <div
            key={card.label}
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              border: '0.5px solid #e2e8f0',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ backgroundColor: card.bg, color: card.color, borderRadius: 8, padding: 8, display: 'flex' }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 4, backgroundColor: '#f1f5f9', borderRadius: 8, padding: 3 }}>
          {(['active', 'passive'] as Tab[]).map(t => {
            const count = t === 'active' ? activeApplicants.length : passiveApplicants.length;
            const isActive = tab === t;
            const activeColor = '#2d7dd2';
            const passiveColor = '#b05a00';
            const c = t === 'active' ? activeColor : passiveColor;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); clearFilters(); }}
                style={{
                  background: isActive ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 14px',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? c : '#64748b',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'active' ? 'Active Candidates' : 'Passive Candidates'}
                <span
                  style={{
                    backgroundColor: isActive ? c : '#cbd5e1',
                    color: isActive ? 'white' : '#64748b',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            border: hasFilters ? '1px solid #2d7dd2' : '0.5px solid #d1d5db',
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
          {hasFilters && (
            <span style={{ backgroundColor: '#2d7dd2', color: 'white', borderRadius: 8, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>
              {[filterStatus !== 'all', filterBoard !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Source info banner */}
      <div
        style={{
          backgroundColor: tab === 'active' ? '#eff6ff' : '#fff7ed',
          border: `0.5px solid ${tab === 'active' ? '#bfdbfe' : '#fed7aa'}`,
          borderRadius: 8,
          padding: '8px 14px',
          marginBottom: 12,
          fontSize: 12,
          color: tab === 'active' ? '#1e40af' : '#92400e',
        }}
      >
        {tab === 'active'
          ? '🔵 Active candidates applied directly via LinkedIn or Indeed — they are actively seeking new roles. Review and push qualified applicants to the call list.'
          : '🟠 Passive candidates come from CareerBuilder resume database — they may not be actively looking. Review carefully and use re-engagement automation for older applications.'}
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div
          style={{
            backgroundColor: 'white',
            border: '0.5px solid #e2e8f0',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 12,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>STATUS</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#374151' }}
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="pushed">In Call List</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>JOB BOARD</label>
            <select
              value={filterBoard}
              onChange={e => setFilterBoard(e.target.value)}
              style={{ border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 10px', fontSize: 12, color: '#374151' }}
            >
              <option value="all">All boards</option>
              {boards.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                border: '0.5px solid #fecaca',
                borderRadius: 6,
                background: 'white',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 10, border: '0.5px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '0.5px solid #e2e8f0' }}>
              {['Name', 'Job Title', 'Job Board', 'Applied', 'Status', tab === 'passive' ? 'Msgs Left' : '', 'Email', 'Phone', 'Actions'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '9px 12px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>
                  No applicants match the current filters.
                </td>
              </tr>
            ) : (
              sorted.map(a => (
                <ApplicantRow
                  key={a.id}
                  applicant={a}
                  onPush={handlePush}
                  onReject={handleReject}
                  onReview={handleReview}
                />
              ))
            )}
          </tbody>
        </table>
        <div style={{ padding: '8px 14px', borderTop: '0.5px solid #f1f5f9', fontSize: 11, color: '#94a3b8' }}>
          {sorted.length} applicant{sorted.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
