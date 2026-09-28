export type VerificationStatus = 'verified' | 'unverified' | 'directory-listed';

export type ContactType = 'faculty_direct' | 'general_contact' | 'director_office' | 'webmaster';

export interface RelevantPaper {
  title: string;
  url?: string;
  note?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  institution: string;
  institutionRaw?: string;
  department: string;
  departmentRaw?: string;
  researchInterests: string;
  email: string;
  location: string;
  facultyPageUrl: string;
  labWebsite?: string;
  source: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  lastCheckedDate: string;
  contactType: ContactType;
  verificationNotice: string;
  userNotes?: string;
  saved?: boolean;
  relevantPaper?: RelevantPaper;
}

export interface DrdoLab {
  id: string;
  sNo: number;
  labName: string;
  acronym: string;
  orgType: string;
  state: string;
  city: string;
  location: string;
  pocName: string;
  email: string;
  contactType: ContactType;
  contactTypeLabel: string;
  researchAreas: string[];
  researchAreasRaw: string;
  source: string;
  verificationStatus: VerificationStatus;
  verificationNotice: string;
  officialUrl: string;
  lastCheckedDate: string;
  userNotes?: string;
  saved?: boolean;
}

export interface IsroCentre {
  id: string;
  sNo: number;
  labName: string;
  acronym: string;
  orgType: string;
  state: string;
  city: string;
  location: string;
  pocName: string;
  email: string | null;
  contactType: string;
  contactTypeLabel: string;
  researchAreas: string[];
  researchAreasRaw: string;
  source: string;
  verificationStatus: string;
  verificationNotice: string;
  officialUrl: string;
  lastCheckedDate: string;
  userNotes?: string;
  saved?: boolean;
}

export type ApplicationStatus =
  | 'Shortlisted'
  | 'Reading their work'
  | 'Draft ready'
  | 'Applied'
  | 'Follow-up sent'
  | 'Replied'
  | 'Interview'
  | 'Offer'
  | 'Closed';

export type ApplicationRoute = 'direct_email' | 'formal_portal' | 'official_notice' | 'lab_inquiry';

export interface ApplicationRecord {
  id: string;
  name: string; // Faculty name or Lab name
  institution: string;
  researchArea: string;
  contactEmail: string;
  sourceLink: string;
  applicationRoute: ApplicationRoute;
  status: ApplicationStatus;
  appliedDate: string;
  lastContactDate: string;
  nextAction: string;
  nextActionDate: string;
  followUpCount: number;
  deadline: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingProfile {
  name: string;
  degree: string;
  year: string;
  discipline: string;
  institution: string;
  broadInterests: string[];
  skills: string;
  project: string;
  projectTools: string;
  projectLink: string;
  weeklyHours: number;
  startDate: string;
  endDate: string;
  preferredLocations: string[];
  mode: 'on-site' | 'remote' | 'flexible';
  season: string;
  completedOnboarding: boolean;
}

export interface OpportunityNotice {
  id: string;
  title: string;
  organization: string;
  officialLink: string;
  deadline: string;
  eligibility: string;
  stipend: string;
  dates: string;
  documents: string;
  notes: string;
  savedAt: string;
}
