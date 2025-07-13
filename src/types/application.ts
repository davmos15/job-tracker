export interface InterviewNote {
  id: string;
  date: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'other';
  notes: string;
  interviewers?: string;
  nextSteps?: string;
}

export type ApplicationStatus = 
  | 'Applied'
  | 'Phone Call'
  | '1st Interview'
  | '2nd Interview'
  | 'Offer'
  | 'Rejected after Applying'
  | 'Rejected after Phone Call'
  | 'Rejected after 1st Interview'
  | 'Rejected after 2nd Interview'
  | 'Ghosted';

export type SalaryType = 'Seek Estimate' | 'Picked' | 'Actual';

export interface Application {
  id: string;
  userId: string;
  title: string;
  company: string;
  jobLink?: string;
  dateApplied: string;
  status: ApplicationStatus;
  salary?: string;
  salaryType: SalaryType;
  benefits?: string;
  notes?: string;
  selectionCriteria?: string;
  interviewNotes: InterviewNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationFormData {
  title: string;
  company: string;
  jobLink?: string;
  dateApplied: string;
  status: ApplicationStatus;
  salary?: string;
  salaryType: SalaryType;
  benefits?: string;
  notes?: string;
  selectionCriteria?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  companies?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}