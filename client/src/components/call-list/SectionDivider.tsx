interface Props {
  label: string;
  count: number;
  color?: string;
}

export function SectionDivider({ label, count, color = '#92400e' }: Props) {
  return (
    <tr>
      <td
        colSpan={10}
        style={{
          backgroundColor: '#fef9f0',
          borderTop: '0.5px solid #fde68a',
          borderBottom: '0.5px solid #fde68a',
          padding: '6px 12px',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 700, color, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </span>
          <span
            style={{
              backgroundColor: '#faeeda',
              color: '#633806',
              borderRadius: 10,
              padding: '1px 7px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {count}
          </span>
        </div>
      </td>
    </tr>
  );
}
