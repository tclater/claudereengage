import { useState, useMemo } from 'react';
import { mockCandidates } from '../../data/mockCandidates';
import type { ActiveFilters, Candidate, PassiveFilters } from '../../types/candidate';
import { TabSwitcher } from './TabSwitcher';
import { SummaryCards } from './SummaryCards';
import { InfoBanner } from './InfoBanner';
import { CollapsibleFilterBar } from './CollapsibleFilterBar';
import type { FilterField } from './CollapsibleFilterBar';
import { CandidateTable } from './CandidateTable';

const ACTIVE_FILTER_DEFAULTS: ActiveFilters = {
  status: '',
  jobBoard: '',
  rating: '',
  dateRange: '',
};

const PASSIVE_FILTER_DEFAULTS: PassiveFilters = {
  group: '',
  source: '',
  rating: '',
  lastContact: '',
};

const activeFilterFields: FilterField[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'All statuses', value: '' },
      { label: 'Open', value: 'open' },
      { label: 'Left message', value: 'left_message' },
      { label: 'Interview', value: 'interview' },
    ],
  },
  {
    key: 'jobBoard',
    label: 'Job board',
    options: [
      { label: 'All boards', value: '' },
      { label: 'Indeed', value: 'Indeed' },
      { label: 'ZipRecruiter', value: 'ZipRecruiter' },
      { label: 'LinkedIn', value: 'LinkedIn' },
      { label: 'Referral', value: 'Referral' },
    ],
  },
  {
    key: 'rating',
    label: 'Rating',
    options: [
      { label: 'All ratings', value: '' },
      { label: '3+ stars', value: '3' },
      { label: '4+ stars', value: '4' },
      { label: '5 stars', value: '5' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Date range',
    options: [
      { label: 'Last 14 days', value: '' },
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 30 days', value: '30' },
    ],
  },
];

const passiveFilterFields: FilterField[] = [
  {
    key: 'group',
    label: 'Group',
    options: [
      { label: 'All groups', value: '' },
      { label: 'Re-engage', value: 'reengage' },
      { label: 'Passive sources', value: 'passive_source' },
    ],
  },
  {
    key: 'source',
    label: 'Source',
    options: [
      { label: 'All sources', value: '' },
      { label: 'Past applicant', value: 'Past applicant' },
      { label: 'Referral', value: 'Referral' },
      { label: 'LinkedIn', value: 'LinkedIn' },
    ],
  },
  {
    key: 'rating',
    label: 'Rating',
    options: [
      { label: 'All ratings', value: '' },
      { label: '3+ stars', value: '3' },
      { label: '4+ stars', value: '4' },
    ],
  },
  {
    key: 'lastContact',
    label: 'Last contact',
    options: [
      { label: 'Any time', value: '' },
      { label: '30+ days ago', value: '30' },
      { label: '60+ days ago', value: '60' },
      { label: '90+ days ago', value: '90' },
    ],
  },
];

function sortActive(candidates: Candidate[]): Candidate[] {
  const order: Record<string, number> = { interview: 0, open: 1, left_message: 2 };
  return [...candidates].sort((a, b) => {
    const ao = order[a.status] ?? 99;
    const bo = order[b.status] ?? 99;
    if (ao !== bo) return ao - bo;
    // Within same status: newer dateEntered first
    return (b.dateEntered ?? '').localeCompare(a.dateEntered ?? '');
  });
}

function sortPassive(candidates: Candidate[]): Candidate[] {
  // Re-engage comes before passive_source; within each, oldest lastContact first
  const groupOrder: Record<string, number> = { reengage: 0, passive_source: 1 };
  return [...candidates].sort((a, b) => {
    const ag = groupOrder[a.passiveGroup ?? ''] ?? 99;
    const bg = groupOrder[b.passiveGroup ?? ''] ?? 99;
    if (ag !== bg) return ag - bg;
    return (a.lastContact ?? '').localeCompare(b.lastContact ?? '');
  });
}

export function CallListPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'passive'>('active');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(ACTIVE_FILTER_DEFAULTS);
  const [passiveFilters, setPassiveFilters] = useState<PassiveFilters>(PASSIVE_FILTER_DEFAULTS);

  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  };

  // Classify all candidates per business rules
  const allActive = useMemo(
    () =>
      mockCandidates.filter(
        (c) => c.type === 'active' && (c.status === 'interview' || (c.dateEntered && c.dateEntered >= daysAgo(14)))
      ),
    []
  );

  const allPassive = useMemo(() => mockCandidates.filter((c) => c.type === 'passive'), []);

  // Apply active filters
  const filteredActive = useMemo(() => {
    let list = allActive;
    if (activeFilters.status) list = list.filter((c) => c.status === activeFilters.status);
    if (activeFilters.jobBoard) list = list.filter((c) => c.jobBoard === activeFilters.jobBoard);
    if (activeFilters.rating) list = list.filter((c) => c.rating >= parseInt(activeFilters.rating));
    if (activeFilters.dateRange) list = list.filter((c) => c.dateEntered && c.dateEntered >= daysAgo(parseInt(activeFilters.dateRange)));
    return sortActive(list);
  }, [allActive, activeFilters]);

  // Apply passive filters
  const filteredPassive = useMemo(() => {
    let list = allPassive;
    if (passiveFilters.group) list = list.filter((c) => c.passiveGroup === passiveFilters.group);
    if (passiveFilters.source) list = list.filter((c) => c.source === passiveFilters.source);
    if (passiveFilters.rating) list = list.filter((c) => c.rating >= parseInt(passiveFilters.rating));
    if (passiveFilters.lastContact) {
      const cutoff = daysAgo(parseInt(passiveFilters.lastContact));
      list = list.filter((c) => c.lastContact && c.lastContact <= cutoff);
    }
    return sortPassive(list);
  }, [allPassive, passiveFilters]);

  const handleActiveFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePassiveFilterChange = (key: string, value: string) => {
    setPassiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <TabSwitcher
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={allActive.length}
        passiveCount={allPassive.length}
      />

      <SummaryCards tab={activeTab} candidates={mockCandidates} />

      <InfoBanner type={activeTab} />

      {activeTab === 'active' ? (
        <>
          <CollapsibleFilterBar
            fields={activeFilterFields}
            values={activeFilters as unknown as Record<string, string>}
            onChange={handleActiveFilterChange}
            onClear={() => setActiveFilters(ACTIVE_FILTER_DEFAULTS)}
          />
          <CandidateTable
            tab="active"
            candidates={filteredActive}
            title="Active Candidates"
          />
        </>
      ) : (
        <>
          <CollapsibleFilterBar
            fields={passiveFilterFields}
            values={passiveFilters as unknown as Record<string, string>}
            onChange={handlePassiveFilterChange}
            onClear={() => setPassiveFilters(PASSIVE_FILTER_DEFAULTS)}
          />
          <CandidateTable
            tab="passive"
            candidates={filteredPassive}
            title="Passive Candidates"
          />
        </>
      )}
    </div>
  );
}
