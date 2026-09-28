import { ApplicationRecord, OnboardingProfile, OpportunityNotice } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'wrd_profile_v1',
  APPLICATIONS: 'wrd_applications_v1',
  SAVED_FACULTY: 'wrd_saved_faculty_v1',
  SAVED_DRDO: 'wrd_saved_drdo_v1',
  SAVED_ISRO: 'wrd_saved_isro_v1',
  CONTACT_NOTES: 'wrd_contact_notes_v1',
  PAPER_NOTES: 'wrd_paper_notes_v1',
  ROADMAP_PROGRESS: 'wrd_roadmap_progress_v1',
  OPPORTUNITIES: 'wrd_opportunities_v1',
  SEASON: 'wrd_planning_season_v1',
};

export const DEFAULT_SEASON = 'Winter 2026–27';

export const DEFAULT_PROFILE: OnboardingProfile = {
  name: '',
  degree: 'B.Tech',
  year: '3rd Year',
  discipline: 'Computer Science and Engineering',
  institution: '',
  broadInterests: ['Artificial Intelligence', 'Machine Learning'],
  skills: 'Python, PyTorch, NumPy, Git, Linux',
  project: 'Implemented a lightweight vision transformer baseline on CIFAR-100',
  projectTools: 'PyTorch, Weights & Biases',
  projectLink: 'https://github.com/username/project',
  weeklyHours: 15,
  startDate: '2026-12-01',
  endDate: '2027-01-15',
  preferredLocations: ['Bengaluru', 'Delhi NCR', 'Hyderabad', 'Mumbai'],
  mode: 'flexible',
  season: DEFAULT_SEASON,
  completedOnboarding: false,
};

// Safe JSON parser
function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (err) {
    console.warn('Storage parse error, returning fallback:', err);
    return fallback;
  }
}

// Profile
export function getSavedProfile(): OnboardingProfile {
  return safeParse<OnboardingProfile>(localStorage.getItem(STORAGE_KEYS.PROFILE), DEFAULT_PROFILE);
}

export function saveProfile(profile: OnboardingProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Season
export function getPlanningSeason(): string {
  return localStorage.getItem(STORAGE_KEYS.SEASON) || DEFAULT_SEASON;
}

export function savePlanningSeason(season: string): void {
  localStorage.setItem(STORAGE_KEYS.SEASON, season);
}

// Applications Tracker
export function getSavedApplications(): ApplicationRecord[] {
  return safeParse<ApplicationRecord[]>(localStorage.getItem(STORAGE_KEYS.APPLICATIONS), []);
}

export function saveApplications(apps: ApplicationRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

export function addApplication(app: Omit<ApplicationRecord, 'id' | 'createdAt' | 'updatedAt'>): ApplicationRecord {
  const current = getSavedApplications();
  const now = new Date().toISOString();
  const newRecord: ApplicationRecord = {
    ...app,
    id: 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: now,
    updatedAt: now,
  };
  saveApplications([newRecord, ...current]);
  return newRecord;
}

export function updateApplication(id: string, updates: Partial<ApplicationRecord>): ApplicationRecord[] {
  const current = getSavedApplications();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
  );
  saveApplications(updated);
  return updated;
}

export function deleteApplication(id: string): ApplicationRecord[] {
  const current = getSavedApplications();
  const updated = current.filter((item) => item.id !== id);
  saveApplications(updated);
  return updated;
}

// Saved Faculty & DRDO Labs
export function getSavedFacultyIds(): string[] {
  return safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.SAVED_FACULTY), []);
}

export function toggleSavedFacultyId(id: string): string[] {
  const current = getSavedFacultyIds();
  const updated = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.SAVED_FACULTY, JSON.stringify(updated));
  return updated;
}

export function getSavedDrdoIds(): string[] {
  return safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.SAVED_DRDO), []);
}

export function toggleSavedDrdoId(id: string): string[] {
  const current = getSavedDrdoIds();
  const updated = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.SAVED_DRDO, JSON.stringify(updated));
  return updated;
}

export function getSavedIsroIds(): string[] {
  return safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.SAVED_ISRO), []);
}

export function toggleSavedIsroId(id: string): string[] {
  const current = getSavedIsroIds();
  const updated = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.SAVED_ISRO, JSON.stringify(updated));
  return updated;
}

// Notes per contact (faculty or DRDO)
export function getContactNotes(): Record<string, string> {
  return safeParse<Record<string, string>>(localStorage.getItem(STORAGE_KEYS.CONTACT_NOTES), {});
}

