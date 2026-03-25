import { useState } from 'react';
import {
  Plus, ToggleLeft, ToggleRight, Pencil, Trash2,
  Mail, MessageSquare, ClipboardList, Zap, Users,
  Clock, ChevronDown, ChevronUp, X, Check, AlertCircle, Bot,
} from 'lucide-react';
import type { ReengagementRule, CadenceStep, CadenceStepType, JobBoard } from '../../types/candidate';
import { mockReengagementRules } from '../../data/mockReengagementRules';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STEP_ICONS: Record<CadenceStepType, React.ReactNode> = {
  email: <Mail size={13} />,
  sms:   <MessageSquare size={13} />,
  task:  <ClipboardList size={13} />,
  ai:    <Bot size={13} />,
};

const STEP_COLORS: Record<CadenceStepType, { bg: string; color: string }> = {
  email: { bg: '#eff6ff', color: '#2563eb' },
  sms:   { bg: '#f0fdf4', color: '#16a34a' },
  task:  { bg: '#fefce8', color: '#92400e' },
  ai:    { bg: '#f5f3ff', color: '#7c3aed' },
};

// What AI can do with a candidate when triggered
const AI_ACTION_OPTIONS = [
  { value: 'personalized_email',    label: 'Draft personalized re-engagement email' },
  { value: 'score_candidate',       label: 'Score & rank candidate for open roles' },
  { value: 'suggest_roles',         label: 'Suggest best-fit open roles' },
  { value: 'summarize_profile',     label: 'Summarize candidate profile for recruiter' },
  { value: 'generate_sms',          label: 'Generate personalized SMS follow-up' },
  { value: 'full_reengagement',     label: 'Full AI-managed re-engagement sequence' },
];

const ALL_BOARDS: JobBoard[] = ['LinkedIn', 'Indeed', 'CareerBuilder', 'ZipRecruiter', 'Monster', 'Referral', 'Direct'];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Empty rule factory ───────────────────────────────────────────────────────
function emptyRule(): ReengagementRule {
  return {
    id: uid(),
    name: '',
    enabled: false,
    trigger: { monthsSinceApply: 3, neverBookedInterview: true },
    filters: { maxMessagesLeft: null, jobBoards: [], minRating: 0, candidateTypes: ['active', 'passive'] },
    cadence: [],
    estimatedReach: 0,
    createdAt: new Date().toISOString(),
  };
}

// ─── Cadence step editor ──────────────────────────────────────────────────────
interface StepEditorProps {
  step: CadenceStep;
  index: number;
  onChange: (updated: CadenceStep) => void;
  onDelete: (id: string) => void;
}

