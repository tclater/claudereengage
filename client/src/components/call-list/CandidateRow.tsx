import { Eye, MessageSquare, Pencil } from 'lucide-react';
import type { Candidate } from '../../types/candidate';
import { StatusBadge } from './StatusBadge';
import { StarRating } from '../common/StarRating';

interface Props {
  candidate: Candidate;
  tab: 'active' | 'passive';
  checked: boolean;
  onCheck: (id: string) => void;
}

export function CandidateRow({ candidate, tab, checked, onCheck }: Props) {
  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <tr
      style={{
        borderBottom: '0.5px solid #f1f5f9',
        height: 42,
        backgroundColor: checked ? '#f8fbff' : 'white',
      }}
      onMouseEnter={(e) => {
        if (!checked) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f8fafc';
      }}
      onMouseLeave={(e) => {
        if (!checked) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'white';
      }}
    >
      {/* Checkbox */}
      <td style={{ padding: '0 8px 0 12px', width: 36 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(candidate.id)}
          style={{ cursor: 'pointer', accentColor: '#2d7dd2' }}
        />
      </td>

      {/* First name */}
      <td style={{ padding: '0 8px' }}>
        <a href="#" style={{ color: '#2d7dd2', textDecoration: 'none', fontWeight: 500 }}
          onClick={(e) => e.preventDefault()}>
          {candidate.firstName}
        </a>
      </td>

      {/* Last name */}
      <td style={{ padding: '0 8px', color: '#374151' }}>{candidate.lastName}</td>

      {/* Status */}
      <td style={{ padding: '0 8px' }}>
        <StatusBadge status={candidate.status} />
      </td>

      {/* Rating */}
      <td style={{ padding: '0 8px' }}>
        <StarRating rating={candidate.rating} />
      </td>

      {/* Job board (active) or Source (passive) */}
      <td style={{ padding: '0 8px', color: '#64748b' }}>
        {tab === 'active' ? candidate.jobBoard ?? '—' : candidate.source ?? '—'}
      </td>

      {/* Date entered (active) or Last contact (passive) */}
      <td style={{ padding: '0 8px', color: '#64748b', whiteSpace: 'nowrap' }}>
        {tab === 'active' ? formatDate(candidate.dateEntered) : formatDate(candidate.lastContact)}
      </td>

      {/* Email */}
      <td style={{ padding: '0 8px' }}>
        <a href={`mailto:${candidate.email}`} style={{ color: '#64748b', textDecoration: 'none' }}>
          {candidate.email}
        </a>
      </td>

      {/* Cell phone */}
      <td style={{ padding: '0 8px', color: '#64748b', whiteSpace: 'nowrap' }}>
        {candidate.cellPhone}
      </td>

      {/* Actions */}
      <td style={{ padding: '0 12px 0 8px' }}>
        <div className="flex items-center gap-2">
          {[Eye, MessageSquare, Pencil].map((Icon, i) => (
            <button
              key={i}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 3,
                borderRadius: 4,
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#2d7dd2')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}