export function saveContactNote(contactId: string, note: string): void {
  const current = getContactNotes();
  current[contactId] = note;
  localStorage.setItem(STORAGE_KEYS.CONTACT_NOTES, JSON.stringify(current));
}

// Paper notes per contact
export interface StoredPaperNote {
  title: string;
  url?: string;
  note?: string;
}

export function getPaperNotes(): Record<string, StoredPaperNote> {
  return safeParse<Record<string, StoredPaperNote>>(localStorage.getItem(STORAGE_KEYS.PAPER_NOTES), {});
}

export function savePaperNote(contactId: string, paperNote: StoredPaperNote): void {
  const current = getPaperNotes();
  current[contactId] = paperNote;
  localStorage.setItem(STORAGE_KEYS.PAPER_NOTES, JSON.stringify(current));
}

// Roadmap Progress
export function getRoadmapProgress(): Record<string, boolean> {
  return safeParse<Record<string, boolean>>(localStorage.getItem(STORAGE_KEYS.ROADMAP_PROGRESS), {});
}

export function toggleRoadmapTask(taskId: string): Record<string, boolean> {
  const current = getRoadmapProgress();
  current[taskId] = !current[taskId];
  localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(current));
  return { ...current };
}

// Opportunities Board
export function getSavedOpportunities(): OpportunityNotice[] {
  return safeParse<OpportunityNotice[]>(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES), [
    {
      id: 'opp-1',
      title: 'IIT Bombay SURP (Summer/Winter Undergraduate Research Program)',
      organization: 'IIT Bombay',
      officialLink: 'https://www.iitb.ac.in',
      deadline: '2026-10-25',
      eligibility: 'Pre-final and 2nd year B.Tech / Dual Degree students. Top 10% class rank preferred.',
      stipend: 'Stipend + campus hostel accommodation if selected under formal program.',
      dates: 'Dec 1, 2026 – Jan 10, 2027',
      documents: 'Resume, official grade card, statement of purpose, NOC from home institution.',
      notes: 'Check departmental specific announcements on individual department noticeboards.',
      savedAt: '2026-09-28'
    },
    {
      id: 'opp-2',
      title: 'DRDO Research Internship / Project Training (Formal Circular)',
      organization: 'DRDO RAC / CEPTAM & Individual Labs',
      officialLink: 'https://www.drdo.gov.in',
      deadline: 'Rolling (Check lab circular 45 days prior)',
      eligibility: 'Indian nationals enrolled in bona fide degree courses (BE/BTech, ME/MTech, MSc).',
      stipend: 'Unpaid academic training / apprentice stipend depending on lab scheme.',
      dates: 'Winter session (4 to 8 weeks)',
      documents: 'College Bonafide Certificate, Police/ID verification, NOC from Dean/HOD.',
      notes: 'Most DRDO labs require formal college sponsorship letter addressed to the Director.',
      savedAt: '2026-09-28'
    },
    {
      id: 'opp-3',
      title: 'ISRO Student Internship & Academic Project Work Scheme',
      organization: 'ISRO / DOS Centres (VSSC, URSC, SAC, NRSC, IIRS)',
      officialLink: 'https://www.isro.gov.in',
      deadline: 'Rolling / Biannual (Apply 45–60 days before winter session)',
      eligibility: 'B.E./B.Tech (minimum 60% or 6.5+ CGPA), M.E./M.Tech/M.Sc students in relevant space technology disciplines.',
      stipend: 'Honorary academic project work / research internship (unpaid unless under specific sponsored fellowship).',
      dates: 'Winter session (4 to 12 weeks during academic vacation)',
      documents: 'College Bonafide Certificate, Recommendation Letter from HOD/Principal, Biodata, Marks sheets.',
      notes: 'Applications must be routed through the official HRD / Student Training Division of respective ISRO centres.',
      savedAt: '2026-09-29'
    }
  ]);
}

export function saveOpportunities(list: OpportunityNotice[]): void {
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
}

export function addOpportunity(opp: Omit<OpportunityNotice, 'id' | 'savedAt'>): OpportunityNotice[] {
  const current = getSavedOpportunities();
  const newOpp: OpportunityNotice = {
    ...opp,
    id: 'opp-' + Date.now(),
    savedAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newOpp, ...current];
  saveOpportunities(updated);
  return updated;
}