function StepEditor({ step, index, onChange, onDelete }: StepEditorProps) {
  const col = STEP_COLORS[step.type];
  return (
    <div
      style={{
        border: '0.5px solid #e2e8f0',
        borderRadius: 8,
        padding: '12px 14px',
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      {/* Step header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span
          style={{
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: 12,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Step {index + 1}</span>
        <button
          onClick={() => onDelete(step.id)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, display: 'flex' }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '90px 120px 100px 1fr', gap: 10, alignItems: 'start' }}>
        {/* Day */}
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase' }}>Day</label>
          <input
            type="number"
            min={1}
            value={step.day}
            onChange={e => onChange({ ...step, day: parseInt(e.target.value) || 1 })}
            style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
          />
        </div>

        {/* Type */}
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase' }}>Type</label>
          <select
            value={step.type}
            onChange={e => onChange({ ...step, type: e.target.value as CadenceStepType })}
            style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="task">Task</option>
            <option value="ai">Submit to AI</option>
          </select>
        </div>

        {/* Send time — not shown for AI steps */}
        {step.type !== 'ai' && (
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase' }}>Send Time</label>
            <input
              type="time"
              value={step.sendTime}
              onChange={e => onChange({ ...step, sendTime: e.target.value })}
              style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
            />
          </div>
        )}

        {/* Subject (email only) */}
        {step.type === 'email' && (
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase' }}>Subject</label>
            <input
              type="text"
              value={step.subject ?? ''}
              placeholder="Email subject line…"
              onChange={e => onChange({ ...step, subject: e.target.value })}
              style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
            />
          </div>
        )}
      </div>

      {/* AI Step — special config panel */}
      {step.type === 'ai' ? (
        <div
          style={{
            marginTop: 12,
            backgroundColor: '#f5f3ff',
            border: '0.5px solid #ddd6fe',
            borderRadius: 8,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Bot size={14} style={{ color: '#7c3aed' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5b21b6' }}>AI Agent Action</span>
            <span
              style={{
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                borderRadius: 10,
                padding: '1px 7px',
                fontSize: 9,
                fontWeight: 700,
                marginLeft: 4,
              }}
            >
              BETA
            </span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#5b21b6', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>
              What should the AI do?
            </label>
            <select
              value={step.message}
              onChange={e => onChange({ ...step, message: e.target.value })}
              style={{ width: '100%', border: '0.5px solid #c4b5fd', borderRadius: 6, padding: '6px 10px', fontSize: 12, backgroundColor: 'white' }}
            >
              <option value="">Select an action…</option>
              {AI_ACTION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#5b21b6', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>
                Trigger on Day
              </label>
              <input
                type="number"
                min={1}
                value={step.day}
                onChange={e => onChange({ ...step, day: parseInt(e.target.value) || 1 })}
                style={{ width: '100%', border: '0.5px solid #c4b5fd', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#5b21b6', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>
                Time
              </label>
              <input
                type="time"
                value={step.sendTime}
                onChange={e => onChange({ ...step, sendTime: e.target.value })}
                style={{ width: '100%', border: '0.5px solid #c4b5fd', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}
              />
            </div>
          </div>
          <p style={{ fontSize: 10, color: '#7c3aed', margin: '8px 0 0', lineHeight: 1.5 }}>
            The AI agent will automatically analyze the candidate profile, match against open roles, and execute the selected action. Results are available in the AI activity log.
          </p>
        </div>
      ) : (
        /* Message for non-AI steps */
        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 3, textTransform: 'uppercase' }}>
            {step.type === 'task' ? 'Task Description' : 'Message'}
          </label>
          <textarea
            value={step.message}
            onChange={e => onChange({ ...step, message: e.target.value })}
            placeholder={
              step.type === 'task'
                ? 'Describe the manual task to be completed…'
                : 'Use {{firstName}}, {{recruiterName}}, {{company}} as placeholders…'
            }
            rows={3}
            style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '6px 8px', fontSize: 12, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0' }}>
            Available tokens: {'{{firstName}}'} {'{{recruiterName}}'} {'{{company}}'}
          </p>
        </div>
      )}

      {/* Type badge */}
      <div style={{ position: 'absolute', top: 12, right: 36, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span
          style={{
            backgroundColor: col.bg,
            color: col.color,
            borderRadius: 6,
            padding: '2px 7px',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {STEP_ICONS[step.type]}
          {step.type.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ─── Campaign builder (drawer/panel) ─────────────────────────────────────────
interface BuilderProps {
  initial: ReengagementRule | null;
  onSave: (rule: ReengagementRule) => void;
  onClose: () => void;
}

function CampaignBuilder({ initial, onSave, onClose }: BuilderProps) {
  const [rule, setRule] = useState<ReengagementRule>(initial ?? emptyRule());
  const [errors, setErrors] = useState<string[]>([]);

  const setField = <K extends keyof ReengagementRule>(k: K, v: ReengagementRule[K]) =>
    setRule(prev => ({ ...prev, [k]: v }));

  const addStep = () => {
    const last = rule.cadence[rule.cadence.length - 1];
    const newStep: CadenceStep = {
      id: uid(),
      day: last ? last.day + 3 : 1,
      type: 'email',
      subject: '',
      message: '',
      sendTime: '09:00',
    };
    setField('cadence', [...rule.cadence, newStep]);
  };

  const updateStep = (updated: CadenceStep) =>
    setField('cadence', rule.cadence.map(s => s.id === updated.id ? updated : s));

  const deleteStep = (id: string) =>
    setField('cadence', rule.cadence.filter(s => s.id !== id));

  const toggleBoard = (board: JobBoard) => {
    const current = rule.filters.jobBoards;
    const next = current.includes(board)
      ? current.filter(b => b !== board)
      : [...current, board];
    setField('filters', { ...rule.filters, jobBoards: next });
  };

  const toggleCandidateType = (t: 'active' | 'passive') => {
    const current = rule.filters.candidateTypes;
    const next = current.includes(t)
      ? current.filter(c => c !== t)
      : [...current, t];
    setField('filters', { ...rule.filters, candidateTypes: next });
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!rule.name.trim()) errs.push('Campaign name is required.');
    if (rule.cadence.length === 0) errs.push('Add at least one cadence step.');
    if (rule.filters.candidateTypes.length === 0) errs.push('Select at least one candidate type.');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(rule);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 620,
        backgroundColor: 'white',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            {initial ? 'Edit Campaign' : 'New Re-engagement Campaign'}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
            Configure trigger, filters, and message cadence.
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4, display: 'flex' }}>
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {errors.length > 0 && (
          <div style={{ backgroundColor: '#fef2f2', border: '0.5px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            {errors.map(e => (
              <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#dc2626' }}>
                <AlertCircle size={13} /> {e}
              </div>
            ))}
          </div>
        )}

        {/* Name */}
        <section style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campaign Name
          </label>
          <input
            type="text"
            value={rule.name}
            placeholder="e.g. 3-Month No-Contact Drip"
            onChange={e => setField('name', e.target.value)}
            style={{ width: '100%', border: '0.5px solid #d1d5db', borderRadius: 7, padding: '8px 12px', fontSize: 13, boxSizing: 'border-box' }}
          />
        </section>

        {/* Trigger */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} style={{ color: '#f59e0b' }} />
            Trigger Conditions
          </h3>
          <div style={{ backgroundColor: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Months since apply */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={14} style={{ color: '#92400e', flexShrink: 0 }} />
              <label style={{ fontSize: 13, color: '#374151', flexShrink: 0 }}>Months since application:</label>
              <input
                type="number"
                min={1}
                max={36}
                value={rule.trigger.monthsSinceApply}
                onChange={e => setField('trigger', { ...rule.trigger, monthsSinceApply: parseInt(e.target.value) || 1 })}
                style={{ width: 64, border: '0.5px solid #d1d5db', borderRadius: 6, padding: '4px 8px', fontSize: 13, textAlign: 'center' }}
              />
              <span style={{ fontSize: 12, color: '#92400e' }}>month{rule.trigger.monthsSinceApply !== 1 ? 's' : ''} or more</span>
            </div>
            {/* Never booked */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                id="neverBooked"
                checked={rule.trigger.neverBookedInterview}
                onChange={e => setField('trigger', { ...rule.trigger, neverBookedInterview: e.target.checked })}
                style={{ width: 15, height: 15, cursor: 'pointer' }}
              />
              <label htmlFor="neverBooked" style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                Never booked for an interview
              </label>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} style={{ color: '#2d7dd2' }} />
            Candidate Filters
          </h3>
          <div style={{ border: '0.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            {/* Candidate type */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Candidate Type</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['active', 'passive'] as const).map(t => {
                  const active = rule.filters.candidateTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleCandidateType(t)}
                      style={{
                        border: `1px solid ${active ? (t === 'active' ? '#2d7dd2' : '#b05a00') : '#d1d5db'}`,
                        borderRadius: 6,
                        background: active ? (t === 'active' ? '#eff6ff' : '#fff7ed') : 'white',
                        color: active ? (t === 'active' ? '#2d7dd2' : '#b05a00') : '#6b7280',
                        padding: '4px 14px',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {active && <Check size={11} />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job boards */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Job Boards <span style={{ fontWeight: 400, fontSize: 10, color: '#94a3b8' }}>(empty = all boards)</span>
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ALL_BOARDS.map(board => {
                  const selected = rule.filters.jobBoards.includes(board);
                  return (
                    <button
                      key={board}
                      onClick={() => toggleBoard(board)}
                      style={{
                        border: `1px solid ${selected ? '#2d7dd2' : '#d1d5db'}`,
                        borderRadius: 6,
                        background: selected ? '#eff6ff' : 'white',
                        color: selected ? '#2d7dd2' : '#6b7280',
                        padding: '3px 10px',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {selected && <Check size={10} />}
                      {board}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messages left */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Max Messages Previously Left</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="msgLimit"
                  checked={rule.filters.maxMessagesLeft !== null}
                  onChange={e => setField('filters', { ...rule.filters, maxMessagesLeft: e.target.checked ? 2 : null })}
                  style={{ width: 14, height: 14 }}
                />
                <label htmlFor="msgLimit" style={{ fontSize: 12, color: '#374151' }}>Limit to candidates with ≤</label>
                <input
                  type="number"
                  min={0}
                  disabled={rule.filters.maxMessagesLeft === null}
                  value={rule.filters.maxMessagesLeft ?? 0}
                  onChange={e => setField('filters', { ...rule.filters, maxMessagesLeft: parseInt(e.target.value) })}
                  style={{ width: 56, border: '0.5px solid #d1d5db', borderRadius: 6, padding: '3px 8px', fontSize: 12, opacity: rule.filters.maxMessagesLeft === null ? 0.4 : 1 }}
                />
                <span style={{ fontSize: 12, color: '#64748b' }}>prior messages</span>
              </div>
            </div>

            {/* Min rating */}
            <div style={{ padding: '12px 16px' }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Minimum Star Rating</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => setField('filters', { ...rule.filters, minRating: r })}
                    style={{
                      width: 32,
                      height: 32,
                      border: `1px solid ${rule.filters.minRating === r ? '#f59e0b' : '#d1d5db'}`,
                      borderRadius: 6,
                      background: rule.filters.minRating === r ? '#fffbeb' : 'white',
                      color: rule.filters.minRating === r ? '#92400e' : '#6b7280',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {r === 0 ? 'Any' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cadence */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={14} style={{ color: '#7c3aed' }} />
              Message Cadence
            </h3>
            <button
              onClick={addStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#2d7dd2',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Plus size={13} /> Add Step
            </button>
          </div>

          {rule.cadence.length === 0 ? (
            <div
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: 8,
                padding: '28px 0',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: 13,
              }}
            >
              No steps yet — click <strong>Add Step</strong> to build your cadence.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...rule.cadence].sort((a, b) => a.day - b.day).map((step, i) => (
                <StepEditor key={step.id} step={step} index={i} onChange={updateStep} onDelete={deleteStep} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px', borderTop: '0.5px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{ border: '0.5px solid #d1d5db', borderRadius: 7, background: 'white', color: '#374151', padding: '7px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{ backgroundColor: '#2d7dd2', color: 'white', border: 'none', borderRadius: 7, padding: '7px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Check size={14} /> Save Campaign
        </button>
      </div>
    </div>
  );
}

// ─── Campaign card ────────────────────────────────────────────────────────────
interface CardProps {
  rule: ReengagementRule;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function CampaignCard({ rule, onEdit, onDelete, onToggle }: CardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `0.5px solid ${rule.enabled ? '#bfdbfe' : '#e2e8f0'}`,
        borderRadius: 10,
        overflow: 'hidden',
        opacity: rule.enabled ? 1 : 0.8,
      }}
    >
      {/* Card header */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Toggle */}
        <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: rule.enabled ? '#2d7dd2' : '#94a3b8', flexShrink: 0 }}>
          {rule.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{rule.name}</span>
            <span
              style={{
                backgroundColor: rule.enabled ? '#f0fdf4' : '#f8fafc',
                color: rule.enabled ? '#16a34a' : '#94a3b8',
                borderRadius: 10,
                padding: '1px 8px',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {rule.enabled ? '● ACTIVE' : '○ PAUSED'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} />
              {rule.trigger.monthsSinceApply}+ months since apply
            </span>
            {rule.trigger.neverBookedInterview && (
              <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={11} /> Never interviewed
              </span>
            )}
            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={11} />
              ~{rule.estimatedReach} candidates
            </span>
            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageSquare size={11} />
              {rule.cadence.length} step{rule.cadence.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ background: 'none', border: '0.5px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', color: '#64748b', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Collapse' : 'Details'}
          </button>
          <button onClick={onEdit} style={{ background: 'none', border: '0.5px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', color: '#2d7dd2', padding: '5px 7px', display: 'flex' }}>
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} style={{ background: 'none', border: '0.5px solid #fecaca', borderRadius: 6, cursor: 'pointer', color: '#dc2626', padding: '5px 7px', display: 'flex' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: '0.5px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
          {/* Filters summary */}
          <div style={{ padding: '10px 16px', borderBottom: '0.5px solid #f1f5f9', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Boards</span>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#374151' }}>
                {rule.filters.jobBoards.length === 0 ? 'All boards' : rule.filters.jobBoards.join(', ')}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Candidate Type</span>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#374151' }}>
                {rule.filters.candidateTypes.join(' & ')}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Min Rating</span>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#374151' }}>
                {rule.filters.minRating === 0 ? 'Any' : `${rule.filters.minRating}★+`}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Messages Filter</span>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#374151' }}>
                {rule.filters.maxMessagesLeft === null ? 'No limit' : `≤ ${rule.filters.maxMessagesLeft} prior msgs`}
              </p>
            </div>
            {rule.lastRunAt && (
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Last Run</span>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#374151' }}>{formatDate(rule.lastRunAt)}</p>
              </div>
            )}
          </div>

          {/* Cadence timeline */}
          <div style={{ padding: '12px 16px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cadence</p>
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
              {[...rule.cadence].sort((a, b) => a.day - b.day).map((step, idx) => {
                const col = STEP_COLORS[step.type];
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        backgroundColor: col.bg,
                        border: `1px solid ${col.color}22`,
                        borderRadius: 8,
                        padding: '6px 12px',
                        textAlign: 'center',
                        minWidth: 90,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Day {step.day}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 2 }}>
                        <span style={{ color: col.color }}>{STEP_ICONS[step.type]}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: col.color, textTransform: step.type === 'ai' ? 'uppercase' : 'capitalize' }}>
                          {step.type === 'ai' ? 'AI' : step.type}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{step.sendTime}</div>
                    </div>
                    {idx < rule.cadence.length - 1 && (
                      <div style={{ width: 24, height: 1, backgroundColor: '#e2e8f0', flexShrink: 0, position: 'relative' }}>
                        <span style={{ position: 'absolute', right: -3, top: -5, color: '#cbd5e1', fontSize: 10 }}>›</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function ReengagementPage() {
  const [rules, setRules] = useState<ReengagementRule[]>(mockReengagementRules);
  const [editing, setEditing] = useState<ReengagementRule | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSave = (rule: ReengagementRule) => {
    setRules(prev => {
      const exists = prev.find(r => r.id === rule.id);
      return exists ? prev.map(r => r.id === rule.id ? rule : r) : [...prev, rule];
    });
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this campaign?')) setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleToggle = (id: string) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  const activeCount = rules.filter(r => r.enabled).length;
  const totalReach  = rules.filter(r => r.enabled).reduce((s, r) => s + r.estimatedReach, 0);

  const showBuilder = creating || editing !== null;

  return (
    <>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Re-engagement Automation</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>
              Automatically reach out to candidates who applied but were never contacted or booked for an interview.
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setCreating(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#2d7dd2',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <Plus size={15} /> New Campaign
          </button>
        </div>

        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Campaigns', value: rules.length,   icon: <ClipboardList size={16} />, bg: '#f8fafc', color: '#475569' },
            { label: 'Active Campaigns', value: activeCount,   icon: <Zap size={16} />,           bg: '#eff6ff', color: '#2563eb' },
            { label: 'Est. Reach (active)', value: totalReach, icon: <Users size={16} />,          bg: '#f0fdf4', color: '#16a34a' },
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
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{card.value}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works banner */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '0.5px solid #bbf7d0',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 12,
            color: '#166534',
            lineHeight: 1.6,
          }}
        >
          <strong>How it works:</strong> Each campaign watches for candidates who match your trigger (e.g. applied 3+ months ago, no interview booked). When a candidate qualifies, they enter the cadence automatically — receiving emails, SMS messages, or recruiter tasks on your configured schedule. Use the filters to target specific job boards, ratings, or message history.
        </div>

        {/* Campaign list */}
        {rules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <Zap size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>No campaigns yet</p>
            <p style={{ fontSize: 12 }}>Click <strong>New Campaign</strong> to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rules.map(rule => (
              <CampaignCard
                key={rule.id}
                rule={rule}
                onEdit={() => { setCreating(false); setEditing(rule); }}
                onDelete={() => handleDelete(rule.id)}
                onToggle={() => handleToggle(rule.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Builder overlay backdrop */}
      {showBuilder && (
        <div
          onClick={() => { setEditing(null); setCreating(false); }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.35)', zIndex: 99 }}
        />
      )}

      {/* Builder drawer */}
      {showBuilder && (
        <CampaignBuilder
          initial={editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}
    </>
  );
}
