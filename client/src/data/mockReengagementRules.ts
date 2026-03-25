import type { ReengagementRule } from '../types/candidate';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const mockReengagementRules: ReengagementRule[] = [
  {
    id: 'r1',
    name: '3-Month No-Contact Drip',
    enabled: true,
    trigger: {
      monthsSinceApply: 3,
      neverBookedInterview: true,
    },
    filters: {
      maxMessagesLeft: null,
      jobBoards: [],
      minRating: 0,
      candidateTypes: ['active', 'passive'],
    },
    cadence: [
      {
        id: 's1',
        day: 1,
        type: 'email',
        subject: "We'd love to reconnect, {{firstName}}!",
        message:
          "Hi {{firstName}}, it's been a little while since you applied and we wanted to reach back out. We have new openings that may be a great fit — would you be open to a quick chat?",
        sendTime: '09:00',
      },
      {
        id: 's2',
        day: 4,
        type: 'sms',
        message:
          'Hi {{firstName}}, this is {{recruiterName}} from {{company}}. Just following up on my email — do you have 10 minutes this week to connect?',
        sendTime: '10:30',
      },
      {
        id: 's3',
        day: 10,
        type: 'email',
        subject: 'Still interested in new opportunities?',
        message:
          "Hi {{firstName}}, I wanted to follow up one more time. We're actively placing candidates in roles that match your background. Let me know if you'd like to explore!",
        sendTime: '09:00',
      },
      {
        id: 's4',
        day: 14,
        type: 'task',
        message: 'Manual follow-up call — check candidate status and update profile',
        sendTime: '11:00',
      },
    ],
    estimatedReach: 47,
    createdAt: daysAgo(30),
    lastRunAt: daysAgo(2),
  },
  {
    id: 'r2',
    name: 'CareerBuilder 6-Month Revival',
    enabled: true,
    trigger: {
      monthsSinceApply: 6,
      neverBookedInterview: true,
    },
    filters: {
      maxMessagesLeft: 1,
      jobBoards: ['CareerBuilder'],
      minRating: 3,
      candidateTypes: ['passive'],
    },
    cadence: [
      {
        id: 's5',
        day: 1,
        type: 'email',
        subject: 'Are you still open to new opportunities?',
        message:
          "Hi {{firstName}}, we noticed you applied through CareerBuilder a while back and wanted to check in. The market has changed and we may have something perfect for you.",
        sendTime: '09:30',
      },
      {
        id: 's6',
        day: 7,
        type: 'sms',
        message:
          'Hi {{firstName}}! {{recruiterName}} here — still looking? We have openings that match your skills. Reply YES to learn more!',
        sendTime: '10:00',
      },
      {
        id: 's7',
        day: 21,
        type: 'email',
        subject: 'Last check-in from {{company}}',
        message:
          "Hi {{firstName}}, I'll make this my last reach-out for now. If you're ever open to exploring new roles, I'd love to connect. Just reply to this email!",
        sendTime: '09:00',
      },
    ],
    estimatedReach: 23,
    createdAt: daysAgo(14),
    lastRunAt: daysAgo(5),
  },
  {
    id: 'r3',
    name: 'LinkedIn 90-Day High-Raters',
    enabled: false,
    trigger: {
      monthsSinceApply: 3,
      neverBookedInterview: true,
    },
    filters: {
      maxMessagesLeft: null,
      jobBoards: ['LinkedIn'],
      minRating: 4,
      candidateTypes: ['active'],
    },
    cadence: [
      {
        id: 's8',
        day: 1,
        type: 'email',
        subject: "{{firstName}}, we haven't forgotten about you",
        message:
          "Hi {{firstName}}, you stood out when you applied and we wanted to circle back. We have a priority opening right now that fits your profile perfectly — interested?",
        sendTime: '08:30',
      },
      {
        id: 's9',
        day: 3,
        type: 'sms',
        message:
          'Hi {{firstName}}, {{recruiterName}} from {{company}}. Sent you an email — would love to connect this week on a great new role!',
        sendTime: '10:00',
      },
      {
        id: 's10',
        day: 7,
        type: 'task',
        message: 'LinkedIn InMail follow-up — send personalized connection message',
        sendTime: '09:00',
      },
    ],
    estimatedReach: 12,
    createdAt: daysAgo(7),
    lastRunAt: undefined,
  },
];
