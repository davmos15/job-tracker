import { z } from 'zod';
import { APPLICATION_STATUSES, SALARY_TYPES } from './constants';

export const applicationSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100, 'Job title is too long'),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name is too long'),
  jobLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  dateApplied: z.string().min(1, 'Application date is required'),
  status: z.enum(APPLICATION_STATUSES as [string, ...string[]]),
  salary: z.string().optional(),
  salaryType: z.enum(SALARY_TYPES),
  benefits: z.string().max(500, 'Benefits description is too long').optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  selectionCriteria: z.string().max(2000, 'Selection criteria is too long').optional(),
});

export const interviewNoteSchema = z.object({
  date: z.string().min(1, 'Interview date is required'),
  type: z.enum(['phone', 'video', 'onsite', 'technical', 'behavioral', 'other']),
  notes: z.string().min(1, 'Interview notes are required').max(2000, 'Notes are too long'),
  interviewers: z.string().max(200, 'Interviewers field is too long').optional(),
  nextSteps: z.string().max(500, 'Next steps field is too long').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  emailNotifications: z.boolean().optional(),
  defaultView: z.enum(['grid', 'list']).optional(),
  autoSave: z.boolean().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type InterviewNoteFormData = z.infer<typeof interviewNoteSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>;