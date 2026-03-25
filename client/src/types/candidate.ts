export type CandidateStatus = 'open' | 'left_message' | 'interview' | 'removed' | 'on_hold';
export type PassiveStatus = 'reengage' | 'passive_source';
export type CandidateType = 'active' | 'passive';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  status: CandidateStatus | PassiveStatus;
  type: CandidateType;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  jobBoard?: string;
  source?: string;
  dateEntered?: string;   // ISO date — active
  lastContact?: string;   // ISO date — passive
  passiveGroup?: 'reengage' | 'passive_source';
}

export interface ActiveFilters {
  status: string;
  jobBoard: string;
  rating: string;
  dateRange: string;
}

export interface PassiveFilters {
  group: string;
  source: string;
  rating: string;
  lastContact: string;
}