export function deleteOpportunity(id: string): OpportunityNotice[] {
  const current = getSavedOpportunities();
  const updated = current.filter((o) => o.id !== id);
  saveOpportunities(updated);
  return updated;
}

// Follow-up helper calculations
export interface FollowUpSummary {
  dueTodayOrOverdue: ApplicationRecord[];
  upcoming: ApplicationRecord[];
  completedCount: number;
}

export function calculateFollowUps(applications: ApplicationRecord[]): FollowUpSummary {
  const today = new Date().toISOString().split('T')[0];
  const dueTodayOrOverdue: ApplicationRecord[] = [];
  const upcoming: ApplicationRecord[] = [];

  applications.forEach((app) => {
    // Only remind if still in awaiting state
    if (['Applied', 'Follow-up sent'].includes(app.status)) {
      if (app.nextActionDate) {
        if (app.nextActionDate <= today) {
          dueTodayOrOverdue.push(app);
        } else {
          upcoming.push(app);
        }
      }
    }
  });

  return {
    dueTodayOrOverdue,
    upcoming,
    completedCount: applications.filter((a) => ['Replied', 'Interview', 'Offer', 'Closed'].includes(a.status)).length,
  };
}

// CSV Export with formula injection prevention
export function exportApplicationsToCSV(applications: ApplicationRecord[]): void {
  const headers = [
    'Recipient / Lab',
    'Institution',
    'Research Area',
    'Contact Email',
    'Status',
    'Application Route',
    'Applied Date',
    'Last Contact Date',
    'Next Action',
    'Next Action Date',
    'Follow-up Count',
    'Deadline',
    'Notes',
    'Source Link'
  ];

  // Helper to escape CSV injection
  const sanitizeCSV = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    let str = String(val).replace(/"/g, '""');
    // If starts with =, +, -, @, \t, \r, prepend single quote
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    return `"${str}"`;
  };

  const rows = applications.map((app) => [
    sanitizeCSV(app.name),
    sanitizeCSV(app.institution),
    sanitizeCSV(app.researchArea),
    sanitizeCSV(app.contactEmail),
    sanitizeCSV(app.status),
    sanitizeCSV(app.applicationRoute),
    sanitizeCSV(app.appliedDate),
    sanitizeCSV(app.lastContactDate),
    sanitizeCSV(app.nextAction),
    sanitizeCSV(app.nextActionDate),
    sanitizeCSV(app.followUpCount),
    sanitizeCSV(app.deadline),
    sanitizeCSV(app.notes),
    sanitizeCSV(app.sourceLink),
  ]);

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `winter-research-applications-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// JSON Backup & Restore
export function exportBackupJSON(): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profile: getSavedProfile(),
    applications: getSavedApplications(),
    savedFacultyIds: getSavedFacultyIds(),
    savedDrdoIds: getSavedDrdoIds(),
    savedIsroIds: getSavedIsroIds(),
    contactNotes: getContactNotes(),
    paperNotes: getPaperNotes(),
    roadmapProgress: getRoadmapProgress(),
    opportunities: getSavedOpportunities(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `research-internship-desk-backup-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function restoreBackupJSON(jsonData: any): boolean {
  try {
    if (jsonData.profile) saveProfile(jsonData.profile);
    if (Array.isArray(jsonData.applications)) saveApplications(jsonData.applications);
    if (Array.isArray(jsonData.savedFacultyIds)) localStorage.setItem(STORAGE_KEYS.SAVED_FACULTY, JSON.stringify(jsonData.savedFacultyIds));
    if (Array.isArray(jsonData.savedDrdoIds)) localStorage.setItem(STORAGE_KEYS.SAVED_DRDO, JSON.stringify(jsonData.savedDrdoIds));
    if (Array.isArray(jsonData.savedIsroIds)) localStorage.setItem(STORAGE_KEYS.SAVED_ISRO, JSON.stringify(jsonData.savedIsroIds));
    if (jsonData.contactNotes) localStorage.setItem(STORAGE_KEYS.CONTACT_NOTES, JSON.stringify(jsonData.contactNotes));
    if (jsonData.paperNotes) localStorage.setItem(STORAGE_KEYS.PAPER_NOTES, JSON.stringify(jsonData.paperNotes));
    if (jsonData.roadmapProgress) localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(jsonData.roadmapProgress));
    if (Array.isArray(jsonData.opportunities)) saveOpportunities(jsonData.opportunities);
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
}
