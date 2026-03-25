import { useState, useMemo } from 'react';
import {
  Bot, Star, Video, Phone, Users, ArrowRight,
  ChevronRight, Check, X, Clock,
  CalendarCheck, UserCheck, Award, Briefcase,
} from 'lucide-react';
import type { PipelineCandidate, PipelineStage, InterviewConfirmed } from '../../data/mockPipelineCandidates';
import { mockPipelineCandidates } from '../../data/mockPipelineCandidates';
import { BOARD_COLORS } from '../../data/mockApplicants';

// ─── Stage tab config ─────────────────────────────────────────────────────────
interface StageTab {
  id: PipelineStage;
  label: string;
  short: string;
  color: string;
  bg: string;
  headerBg: string;
  borderColor: string;
}

const STAGE_TABS: StageTab[] = [
  { id:'applied',     label:'Applied',        short:'Applied',   color:'#1e40af', bg:'#eff6ff', headerBg:'#dbeafe', borderColor:'#93c5fd' },
  { id:'reviewing',   label:'Reviewing',      short:'Reviewing', color:'#5b21b6', bg:'#f5f3ff', headerBg:'#ede9fe', borderColor:'#c4b5fd' },
  { id:'call_list',   label:'Call List',      short:'Call List', color:'#0f766e', bg:'#f0fdfa', headerBg:'#ccfbf1', borderColor:'#5eead4' },
  { id:'contacted',   label:'Contacted',      short:'Contacted', color:'#92400e', bg:'#fffbeb', headerBg:'#fde68a', borderColor:'#fcd34d' },
  { id:'interview_1', label:'1st Interview',  short:'1st Int.',  color:'#be185d', bg:'#fdf2f8', headerBg:'#fbcfe8', borderColor:'#f9a8d4' },
  { id:'interview_2', label:'2nd Interview',  short:'2nd Int.',  color:'#c2410c', bg:'#fff7ed', headerBg:'#fed7aa', borderColor:'#fdba74' },
  { id:'interview_3', label:'3rd Interview',  short:'3rd Int.',  color:'#3730a3', bg:'#eef2ff', headerBg:'#c7d2fe', borderColor:'#a5b4fc' },
  { id:'interview_4', label:'4th Interview',  short:'4th Int.',  color:'#6b21a8', bg:'#faf5ff', headerBg:'#e9d5ff', borderColor:'#d8b4fe' },
  { id:'offer',       label:'Offer',          short:'Offer',     color:'#15803d', bg:'#f0fdf4', headerBg:'#bbf7d0', borderColor:'#86efac' },
  { id:'placed',      label:'Placed',         short:'Placed',    color:'#1e3a8a', bg:'#eff6ff', headerBg:'#93c5fd', borderColor:'#3b82f6' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = new Date();
today.setHours(0,0,0,0);

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
function fmtShortDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

function getDateLabel(iso: string): string {
  const d = new Date(iso);
  d.setHours(0,0,0,0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0)  return 'Today';
  if (diff === 1)  return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < -1)  return `${Math.abs(diff)} days ago`;
  return fmtDate(iso);
}

function fmt12h(t?: string) {
  if (!t) return '—';
  const [h,m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2,'0')} ${period}`;
}

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  d.setHours(0,0,0,0);
  return d.getTime() === today.getTime();
}

// ─── Small badge components ───────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display:'flex', gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={9} fill={i<=rating?'#f59e0b':'none'} stroke={i<=rating?'#f59e0b':'#d1d5db'} />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const cfg = BOARD_COLORS[source as keyof typeof BOARD_COLORS] ?? { bg:'#f3f4f6', color:'#374151' };
  return (
    <span style={{ backgroundColor:cfg.bg, color:cfg.color, borderRadius:4, padding:'1px 6px', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>
      {source}
    </span>
  );
}

function REBadge({ campaignName }: { campaignName?: string }) {
  return (
    <span
      title={campaignName ? `Campaign: ${campaignName}` : 'From re-engagement campaign'}
      style={{ backgroundColor:'#f5f3ff', color:'#7c3aed', borderRadius:5, padding:'1px 5px', fontSize:9, fontWeight:700, display:'inline-flex', alignItems:'center', gap:2, whiteSpace:'nowrap' }}
    >
      <Bot size={9} /> RE
    </span>
  );
}

const CONFIRM_CFG: Record<InterviewConfirmed, { label:string; bg:string; color:string; dot:string }> = {
  confirmed: { label:'Confirmed', bg:'#f0fdf4', color:'#16a34a', dot:'#22c55e' },
  pending:   { label:'Pending',   bg:'#fffbeb', color:'#92400e', dot:'#f59e0b' },
  'no-show': { label:'No-show',   bg:'#fef2f2', color:'#dc2626', dot:'#ef4444' },
  cancelled: { label:'Cancelled', bg:'#f8fafc', color:'#64748b', dot:'#94a3b8' },
};

function ConfirmBadge({ status }: { status: InterviewConfirmed }) {
  const c = CONFIRM_CFG[status];
  return (
    <span style={{ backgroundColor:c.bg, color:c.color, borderRadius:5, padding:'2px 7px', fontSize:10, fontWeight:700, display:'inline-flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:c.dot, display:'inline-block' }} />
      {c.label}
    </span>
  );
}

const IV_TYPE_ICON: Record<string, React.ReactNode> = {
  video:      <Video size={11} />,
  phone:      <Phone size={11} />,
  'in-person': <Users size={11} />,
};

// ─── Summary bar ──────────────────────────────────────────────────────────────
function SummaryBar({ stage, candidates }: { stage: StageTab; candidates: PipelineCandidate[] }) {
  const reCount     = candidates.filter(c => c.fromReengagement).length;
  const todayCount  = candidates.filter(c => isToday(c.interviewDate)).length;
  const confirmedCt = candidates.filter(c => c.interviewConfirmed === 'confirmed').length;
  const pendingCt   = candidates.filter(c => c.interviewConfirmed === 'pending').length;
  const isInterview = stage.id.startsWith('interview_');

  return (
    <div style={{ display:'flex', gap:20, padding:'10px 20px', backgroundColor:'white', borderBottom:`0.5px solid ${stage.borderColor}`, flexWrap:'wrap', alignItems:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:22, fontWeight:800, color:stage.color }}>{candidates.length}</span>
        <span style={{ fontSize:12, color:'#64748b' }}>in stage</span>
      </div>

      {isInterview && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:6, borderLeft:'0.5px solid #e2e8f0', paddingLeft:20 }}>
            <CalendarCheck size={14} style={{ color:stage.color }} />
            <span style={{ fontSize:13, fontWeight:700, color:stage.color }}>{todayCount}</span>
            <span style={{ fontSize:12, color:'#64748b' }}>today</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, borderLeft:'0.5px solid #e2e8f0', paddingLeft:20 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#22c55e', display:'inline-block' }} />
            <span style={{ fontSize:13, fontWeight:700, color:'#16a34a' }}>{confirmedCt}</span>
            <span style={{ fontSize:12, color:'#64748b' }}>confirmed</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#f59e0b', display:'inline-block' }} />
            <span style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>{pendingCt}</span>
            <span style={{ fontSize:12, color:'#64748b' }}>pending</span>
          </div>
        </>
      )}

      {reCount > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:5, borderLeft:'0.5px solid #e2e8f0', paddingLeft:20 }}>
          <Bot size={13} style={{ color:'#7c3aed' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'#7c3aed' }}>{reCount}</span>
          <span style={{ fontSize:12, color:'#64748b' }}>from campaigns</span>
        </div>
      )}
    </div>
  );
}

// ─── Action button helpers ─────────────────────────────────────────────────────
function ActionBtn({ label, color, onClick, icon }: { label:string; color?:string; onClick?:()=>void; icon?:React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const c = color ?? '#2d7dd2';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border:`0.5px solid ${hov ? c : '#d1d5db'}`,
        borderRadius:5,
        background: hov ? c : 'white',
        color: hov ? 'white' : c,
        padding:'2px 8px',
        cursor:'pointer',
        fontSize:10,
        fontWeight:600,
        display:'inline-flex',
        alignItems:'center',
        gap:3,
        whiteSpace:'nowrap',
        transition:'all 0.1s',
      }}
    >
      {icon}{label}
    </button>
  );
}

// ─── Row checkbox cell ─────────────────────────────────────────────────────────
function ChkCell({ checked, onChange }: { checked:boolean; onChange:()=>void }) {
  return (
    <td style={{ padding:'0 8px', borderBottom:'0.5px solid #f1f5f9', width:28 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ cursor:'pointer', width:13, height:13 }} />
    </td>
  );
}

// ─── TH helper ────────────────────────────────────────────────────────────────
function TH({ children, w }: { children:React.ReactNode; w?:number }) {
  return (
    <th style={{ padding:'8px 10px', textAlign:'left', fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap', width:w }}>
      {children}
    </th>
  );
}

function TD({ children, muted }: { children:React.ReactNode; muted?:boolean }) {
  return (
    <td style={{ padding:'8px 10px', borderBottom:'0.5px solid #f1f5f9', fontSize:12, color:muted?'#94a3b8':'#374151', verticalAlign:'middle' }}>
      {children}
    </td>
  );
}

// ─── Name cell ────────────────────────────────────────────────────────────────
function NameCell({ c }: { c:PipelineCandidate }) {
  return (
    <td style={{ padding:'7px 10px', borderBottom:'0.5px solid #f1f5f9', verticalAlign:'middle' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <div style={{ width:26, height:26, borderRadius:'50%', backgroundColor:c.avatarColor, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, flexShrink:0 }}>
          {c.avatarInitials}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:12, color:'#0f172a', whiteSpace:'nowrap' }}>{c.firstName} {c.lastName}</div>
          <div style={{ fontSize:10, color:'#64748b', whiteSpace:'nowrap' }}>{c.jobTitle}</div>
        </div>
        {c.fromReengagement && <REBadge campaignName={c.campaignName} />}
      </div>
    </td>
  );
}

// ─── Stage-specific table ─────────────────────────────────────────────────────
function StageTable({ stage, candidates }: { stage: StageTab; candidates: PipelineCandidate[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = selected.size === candidates.length && candidates.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(candidates.map(c => c.id)));
  };
  const toggleOne = (id:string) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // ── Interview tabs: group by date ──────────────────────────────────────────
  const isInterviewStage = stage.id.startsWith('interview_');

  interface DateGroup { label:string; date:string; rows:PipelineCandidate[] }
  const groups: DateGroup[] = useMemo(() => {
    if (!isInterviewStage) return [];
    const map = new Map<string, PipelineCandidate[]>();
    for (const c of candidates) {
      const key = c.interviewDate ?? 'TBD';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return [...map.entries()]
      .sort(([a],[b]) => a < b ? -1 : 1)
      .map(([date, rows]) => ({ label: date === 'TBD' ? 'TBD' : getDateLabel(date), date, rows }));
  }, [isInterviewStage, candidates]);

  if (candidates.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'60px 0', color:'#94a3b8' }}>
        <CalendarCheck size={36} style={{ opacity:0.3, marginBottom:8 }} />
        <p style={{ fontSize:13, fontWeight:500 }}>No candidates in this stage</p>
      </div>
    );
  }

  // ── Interview columns ──────────────────────────────────────────────────────
  if (isInterviewStage) {
    const round = parseInt(stage.id.slice(-1));
    return (
      <>
        {/* Batch action bar */}
        {selected.size > 0 && (
          <div style={{ backgroundColor:'#1e293b', color:'white', padding:'7px 16px', display:'flex', alignItems:'center', gap:12, fontSize:12 }}>
            <span style={{ fontWeight:600 }}>{selected.size} selected</span>
            <ActionBtn label="Confirm All"    color="#16a34a" />
            {round < 4 && <ActionBtn label={`Advance to ${round+1}th Round`} color="#2d7dd2" icon={<ArrowRight size={10} />} />}
            <ActionBtn label="Send to Offer"  color="#7c3aed" />
            <ActionBtn label="Mark No-Show"   color="#dc2626" />
            <ActionBtn label="Reject"         color="#dc2626" />
            <button onClick={() => setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}>
              <X size={14} />
            </button>
          </div>
        )}

        <div style={{ overflowY:'auto', flex:1 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, zIndex:2 }}>
              <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
                <th style={{ padding:'0 8px', width:28 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} />
                </th>
                <TH>Candidate</TH>
                <TH>Source</TH>
                <TH>Applied</TH>
                <TH>Date</TH>
                <TH>Time</TH>
                <TH>Type</TH>
                <TH>Interviewer</TH>
                <TH>Status</TH>
                <TH>Rating</TH>
                <TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <>
                  {/* Date group header */}
                  <tr key={`g-${group.date}`}>
                    <td colSpan={11} style={{ padding:'8px 10px 4px', backgroundColor:isToday(group.date) ? `${stage.bg}` : '#fafbfc', borderBottom:'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span
                          style={{
                            fontSize:11,
                            fontWeight:800,
                            color: isToday(group.date) ? stage.color : '#475569',
                            textTransform:'uppercase',
                            letterSpacing:'0.06em',
                          }}
                        >
                          {group.label}
                        </span>
                        {isToday(group.date) && (
                          <span style={{ backgroundColor:stage.bg, color:stage.color, border:`0.5px solid ${stage.borderColor}`, borderRadius:10, padding:'1px 8px', fontSize:10, fontWeight:700 }}>
                            TODAY
                          </span>
                        )}
                        <span style={{ fontSize:10, color:'#94a3b8' }}>{group.rows.length} candidate{group.rows.length!==1?'s':''}</span>
                        <span style={{ flex:1, height:'0.5px', backgroundColor:'#e2e8f0', display:'inline-block' }} />
                        <span style={{ fontSize:10, color:'#94a3b8' }}>
                          {group.rows.filter(r => r.interviewConfirmed==='confirmed').length} confirmed ·&nbsp;
                          {group.rows.filter(r => r.interviewConfirmed==='pending').length} pending
                        </span>
                      </div>
                    </td>
                  </tr>
                  {group.rows.map(c => (
                    <tr key={c.id} style={{ backgroundColor: selected.has(c.id) ? `${stage.bg}` : 'white', transition:'background 0.1s' }}>
                      <ChkCell checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} />
                      <NameCell c={c} />
                      <TD><SourceBadge source={c.source} /></TD>
                      <TD muted>{fmtShortDate(c.appliedDate)}</TD>
                      <TD>
                        <span style={{ fontWeight:600, color: isToday(c.interviewDate) ? stage.color : '#374151', fontSize:12 }}>
                          {fmtShortDate(c.interviewDate)}
                        </span>
                      </TD>
                      <TD>
                        <span style={{ fontWeight:600, color:'#374151' }}>{fmt12h(c.interviewTime)}</span>
                      </TD>
                      <TD>
                        <span style={{ display:'flex', alignItems:'center', gap:4, color:'#475569' }}>
                          {IV_TYPE_ICON[c.interviewType ?? 'video']}
                          <span style={{ fontSize:11, textTransform:'capitalize' }}>{c.interviewType}</span>
                        </span>
                      </TD>
                      <TD muted>{c.interviewer}</TD>
                      <TD><ConfirmBadge status={c.interviewConfirmed ?? 'pending'} /></TD>
                      <TD>{c.rating > 0 ? <StarRow rating={c.rating} /> : <span style={{ color:'#cbd5e1', fontSize:10 }}>—</span>}</TD>
                      <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9', verticalAlign:'middle' }}>
                        <div style={{ display:'flex', gap:4, flexWrap:'nowrap' }}>
                          {c.interviewConfirmed === 'pending' && (
                            <ActionBtn label="Confirm" color="#16a34a" icon={<Check size={9} />} />
                          )}
                          {round < 4 && (
                            <ActionBtn label={`→ Round ${round+1}`} color="#2d7dd2" />
                          )}
                          {round === 4 && (
                            <ActionBtn label="Offer" color="#7c3aed" icon={<Award size={9} />} />
                          )}
                          <ActionBtn label="No-show" color="#f59e0b" />
                          <ActionBtn label="Reject" color="#dc2626" icon={<X size={9} />} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Applied table ──────────────────────────────────────────────────────────
  if (stage.id === 'applied') {
    return (
      <>
        {selected.size > 0 && (
          <div style={{ backgroundColor:'#1e293b', color:'white', padding:'7px 16px', display:'flex', alignItems:'center', gap:12, fontSize:12 }}>
            <span style={{ fontWeight:600 }}>{selected.size} selected</span>
            <ActionBtn label="Review Selected"   color="#7c3aed" />
            <ActionBtn label="Push to Call List" color="#2d7dd2" />
            <ActionBtn label="Reject All"        color="#dc2626" />
            <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14} /></button>
          </div>
        )}
        <div style={{ overflowY:'auto', flex:1 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, zIndex:2 }}>
              <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
                <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
                <TH>Candidate</TH><TH>Source</TH><TH>Applied</TH><TH>Days Waiting</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
                  <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
                  <NameCell c={c} />
                  <TD><SourceBadge source={c.source} /></TD>
                  <TD muted>{fmtShortDate(c.appliedDate)}</TD>
                  <TD>
                    <span style={{ color:c.daysInStage>3?'#dc2626':'#374151', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:3 }}>
                      <Clock size={10} />{c.daysInStage}d
                    </span>
                  </TD>
                  <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <ActionBtn label="Review" color="#7c3aed" icon={<UserCheck size={9} />} />
                      <ActionBtn label="Call List" color="#2d7dd2" icon={<ArrowRight size={9} />} />
                      <ActionBtn label="Reject" color="#dc2626" icon={<X size={9} />} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Reviewing table ────────────────────────────────────────────────────────
  if (stage.id === 'reviewing') {
    return (
      <>
        {selected.size > 0 && (
          <div style={{ backgroundColor:'#1e293b', color:'white', padding:'7px 16px', display:'flex', alignItems:'center', gap:12, fontSize:12 }}>
            <span style={{ fontWeight:600 }}>{selected.size} selected</span>
            <ActionBtn label="Push to Call List" color="#2d7dd2" />
            <ActionBtn label="Reject All" color="#dc2626" />
            <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14} /></button>
          </div>
        )}
        <div style={{ overflowY:'auto', flex:1 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, zIndex:2 }}>
              <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
                <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
                <TH>Candidate</TH><TH>Source</TH><TH>Applied</TH><TH>Days in Review</TH><TH>Rating</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
                  <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
                  <NameCell c={c} />
                  <TD><SourceBadge source={c.source} /></TD>
                  <TD muted>{fmtShortDate(c.appliedDate)}</TD>
                  <TD><span style={{ color:c.daysInStage>5?'#dc2626':'#374151', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:3 }}><Clock size={10} />{c.daysInStage}d</span></TD>
                  <TD>{c.rating>0 ? <StarRow rating={c.rating} /> : <span style={{color:'#cbd5e1',fontSize:10}}>—</span>}</TD>
                  <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <ActionBtn label="Call List" color="#2d7dd2" icon={<ArrowRight size={9} />} />
                      <ActionBtn label="Reject" color="#dc2626" icon={<X size={9} />} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Call List table ────────────────────────────────────────────────────────
  if (stage.id === 'call_list') {
    return (
      <>
        {selected.size > 0 && (
          <div style={{ backgroundColor:'#1e293b', color:'white', padding:'7px 16px', display:'flex', alignItems:'center', gap:12, fontSize:12 }}>
            <span style={{ fontWeight:600 }}>{selected.size} selected</span>
            <ActionBtn label="Schedule Interviews" color="#be185d" />
            <ActionBtn label="Remove" color="#dc2626" />
            <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14} /></button>
          </div>
        )}
        <div style={{ overflowY:'auto', flex:1 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, zIndex:2 }}>
              <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
                <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
                <TH>Candidate</TH><TH>Source</TH><TH>Applied</TH><TH>Days on List</TH><TH>Rating</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
                  <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
                  <NameCell c={c} />
                  <TD><SourceBadge source={c.source} /></TD>
                  <TD muted>{fmtShortDate(c.appliedDate)}</TD>
                  <TD><span style={{ color:c.daysInStage>7?'#dc2626':'#374151', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:3 }}><Clock size={10} />{c.daysInStage}d</span></TD>
                  <TD>{c.rating>0 ? <StarRow rating={c.rating} /> : <span style={{color:'#cbd5e1',fontSize:10}}>—</span>}</TD>
                  <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <ActionBtn label="Called" color="#0f766e" icon={<Check size={9} />} />
                      <ActionBtn label="Left Msg" color="#92400e" />
                      <ActionBtn label="Schedule Int." color="#be185d" icon={<CalendarCheck size={9} />} />
                      <ActionBtn label="Remove" color="#dc2626" icon={<X size={9} />} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Contacted table ────────────────────────────────────────────────────────
  if (stage.id === 'contacted') {
    return (
      <>
        {selected.size > 0 && (
          <div style={{ backgroundColor:'#1e293b', color:'white', padding:'7px 16px', display:'flex', alignItems:'center', gap:12, fontSize:12 }}>
            <span style={{ fontWeight:600 }}>{selected.size} selected</span>
            <ActionBtn label="Schedule Interviews" color="#be185d" />
            <ActionBtn label="Remove" color="#dc2626" />
            <button onClick={()=>setSelected(new Set())} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={14} /></button>
          </div>
        )}
        <div style={{ overflowY:'auto', flex:1 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead style={{ position:'sticky', top:0, zIndex:2 }}>
              <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
                <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
                <TH>Candidate</TH><TH>Source</TH><TH>Last Contact</TH><TH>Msgs Left</TH><TH>Days Waiting</TH><TH>Rating</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
                  <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
                  <NameCell c={c} />
                  <TD><SourceBadge source={c.source} /></TD>
                  <TD muted>{fmtShortDate(c.lastContactDate)}</TD>
                  <TD>
                    <span style={{ color:(c.messagesLeft??0)===0?'#dc2626':'#374151', fontWeight:600, fontSize:12 }}>
                      {c.messagesLeft ?? 0}
                    </span>
                  </TD>
                  <TD><span style={{ color:c.daysInStage>7?'#dc2626':'#374151', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', gap:3 }}><Clock size={10} />{c.daysInStage}d</span></TD>
                  <TD>{c.rating>0 ? <StarRow rating={c.rating} /> : <span style={{color:'#cbd5e1',fontSize:10}}>—</span>}</TD>
                  <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <ActionBtn label="Schedule Int." color="#be185d" icon={<CalendarCheck size={9} />} />
                      <ActionBtn label="Follow Up" color="#0f766e" />
                      <ActionBtn label="Remove" color="#dc2626" icon={<X size={9} />} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // ── Offer table ────────────────────────────────────────────────────────────
  if (stage.id === 'offer') {
    return (
      <div style={{ overflowY:'auto', flex:1 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead style={{ position:'sticky', top:0, zIndex:2 }}>
            <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
              <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
              <TH>Candidate</TH><TH>Source</TH><TH>Applied</TH><TH>Offer Date</TH><TH>Amount</TH><TH>Status</TH><TH>Rating</TH><TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
                <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
                <NameCell c={c} />
                <TD><SourceBadge source={c.source} /></TD>
                <TD muted>{fmtShortDate(c.appliedDate)}</TD>
                <TD muted>{fmtShortDate(c.offerDate)}</TD>
                <TD><span style={{ fontWeight:700, color:'#15803d', fontSize:12 }}>{c.offerAmount ?? '—'}</span></TD>
                <TD>
                  {c.offerStatus && (
                    <span style={{
                      backgroundColor: c.offerStatus==='accepted'?'#f0fdf4':c.offerStatus==='countered'?'#fffbeb':c.offerStatus==='declined'?'#fef2f2':'#f8fafc',
                      color:           c.offerStatus==='accepted'?'#16a34a':c.offerStatus==='countered'?'#92400e':c.offerStatus==='declined'?'#dc2626':'#64748b',
                      borderRadius:5, padding:'2px 7px', fontSize:10, fontWeight:700, textTransform:'capitalize',
                    }}>
                      {c.offerStatus}
                    </span>
                  )}
                </TD>
                <TD>{c.rating>0 ? <StarRow rating={c.rating} /> : <span style={{color:'#cbd5e1',fontSize:10}}>—</span>}</TD>
                <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                  <div style={{ display:'flex', gap:4 }}>
                    <ActionBtn label="Accept" color="#16a34a" icon={<Check size={9} />} />
                    <ActionBtn label="Counter" color="#92400e" />
                    <ActionBtn label="Decline" color="#dc2626" icon={<X size={9} />} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Placed table ───────────────────────────────────────────────────────────
  return (
    <div style={{ overflowY:'auto', flex:1 }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead style={{ position:'sticky', top:0, zIndex:2 }}>
          <tr style={{ backgroundColor:'#f8fafc', borderBottom:`1px solid ${stage.borderColor}` }}>
            <th style={{ padding:'0 8px', width:28 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor:'pointer', width:13, height:13 }} /></th>
            <TH>Candidate</TH><TH>Source</TH><TH>Applied</TH><TH>Start Date</TH><TH>Placed By</TH><TH>Rating</TH><TH>Actions</TH>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c.id} style={{ backgroundColor:selected.has(c.id)?stage.bg:'white' }}>
              <ChkCell checked={selected.has(c.id)} onChange={()=>toggleOne(c.id)} />
              <NameCell c={c} />
              <TD><SourceBadge source={c.source} /></TD>
              <TD muted>{fmtShortDate(c.appliedDate)}</TD>
              <TD><span style={{ fontWeight:600, color:'#15803d', fontSize:12 }}>{fmtDate(c.startDate)}</span></TD>
              <TD muted>{c.placedBy ?? '—'}</TD>
              <TD>{c.rating>0 ? <StarRow rating={c.rating} /> : <span style={{color:'#cbd5e1',fontSize:10}}>—</span>}</TD>
              <td style={{ padding:'7px 8px', borderBottom:'0.5px solid #f1f5f9' }}>
                <div style={{ display:'flex', gap:4 }}>
                  <ActionBtn label="Archive" color="#475569" icon={<Briefcase size={9} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Calendar page ────────────────────────────────────────────────────────
export function CalendarPage() {
  const [activeStage, setActiveStage] = useState<PipelineStage>('interview_1');

  const byCounts = useMemo(() => {
    const m = new Map<PipelineStage, number>();
    for (const s of STAGE_TABS) m.set(s.id, 0);
    for (const c of mockPipelineCandidates) m.set(c.stage, (m.get(c.stage) ?? 0) + 1);
    return m;
  }, []);

  const stageCandidates = useMemo(
    () => mockPipelineCandidates.filter(c => c.stage === activeStage),
    [activeStage],
  );

  const currentStage = STAGE_TABS.find(s => s.id === activeStage)!;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 72px)', overflow:'hidden', backgroundColor:'#f1f5f9' }}>

      {/* Stage tab bar */}
      <div
        style={{
          backgroundColor:'white',
          borderBottom:`2px solid ${currentStage.borderColor}`,
          overflowX:'auto',
          flexShrink:0,
          display:'flex',
          alignItems:'stretch',
        }}
      >
        {STAGE_TABS.map((tab, idx) => {
          const isActive  = tab.id === activeStage;
          const count     = byCounts.get(tab.id) ?? 0;
          const isIntRnd  = tab.id.startsWith('interview_');
          const todayCt   = isIntRnd
            ? mockPipelineCandidates.filter(c => c.stage === tab.id && isToday(c.interviewDate)).length
            : 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStage(tab.id)}
              style={{
                border:'none',
                borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                borderRight: idx < STAGE_TABS.length - 1 ? '0.5px solid #f1f5f9' : 'none',
                background: isActive ? tab.bg : 'white',
                cursor:'pointer',
                padding:'10px 16px 8px',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                gap:3,
                minWidth:90,
                flexShrink:0,
                transition:'all 0.15s',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span
                  style={{
                    fontSize:12,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? tab.color : '#475569',
                    whiteSpace:'nowrap',
                  }}
                >
                  {tab.label}
                </span>
                <span
                  style={{
                    backgroundColor: isActive ? tab.color : '#e2e8f0',
                    color: isActive ? 'white' : '#64748b',
                    borderRadius:10,
                    padding:'0 6px',
                    fontSize:10,
                    fontWeight:700,
                    minWidth:16,
                    textAlign:'center',
                  }}
                >
                  {count}
                </span>
              </div>
              {/* Today sub-count for interview tabs */}
              {isIntRnd && todayCt > 0 && (
                <span style={{ fontSize:9, color:isActive ? tab.color : '#94a3b8', fontWeight:600 }}>
                  {todayCt} today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      <SummaryBar stage={currentStage} candidates={stageCandidates} />

      {/* Stage breadcrumb */}
      <div style={{ backgroundColor:'white', borderBottom:'0.5px solid #e2e8f0', padding:'6px 20px', display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
        {STAGE_TABS.map((tab, idx) => {
          const isCurr  = tab.id === activeStage;
          const isPast  = STAGE_TABS.findIndex(t=>t.id===activeStage) > idx;
          return (
            <div key={tab.id} style={{ display:'flex', alignItems:'center' }}>
              <button
                onClick={() => setActiveStage(tab.id)}
                style={{
                  background:'none',
                  border:`0.5px solid ${isCurr ? tab.color : isPast ? '#86efac' : '#e2e8f0'}`,
                  borderRadius:5,
                  padding:'2px 8px',
                  cursor:'pointer',
                  fontSize:10,
                  fontWeight: isCurr ? 700 : 500,
                  color: isCurr ? tab.color : isPast ? '#16a34a' : '#94a3b8',
                  backgroundColor: isCurr ? tab.bg : isPast ? '#f0fdf4' : 'white',
                  whiteSpace:'nowrap',
                }}
              >
                {isPast ? '✓ ' : isCurr ? '● ' : ''}{tab.short}
              </button>
              {idx < STAGE_TABS.length - 1 && (
                <ChevronRight size={10} style={{ color:'#d1d5db', flexShrink:0, margin:'0 1px' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content area */}
      <div style={{ flex:1, overflowY:'hidden', display:'flex', flexDirection:'column', backgroundColor:'white', margin:'12px 16px', borderRadius:10, border:`0.5px solid ${currentStage.borderColor}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        <StageTable stage={currentStage} candidates={stageCandidates} />
        <div style={{ padding:'6px 12px', borderTop:'0.5px solid #f1f5f9', fontSize:11, color:'#94a3b8', backgroundColor:'#fafbfc', flexShrink:0 }}>
          {stageCandidates.length} candidate{stageCandidates.length!==1?'s':''} · {currentStage.label}
          {stageCandidates.filter(c=>c.fromReengagement).length > 0 && (
            <span style={{ marginLeft:8, color:'#7c3aed' }}>
              · {stageCandidates.filter(c=>c.fromReengagement).length} from re-engagement campaigns
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
