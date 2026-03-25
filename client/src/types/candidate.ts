// ─── Call-list candidate types ───────────────────────────────────────────────
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

// ─── Applicant types ──────────────────────────────────────────────────────────
export type ApplicantStatus = 'new' | 'reviewed' | 'pushed' | 'rejected';

// Source classification:
//   Active  → LinkedIn, Indeed
//   Passive → CareerBuilder
export type JobBoard = 'LinkedIn' | 'Indeed' | 'CareerBuilder' | 'ZipRecruiter' | 'Monster' | 'Referral' | 'Direct';

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  jobBoard: JobBoard;
  candidateType: 'active' | 'passive';
  applicationDate: string;  // ISO date
  jobTitle: string;
  status: ApplicantStatus;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  messagesLeft?: number;
  interviewBooked: boolean;
  notes?: string;
}

// ─── Re-engagement / drip campaign types ─────────────────────────────────────
export type CadenceStepType = 'email' | 'sms' | 'task' | 'ai';

export interface CadenceStep {
  id: string;
  day: number;              // day offset from trigger (1-based)
  type: CadenceStepType;
  subject?: string;         // email only
  message: string;
  sendTime: string;         // HH:MM (24-hr)
}

export interface ReengagementTrigger {
  monthsSinceApply: number; // minimum months since original application
  neverBookedInterview: boolean;
}

export interface ReengagementFilters {
  maxMessagesLeft: number | null; // null = no limit
  jobBoards: JobBoard[];          // empty = all boards
  minRating: number;              // 0 = any
  candidateTypes: ('active' | 'passive')[];
}

export interface ReengagementRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: ReengagementTrigger;
  filters: ReengagementFilters;
  cadence: CadenceStep[];
  estimatedReach: number;
  createdAt: string;
  lastRunAt?: string;
}
