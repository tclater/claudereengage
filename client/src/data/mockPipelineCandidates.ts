export type PipelineStage =
  | 'applied'
  | 'reviewing'
  | 'call_list'
  | 'contacted'
  | 'interview'
  | 'offer'
  | 'placed';

export interface PipelineCandidate {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  source: string;        // Job board name
  sourceType: 'active' | 'passive';
  stage: PipelineStage;
  daysInStage: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  // Reengagement campaign flag
  fromReengagement: boolean;
  campaignName?: string;
  avatarInitials: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  '#2d7dd2', '#7c3aed', '#16a34a', '#dc2626',
  '#d97706', '#0891b2', '#be185d', '#0f766e',
];
let colorIdx = 0;
const nextColor = () => AVATAR_COLORS[colorIdx++ % AVATAR_COLORS.length];

const initials = (first: string, last: string) =>
  `${first[0]}${last[0]}`.toUpperCase();

export const mockPipelineCandidates: PipelineCandidate[] = [
  // ── Applied ────────────────────────────────────────────────────────────────
  {
    id: 'p1', firstName: 'Jordan',    lastName: 'Reyes',    jobTitle: 'Senior Recruiter',
    source: 'LinkedIn', sourceType: 'active', stage: 'applied', daysInStage: 1,
    rating: 0, fromReengagement: false,
    avatarInitials: initials('Jordan','Reyes'), avatarColor: nextColor(),
  },
  {
    id: 'p2', firstName: 'Aaliyah',   lastName: 'Washington', jobTitle: 'Staffing Coordinator',
    source: 'LinkedIn', sourceType: 'active', stage: 'applied', daysInStage: 1,
    rating: 0, fromReengagement: false,
    avatarInitials: initials('Aaliyah','Washington'), avatarColor: nextColor(),
  },
  {
    id: 'p3', firstName: 'Nina',      lastName: 'Patel',      jobTitle: 'Recruiter',
    source: 'Indeed', sourceType: 'active', stage: 'applied', daysInStage: 1,
    rating: 0, fromReengagement: false,
    avatarInitials: initials('Nina','Patel'), avatarColor: nextColor(),
  },
  {
    id: 'p4', firstName: 'Carlos',    lastName: 'Mendez',     jobTitle: 'Recruiter',
    source: 'CareerBuilder', sourceType: 'passive', stage: 'applied', daysInStage: 45,
    rating: 0, fromReengagement: false,
    avatarInitials: initials('Carlos','Mendez'), avatarColor: nextColor(),
  },

  // ── Reviewing ──────────────────────────────────────────────────────────────
  {
    id: 'p5', firstName: 'Simone',    lastName: 'Laurent',    jobTitle: 'Talent Acquisition Specialist',
    source: 'LinkedIn', sourceType: 'active', stage: 'reviewing', daysInStage: 2,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('Simone','Laurent'), avatarColor: nextColor(),
  },
  {
    id: 'p6', firstName: 'Thomas',    lastName: 'Nguyen',     jobTitle: 'Talent Acquisition Partner',
    source: 'Indeed', sourceType: 'active', stage: 'reviewing', daysInStage: 2,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('Thomas','Nguyen'), avatarColor: nextColor(),
  },
  {
    id: 'p7', firstName: 'Jasmine',   lastName: 'Hall',       jobTitle: 'HR Generalist',
    source: 'CareerBuilder', sourceType: 'passive', stage: 'reviewing', daysInStage: 3,
    rating: 3, fromReengagement: true, campaignName: '3-Month No-Contact Drip',
    avatarInitials: initials('Jasmine','Hall'), avatarColor: nextColor(),
  },
  {
    id: 'p8', firstName: 'Darius',    lastName: 'Brooks',     jobTitle: 'Sourcing Specialist',
    source: 'Indeed', sourceType: 'active', stage: 'reviewing', daysInStage: 5,
    rating: 3, fromReengagement: false,
    avatarInitials: initials('Darius','Brooks'), avatarColor: nextColor(),
  },

  // ── Call List ──────────────────────────────────────────────────────────────
  {
    id: 'p9',  firstName: 'Ethan',    lastName: 'Russo',      jobTitle: 'Senior Recruiter',
    source: 'LinkedIn', sourceType: 'active', stage: 'call_list', daysInStage: 1,
    rating: 5, fromReengagement: false,
    avatarInitials: initials('Ethan','Russo'), avatarColor: nextColor(),
  },
  {
    id: 'p10', firstName: 'Tiffany',  lastName: 'Ross',       jobTitle: 'HR Coordinator',
    source: 'CareerBuilder', sourceType: 'passive', stage: 'call_list', daysInStage: 2,
    rating: 4, fromReengagement: true, campaignName: 'CareerBuilder 6-Month Revival',
    avatarInitials: initials('Tiffany','Ross'), avatarColor: nextColor(),
  },
  {
    id: 'p11', firstName: 'Priya',    lastName: 'Patel',      jobTitle: 'Open',
    source: 'LinkedIn', sourceType: 'active', stage: 'call_list', daysInStage: 7,
    rating: 5, fromReengagement: false,
    avatarInitials: initials('Priya','Patel'), avatarColor: nextColor(),
  },
  {
    id: 'p12', firstName: 'Marcus',   lastName: 'Williams',   jobTitle: 'Open',
    source: 'Indeed', sourceType: 'active', stage: 'call_list', daysInStage: 3,
    rating: 3, fromReengagement: false,
    avatarInitials: initials('Marcus','Williams'), avatarColor: nextColor(),
  },

  // ── Contacted ──────────────────────────────────────────────────────────────
  {
    id: 'p13', firstName: 'Robert',   lastName: 'Garcia',     jobTitle: 'Open',
    source: 'Past applicant', sourceType: 'passive', stage: 'contacted', daysInStage: 3,
    rating: 4, fromReengagement: true, campaignName: '3-Month No-Contact Drip',
    avatarInitials: initials('Robert','Garcia'), avatarColor: nextColor(),
  },
  {
    id: 'p14', firstName: 'Lisa',     lastName: 'Nguyen',     jobTitle: 'Open',
    source: 'Past applicant', sourceType: 'passive', stage: 'contacted', daysInStage: 2,
    rating: 5, fromReengagement: true, campaignName: '3-Month No-Contact Drip',
    avatarInitials: initials('Lisa','Nguyen'), avatarColor: nextColor(),
  },
  {
    id: 'p15', firstName: 'Derek',    lastName: 'Johnson',    jobTitle: 'Left Message',
    source: 'Indeed', sourceType: 'active', stage: 'contacted', daysInStage: 4,
    rating: 3, fromReengagement: false,
    avatarInitials: initials('Derek','Johnson'), avatarColor: nextColor(),
  },
  {
    id: 'p16', firstName: 'Monica',   lastName: 'Crawford',   jobTitle: 'Staffing Manager',
    source: 'CareerBuilder', sourceType: 'passive', stage: 'contacted', daysInStage: 1,
    rating: 4, fromReengagement: true, campaignName: 'CareerBuilder 6-Month Revival',
    avatarInitials: initials('Monica','Crawford'), avatarColor: nextColor(),
  },
  {
    id: 'p17', firstName: 'Aisha',    lastName: 'Thompson',   jobTitle: 'Left Message',
    source: 'ZipRecruiter', sourceType: 'active', stage: 'contacted', daysInStage: 9,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('Aisha','Thompson'), avatarColor: nextColor(),
  },

  // ── Interview ──────────────────────────────────────────────────────────────
  {
    id: 'p18', firstName: 'Sarah',    lastName: 'Mitchell',   jobTitle: 'Senior Recruiter',
    source: 'Indeed', sourceType: 'active', stage: 'interview', daysInStage: 2,
    rating: 5, fromReengagement: false,
    avatarInitials: initials('Sarah','Mitchell'), avatarColor: nextColor(),
  },
  {
    id: 'p19', firstName: 'James',    lastName: 'Ortega',     jobTitle: 'Recruiter',
    source: 'Referral', sourceType: 'active', stage: 'interview', daysInStage: 5,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('James','Ortega'), avatarColor: nextColor(),
  },
  {
    id: 'p20', firstName: 'Yuki',     lastName: 'Tanaka',     jobTitle: 'Talent Acquisition',
    source: 'Past applicant', sourceType: 'passive', stage: 'interview', daysInStage: 1,
    rating: 4, fromReengagement: true, campaignName: 'LinkedIn 90-Day High-Raters',
    avatarInitials: initials('Yuki','Tanaka'), avatarColor: nextColor(),
  },

  // ── Offer ──────────────────────────────────────────────────────────────────
  {
    id: 'p21', firstName: 'Emily',    lastName: 'Chen',       jobTitle: 'HR Generalist',
    source: 'ZipRecruiter', sourceType: 'active', stage: 'offer', daysInStage: 1,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('Emily','Chen'), avatarColor: nextColor(),
  },
  {
    id: 'p22', firstName: 'Brandon',  lastName: 'Foster',     jobTitle: 'Recruiter',
    source: 'Referral', sourceType: 'passive', stage: 'offer', daysInStage: 3,
    rating: 3, fromReengagement: true, campaignName: '3-Month No-Contact Drip',
    avatarInitials: initials('Brandon','Foster'), avatarColor: nextColor(),
  },

  // ── Placed ─────────────────────────────────────────────────────────────────
  {
    id: 'p23', firstName: 'Fatima',   lastName: 'Al-Hassan',  jobTitle: 'Sr. Recruiter',
    source: 'Indeed', sourceType: 'active', stage: 'placed', daysInStage: 0,
    rating: 4, fromReengagement: false,
    avatarInitials: initials('Fatima','Al-Hassan'), avatarColor: nextColor(),
  },
  {
    id: 'p24', firstName: 'Michael',  lastName: 'Stevens',    jobTitle: 'Sourcing Specialist',
    source: 'Past applicant', sourceType: 'passive', stage: 'placed', daysInStage: 0,
    rating: 3, fromReengagement: true, campaignName: '3-Month No-Contact Drip',
    avatarInitials: initials('Michael','Stevens'), avatarColor: nextColor(),
  },
];
