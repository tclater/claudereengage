import { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

export interface FilterField {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface Props {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function CollapsibleFilterBar({ fields, values, onChange, onClear }: Props) {
  const [open, setOpen] = useState(false);

  const activeChips = fields
    .filter((f) => values[f.key] && values[f.key] !== '')
    .map((f) => {
      const opt = f.options.find((o) => o.value === values[f.key]);
      return { key: f.key, label: f.label, valueLabel: opt?.label ?? values[f.key] };
    });

  const hasActiveFilters = activeChips.length > 0;

  return (
    <div
      style={{
        border: '0.5px solid #e2e8f0',
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      {/* Toggle row */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Filter size={13} color="#64748b" />
        <span style={{ color: '#64748b', fontWeight: 500 }}>Filters</span>

        {/* Active chips in collapsed bar */}
        {!open && activeChips.length > 0 && (
          <div className="flex items-center gap-1.5 flex-1">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: 20,
                  padding: '1px 8px',
                  fontSize: 12,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {chip.label}: {chip.valueLabel}
              </span>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 12,
                padding: '2px 6px',
              }}
            >
              <X size={11} />
              Clear
            </button>
          )}
          <ChevronDown
            size={14}
            color="#94a3b8"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
            }}
          />
        </div>
      </div>

      {/* Expanded filter body */}
      {open && (
        <div
          style={{
            borderTop: '0.5px solid #e2e8f0',
            padding: '10px 12px',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          {fields.map((field) => (
            <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                {field.label}
              </label>
              <select
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                style={{
                  border: '0.5px solid #d1d5db',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 13,
                  color: '#374151',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: 140,
                }}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            onClick={onClear}
            style={{
              border: '0.5px solid #d1d5db',
              borderRadius: 6,
              padding: '4px 14px',
              background: 'white',
              color: '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              alignSelf: 'flex-end',
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
