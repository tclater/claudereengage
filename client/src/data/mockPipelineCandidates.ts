export type PipelineStage =
  | 'applied'
  | 'reviewing'
  | 'call_list'
  | 'contacted'
  | 'interview_1'
  | 'interview_2'
  | 'interview_3'
  | 'interview_4'
  | 'offer'
  | 'placed';

export type InterviewType = 'video' | 'phone' | 'in-person';
export type InterviewConfirmed = 'confirmed' | 'pending' | 'no-show' | 'cancelled';

export interface PipelineCandidate {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  source: string;
  sourceType: 'active' | 'passive';
  stage: PipelineStage;
  appliedDate: string;       // ISO date
  daysInStage: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  fromReengagement: boolean;
  campaignName?: string;
  avatarInitials: string;
  avatarColor: string;
  // Interview-specific fields
  interviewDate?: string;     // ISO date (YYYY-MM-DD)
  interviewTime?: string;     // HH:MM
  interviewType?: InterviewType;
  interviewer?: string;
  interviewConfirmed?: InterviewConfirmed;
  interviewNotes?: string;
  // Offer-specific
  offerDate?: string;
  offerAmount?: string;
  offerStatus?: 'pending' | 'accepted' | 'countered' | 'declined';
  // Placed-specific
  startDate?: string;
  placedBy?: string;
  // Contact info
  lastContactDate?: string;
  messagesLeft?: number;
}

const AVATAR_COLORS = [
  '#2d7dd2', '#7c3aed', '#16a34a', '#dc2626',
  '#d97706', '#0891b2', '#be185d', '#0f766e',
  '#9333ea', '#0369a1', '#b45309', '#047857',
];
let colorIdx = 0;
const nextColor = () => AVATAR_COLORS[colorIdx++ % AVATAR_COLORS.length];
const initials = (f: string, l: string) => `${f[0]}${l[0]}`.toUpperCase();

const today   = new Date();
const dateStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};
const daysAgoStr = (n: number) => dateStr(-n);

const INTERVIEWERS = [
  'J. Rivera', 'M. Chen', 'S. Patel', 'K. Thompson',
  'D. Williams', 'A. Johnson', 'R. Martinez', 'L. Davis',
];
const iv = (n: number) => INTERVIEWERS[n % INTERVIEWERS.length];

