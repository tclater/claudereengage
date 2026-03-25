import { useState } from 'react';
import { Columns, Download, RefreshCw } from 'lucide-react';
import type { Candidate } from '../../types/candidate';
import { CandidateRow } from './CandidateRow';
import { SectionDivider } from './SectionDivider';

interface Props {
  tab: 'active' | 'passive';
  candidates: Candidate[];
  title: string;
}

const activeHeaders = ['', 'First name', 'Last name', 'Status', 'Rating', 'Job board', 'Date entered', 'Email', 'Cell phone', 'Actions'];
const passiveHeaders = ['', 'First name', 'Last name', 'Status', 'Rating', 'Source', 'Last contact', 'Email', 'Cell phone', 'Actions'];

export function CandidateTable({ tab, candidates, title }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const headers = tab === 'active' ? activeHeaders : passiveHeaders;

  const toggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(candidates.map((c) => c.id)));
    }
    setAllChecked((v) => !v);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // For passive tab: split into sections
  const reengageCandidates = candidates.filter((c) => c.passiveGroup === 'reengage');
  const passiveSourceCandidates = candidates.filter((c) => c.passiveGroup === 'passive_source');

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 10, border: '0.5px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Table header actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '0.5px solid #e2e8f0',
        }}
      >
        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
          {title}
          <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 6, fontSize: 13 }}>
            ({candidates.length})
          </span>
        </span>
        <div className="flex items-center gap-2">
          {checked.size > 0 && (
            <span style={{ color: '#2d7dd2', fontSize: 12, fontWeight: 500, marginRight: 4 }}>
              {checked.size} selected
            </span>
          )}
          {[Columns, Download, RefreshCw].map((Icon, i) => (
            <button
              key={i}
              style={{
                background: 'none',
                border: '0.5px solid #e2e8f0',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '0.5px solid #e2e8f0' }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: i === 0 ? '8px 8px 8px 12px' : '8px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    fontSize: 12,
                    width: i === 0 ? 36 : undefined,
                  }}
                >
                  {i === 0 ? (
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      style={{ cursor: 'pointer', accentColor: '#2d7dd2' }}
                    />
                  ) : (
                    h
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tab === 'active' ? (
              candidates.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
                    No candidates match the current filters.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <CandidateRow
                    key={c.id}
                    candidate={c}
                    tab={tab}
                    checked={checked.has(c.id)}
                    onCheck={toggleOne}
                  />
                ))
              )
            ) : (
              <>
                {/* Re-engage section */}
                <SectionDivider label="Re-engage" count={reengageCandidates.length} />
                {reengageCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>
                      No re-engage candidates.
                    </td>
                  </tr>
                ) : (
                  reengageCandidates.map((c) => (
                    <CandidateRow
                      key={c.id}
                      candidate={c}
                      tab={tab}
                      checked={checked.has(c.id)}
                      onCheck={toggleOne}
                    />
                  ))
                )}

                {/* Passive sources section */}
                <SectionDivider
                  label="Passive sources"
                  count={passiveSourceCandidates.length}
                  color="#9d174d"
                />
                {passiveSourceCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>
                      No passive source candidates.
                    </td>
                  </tr>
                ) : (
                  passiveSourceCandidates.map((c) => (
                    <CandidateRow
                      key={c.id}
                      candidate={c}
                      tab={tab}
                      checked={checked.has(c.id)}
                      onCheck={toggleOne}
                    />
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
