export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Phone Call',
  '1st Interview',
  '2nd Interview',
  'Offer',
  'Rejected after Applying',
  'Rejected after Phone Call',
  'Rejected after 1st Interview',
  'Rejected after 2nd Interview',
  'Ghosted'
];

export const SALARY_TYPES = ['Seek Estimate', 'Picked', 'Actual'] as const;

export const INTERVIEW_TYPES = [
  'phone',
  'video',
  'onsite',
  'technical',
  'behavioral',
  'other'
] as const;

export const STATUS_COLORS = {
  'Applied': 'blue',
  'Phone Call': 'indigo',
  '1st Interview': 'purple',
  '2nd Interview': 'purple',
  'Offer': 'green',
  'Rejected after Applying': 'red',
  'Rejected after Phone Call': 'red',
  'Rejected after 1st Interview': 'red',
  'Rejected after 2nd Interview': 'red',
  'Ghosted': 'gray'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  APPLICATIONS: '/applications',
  STATS: '/stats',
  TRACKING: '/tracking',
  SETTINGS: '/settings'
} as const;

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  APPLICATIONS: 'applications',
  PREFERENCES: 'preferences'
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  DRAFT_APPLICATION: 'draft_application'
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

import type { ApplicationStatus } from '../types';