export const mockPipelineCandidates: PipelineCandidate[] = [
  // ── Applied ────────────────────────────────────────────────────────────────
  { id:'p1',  firstName:'Jordan',    lastName:'Reyes',       jobTitle:'Senior Recruiter',
    source:'LinkedIn',     sourceType:'active',  stage:'applied',     appliedDate:daysAgoStr(1),  daysInStage:1,  rating:0, fromReengagement:false, avatarInitials:initials('Jordan','Reyes'),       avatarColor:nextColor() },
  { id:'p2',  firstName:'Aaliyah',   lastName:'Washington',  jobTitle:'Staffing Coordinator',
    source:'LinkedIn',     sourceType:'active',  stage:'applied',     appliedDate:daysAgoStr(1),  daysInStage:1,  rating:0, fromReengagement:false, avatarInitials:initials('Aaliyah','Washington'),  avatarColor:nextColor() },
  { id:'p3',  firstName:'Nina',      lastName:'Patel',       jobTitle:'Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'applied',     appliedDate:daysAgoStr(1),  daysInStage:1,  rating:0, fromReengagement:false, avatarInitials:initials('Nina','Patel'),          avatarColor:nextColor() },
  { id:'p4',  firstName:'Carlos',    lastName:'Mendez',      jobTitle:'Recruiter',
    source:'CareerBuilder',sourceType:'passive', stage:'applied',     appliedDate:daysAgoStr(45), daysInStage:45, rating:0, fromReengagement:false, avatarInitials:initials('Carlos','Mendez'),       avatarColor:nextColor() },
  { id:'p4b', firstName:'Grace',     lastName:'Kim',         jobTitle:'HR Coordinator',
    source:'Indeed',       sourceType:'active',  stage:'applied',     appliedDate:daysAgoStr(2),  daysInStage:2,  rating:0, fromReengagement:false, avatarInitials:initials('Grace','Kim'),           avatarColor:nextColor() },

  // ── Reviewing ──────────────────────────────────────────────────────────────
  { id:'p5',  firstName:'Simone',    lastName:'Laurent',     jobTitle:'Talent Acquisition Specialist',
    source:'LinkedIn',     sourceType:'active',  stage:'reviewing',   appliedDate:daysAgoStr(4),  daysInStage:2,  rating:4, fromReengagement:false, avatarInitials:initials('Simone','Laurent'),      avatarColor:nextColor() },
  { id:'p6',  firstName:'Thomas',    lastName:'Nguyen',      jobTitle:'Talent Acquisition Partner',
    source:'Indeed',       sourceType:'active',  stage:'reviewing',   appliedDate:daysAgoStr(4),  daysInStage:2,  rating:4, fromReengagement:false, avatarInitials:initials('Thomas','Nguyen'),       avatarColor:nextColor() },
  { id:'p7',  firstName:'Jasmine',   lastName:'Hall',        jobTitle:'HR Generalist',
    source:'CareerBuilder',sourceType:'passive', stage:'reviewing',   appliedDate:daysAgoStr(60), daysInStage:3,  rating:3, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Jasmine','Hall'),        avatarColor:nextColor() },
  { id:'p8',  firstName:'Darius',    lastName:'Brooks',      jobTitle:'Sourcing Specialist',
    source:'Indeed',       sourceType:'active',  stage:'reviewing',   appliedDate:daysAgoStr(7),  daysInStage:5,  rating:3, fromReengagement:false, avatarInitials:initials('Darius','Brooks'),       avatarColor:nextColor() },

  // ── Call List ──────────────────────────────────────────────────────────────
  { id:'p9',  firstName:'Ethan',     lastName:'Russo',       jobTitle:'Senior Recruiter',
    source:'LinkedIn',     sourceType:'active',  stage:'call_list',   appliedDate:daysAgoStr(3),  daysInStage:1,  rating:5, fromReengagement:false, avatarInitials:initials('Ethan','Russo'),         avatarColor:nextColor() },
  { id:'p10', firstName:'Tiffany',   lastName:'Ross',        jobTitle:'HR Coordinator',
    source:'CareerBuilder',sourceType:'passive', stage:'call_list',   appliedDate:daysAgoStr(75), daysInStage:2,  rating:4, fromReengagement:true,  campaignName:'CareerBuilder 6-Month Revival', avatarInitials:initials('Tiffany','Ross'),        avatarColor:nextColor() },
  { id:'p11', firstName:'Priya',     lastName:'Patel',       jobTitle:'Sr. Recruiter',
    source:'LinkedIn',     sourceType:'active',  stage:'call_list',   appliedDate:daysAgoStr(9),  daysInStage:7,  rating:5, fromReengagement:false, avatarInitials:initials('Priya','Patel'),         avatarColor:nextColor() },
  { id:'p12', firstName:'Marcus',    lastName:'Williams',    jobTitle:'Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'call_list',   appliedDate:daysAgoStr(5),  daysInStage:3,  rating:3, fromReengagement:false, avatarInitials:initials('Marcus','Williams'),     avatarColor:nextColor() },

  // ── Contacted ──────────────────────────────────────────────────────────────
  { id:'p13', firstName:'Robert',    lastName:'Garcia',      jobTitle:'Sr. Recruiter',
    source:'Past applicant',sourceType:'passive',stage:'contacted',  appliedDate:daysAgoStr(95), daysInStage:3,  rating:4, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Robert','Garcia'),       avatarColor:nextColor(), lastContactDate:daysAgoStr(3), messagesLeft:1 },
  { id:'p14', firstName:'Lisa',      lastName:'Nguyen',      jobTitle:'Talent Acquisition',
    source:'Past applicant',sourceType:'passive',stage:'contacted',  appliedDate:daysAgoStr(67), daysInStage:2,  rating:5, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Lisa','Nguyen'),         avatarColor:nextColor(), lastContactDate:daysAgoStr(2), messagesLeft:0 },
  { id:'p15', firstName:'Derek',     lastName:'Johnson',     jobTitle:'Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'contacted',   appliedDate:daysAgoStr(6),  daysInStage:4,  rating:3, fromReengagement:false, avatarInitials:initials('Derek','Johnson'),       avatarColor:nextColor(), lastContactDate:daysAgoStr(4), messagesLeft:2 },
  { id:'p16', firstName:'Monica',    lastName:'Crawford',    jobTitle:'Staffing Manager',
    source:'CareerBuilder',sourceType:'passive', stage:'contacted',   appliedDate:daysAgoStr(30), daysInStage:1,  rating:4, fromReengagement:true,  campaignName:'CareerBuilder 6-Month Revival', avatarInitials:initials('Monica','Crawford'),     avatarColor:nextColor(), lastContactDate:daysAgoStr(1), messagesLeft:3 },
  { id:'p17', firstName:'Aisha',     lastName:'Thompson',    jobTitle:'HR Specialist',
    source:'ZipRecruiter', sourceType:'active',  stage:'contacted',   appliedDate:daysAgoStr(11), daysInStage:9,  rating:4, fromReengagement:false, avatarInitials:initials('Aisha','Thompson'),      avatarColor:nextColor(), lastContactDate:daysAgoStr(9), messagesLeft:1 },

  // ── 1st Interview ──────────────────────────────────────────────────────────
  { id:'i1a', firstName:'Sarah',     lastName:'Mitchell',    jobTitle:'Senior Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(8),  daysInStage:2,  rating:5, fromReengagement:false, avatarInitials:initials('Sarah','Mitchell'),      avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'09:00', interviewType:'video',     interviewer:iv(0), interviewConfirmed:'confirmed' },
  { id:'i1b', firstName:'James',     lastName:'Ortega',      jobTitle:'Recruiter',
    source:'Referral',     sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(7),  daysInStage:1,  rating:4, fromReengagement:false, avatarInitials:initials('James','Ortega'),        avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'09:30', interviewType:'phone',     interviewer:iv(1), interviewConfirmed:'confirmed' },
  { id:'i1c', firstName:'Yuki',      lastName:'Tanaka',      jobTitle:'Talent Acquisition',
    source:'Past applicant',sourceType:'passive',stage:'interview_1', appliedDate:daysAgoStr(32), daysInStage:1,  rating:4, fromReengagement:true,  campaignName:'LinkedIn 90-Day High-Raters', avatarInitials:initials('Yuki','Tanaka'),         avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'10:00', interviewType:'video',     interviewer:iv(2), interviewConfirmed:'confirmed' },
  { id:'i1d', firstName:'Natalie',   lastName:'Brooks',      jobTitle:'HR Generalist',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(5),  daysInStage:1,  rating:3, fromReengagement:false, avatarInitials:initials('Natalie','Brooks'),      avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'10:30', interviewType:'video',     interviewer:iv(3), interviewConfirmed:'pending' },
  { id:'i1e', firstName:'David',     lastName:'Kim',         jobTitle:'Recruiter',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(4),  daysInStage:1,  rating:4, fromReengagement:false, avatarInitials:initials('David','Kim'),           avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'11:00', interviewType:'in-person', interviewer:iv(4), interviewConfirmed:'pending' },
  { id:'i1f', firstName:'Amanda',    lastName:'Torres',      jobTitle:'Sourcing Specialist',
    source:'CareerBuilder',sourceType:'passive', stage:'interview_1',  appliedDate:daysAgoStr(60), daysInStage:2,  rating:3, fromReengagement:true,  campaignName:'CareerBuilder 6-Month Revival', avatarInitials:initials('Amanda','Torres'),       avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'11:30', interviewType:'phone',     interviewer:iv(5), interviewConfirmed:'confirmed' },
  { id:'i1g', firstName:'Kevin',     lastName:'Park',        jobTitle:'HR Coordinator',
    source:'Indeed',       sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(3),  daysInStage:1,  rating:3, fromReengagement:false, avatarInitials:initials('Kevin','Park'),          avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'09:00', interviewType:'video',     interviewer:iv(6), interviewConfirmed:'pending' },
  { id:'i1h', firstName:'Olivia',    lastName:'Reed',        jobTitle:'Talent Acquisition',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(4),  daysInStage:1,  rating:4, fromReengagement:false, avatarInitials:initials('Olivia','Reed'),         avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'09:30', interviewType:'in-person', interviewer:iv(7), interviewConfirmed:'confirmed' },
  { id:'i1i', firstName:'Tyler',     lastName:'Mason',       jobTitle:'Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(3),  daysInStage:1,  rating:2, fromReengagement:false, avatarInitials:initials('Tyler','Mason'),         avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'10:00', interviewType:'phone',     interviewer:iv(0), interviewConfirmed:'pending' },
  { id:'i1j', firstName:'Rosa',      lastName:'Alvarez',     jobTitle:'Sr. Recruiter',
    source:'CareerBuilder',sourceType:'passive', stage:'interview_1',  appliedDate:daysAgoStr(90), daysInStage:1,  rating:4, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Rosa','Alvarez'),        avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'10:30', interviewType:'video',     interviewer:iv(1), interviewConfirmed:'confirmed' },
  { id:'i1k', firstName:'Marcus',    lastName:'Lee',         jobTitle:'Recruiter',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(5),  daysInStage:2,  rating:3, fromReengagement:false, avatarInitials:initials('Marcus','Lee'),          avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'09:00', interviewType:'video',     interviewer:iv(2), interviewConfirmed:'pending' },
  { id:'i1l', firstName:'Chloe',     lastName:'Fernandez',   jobTitle:'HR Specialist',
    source:'Indeed',       sourceType:'active',  stage:'interview_1',  appliedDate:daysAgoStr(4),  daysInStage:1,  rating:4, fromReengagement:false, avatarInitials:initials('Chloe','Fernandez'),     avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'09:30', interviewType:'phone',     interviewer:iv(3), interviewConfirmed:'pending' },

  // ── 2nd Interview ──────────────────────────────────────────────────────────
  { id:'i2a', firstName:'Emily',     lastName:'Chen',        jobTitle:'HR Generalist',
    source:'ZipRecruiter', sourceType:'active',  stage:'interview_2',  appliedDate:daysAgoStr(14), daysInStage:3,  rating:4, fromReengagement:false, avatarInitials:initials('Emily','Chen'),          avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'13:00', interviewType:'in-person', interviewer:iv(4), interviewConfirmed:'confirmed' },
  { id:'i2b', firstName:'Brandon',   lastName:'Foster',      jobTitle:'Recruiter',
    source:'Referral',     sourceType:'passive', stage:'interview_2',  appliedDate:daysAgoStr(45), daysInStage:2,  rating:3, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Brandon','Foster'),      avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'14:00', interviewType:'video',     interviewer:iv(5), interviewConfirmed:'confirmed' },
  { id:'i2c', firstName:'Priya',     lastName:'Singh',       jobTitle:'Talent Acquisition',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_2',  appliedDate:daysAgoStr(12), daysInStage:2,  rating:5, fromReengagement:false, avatarInitials:initials('Priya','Singh'),         avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'15:00', interviewType:'in-person', interviewer:iv(6), interviewConfirmed:'confirmed' },
  { id:'i2d', firstName:'Alex',      lastName:'Morgan',      jobTitle:'Sr. Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'interview_2',  appliedDate:daysAgoStr(10), daysInStage:2,  rating:4, fromReengagement:false, avatarInitials:initials('Alex','Morgan'),         avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'13:00', interviewType:'video',     interviewer:iv(7), interviewConfirmed:'pending' },
  { id:'i2e', firstName:'Jordan',    lastName:'Blake',       jobTitle:'HR Coordinator',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_2',  appliedDate:daysAgoStr(11), daysInStage:3,  rating:3, fromReengagement:false, avatarInitials:initials('Jordan','Blake'),        avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'14:00', interviewType:'phone',     interviewer:iv(0), interviewConfirmed:'pending' },
  { id:'i2f', firstName:'Mia',       lastName:'Nguyen',      jobTitle:'Sourcing Specialist',
    source:'CareerBuilder',sourceType:'passive', stage:'interview_2',  appliedDate:daysAgoStr(60), daysInStage:2,  rating:4, fromReengagement:true,  campaignName:'CareerBuilder 6-Month Revival', avatarInitials:initials('Mia','Nguyen'),          avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'13:30', interviewType:'video',     interviewer:iv(1), interviewConfirmed:'pending' },
  { id:'i2g', firstName:'Chris',     lastName:'Harper',      jobTitle:'Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'interview_2',  appliedDate:daysAgoStr(9),  daysInStage:2,  rating:3, fromReengagement:false, avatarInitials:initials('Chris','Harper'),        avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'15:00', interviewType:'in-person', interviewer:iv(2), interviewConfirmed:'confirmed' },

  // ── 3rd Interview ──────────────────────────────────────────────────────────
  { id:'i3a', firstName:'Connor',    lastName:'Walsh',       jobTitle:'Senior Recruiter',
    source:'Referral',     sourceType:'active',  stage:'interview_3',  appliedDate:daysAgoStr(18), daysInStage:2,  rating:4, fromReengagement:false, avatarInitials:initials('Connor','Walsh'),        avatarColor:nextColor(), interviewDate:dateStr(0),  interviewTime:'16:00', interviewType:'in-person', interviewer:iv(3), interviewConfirmed:'confirmed' },
  { id:'i3b', firstName:'Fatima',    lastName:'Al-Hassan',   jobTitle:'Talent Acquisition',
    source:'Indeed',       sourceType:'active',  stage:'interview_3',  appliedDate:daysAgoStr(20), daysInStage:2,  rating:5, fromReengagement:false, avatarInitials:initials('Fatima','Al-Hassan'),    avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'15:00', interviewType:'video',     interviewer:iv(4), interviewConfirmed:'pending' },
  { id:'i3c', firstName:'Michael',   lastName:'Stevens',     jobTitle:'Sr. Recruiter',
    source:'Past applicant',sourceType:'passive',stage:'interview_3', appliedDate:daysAgoStr(120),daysInStage:1,  rating:3, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Michael','Stevens'),     avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'14:00', interviewType:'phone',     interviewer:iv(5), interviewConfirmed:'confirmed' },
  { id:'i3d', firstName:'Rachel',    lastName:'Kim',         jobTitle:'HR Director',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_3',  appliedDate:daysAgoStr(22), daysInStage:3,  rating:5, fromReengagement:false, avatarInitials:initials('Rachel','Kim'),          avatarColor:nextColor(), interviewDate:dateStr(3),  interviewTime:'10:00', interviewType:'in-person', interviewer:iv(6), interviewConfirmed:'pending' },

  // ── 4th Interview ──────────────────────────────────────────────────────────
  { id:'i4a', firstName:'Samuel',    lastName:'Price',       jobTitle:'VP of Talent',
    source:'LinkedIn',     sourceType:'active',  stage:'interview_4',  appliedDate:daysAgoStr(30), daysInStage:2,  rating:5, fromReengagement:false, avatarInitials:initials('Samuel','Price'),        avatarColor:nextColor(), interviewDate:dateStr(1),  interviewTime:'16:00', interviewType:'in-person', interviewer:iv(7), interviewConfirmed:'confirmed' },
  { id:'i4b', firstName:'Diana',     lastName:'Ross',        jobTitle:'Director of HR',
    source:'Referral',     sourceType:'active',  stage:'interview_4',  appliedDate:daysAgoStr(28), daysInStage:3,  rating:5, fromReengagement:false, avatarInitials:initials('Diana','Ross'),          avatarColor:nextColor(), interviewDate:dateStr(2),  interviewTime:'15:00', interviewType:'in-person', interviewer:iv(0), interviewConfirmed:'pending' },

  // ── Offer ──────────────────────────────────────────────────────────────────
  { id:'o1',  firstName:'Emily',     lastName:'Chen',        jobTitle:'HR Generalist',
    source:'ZipRecruiter', sourceType:'active',  stage:'offer',        appliedDate:daysAgoStr(21), daysInStage:1,  rating:4, fromReengagement:false, avatarInitials:initials('Emily','Chen'),          avatarColor:nextColor(), offerDate:daysAgoStr(1), offerAmount:'$72,000/yr', offerStatus:'pending' },
  { id:'o2',  firstName:'Brandon',   lastName:'Foster',      jobTitle:'Recruiter',
    source:'Referral',     sourceType:'passive', stage:'offer',        appliedDate:daysAgoStr(45), daysInStage:3,  rating:3, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Brandon','Foster'),      avatarColor:nextColor(), offerDate:daysAgoStr(3), offerAmount:'$65,000/yr', offerStatus:'countered' },

  // ── Placed ─────────────────────────────────────────────────────────────────
  { id:'pl1', firstName:'Fatima',    lastName:'Al-Hassan',   jobTitle:'Sr. Recruiter',
    source:'Indeed',       sourceType:'active',  stage:'placed',       appliedDate:daysAgoStr(30), daysInStage:0,  rating:4, fromReengagement:false, avatarInitials:initials('Fatima','Al-Hassan'),    avatarColor:nextColor(), startDate:dateStr(7),  placedBy:'J. Rivera' },
  { id:'pl2', firstName:'Michael',   lastName:'Stevens',     jobTitle:'Sourcing Specialist',
    source:'Past applicant',sourceType:'passive',stage:'placed',      appliedDate:daysAgoStr(120),daysInStage:0,  rating:3, fromReengagement:true,  campaignName:'3-Month No-Contact Drip', avatarInitials:initials('Michael','Stevens'),     avatarColor:nextColor(), startDate:dateStr(14), placedBy:'M. Chen' },
];
