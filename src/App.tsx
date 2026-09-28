import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StartHere } from './components/StartHere';
import { FacultyDirectory } from './components/FacultyDirectory';
import { DrdoDirectory } from './components/DrdoDirectory';
import { IsroDirectory } from './components/IsroDirectory';
import { EmailStudio } from './components/EmailStudio';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ResearchRoadmap } from './components/ResearchRoadmap';
import { ResourcesSection } from './components/ResourcesSection';
import { SearchModal } from './components/SearchModal';

import { iitFacultyList, drdoLabsList, isroCentresList } from './data';
import {
  getSavedProfile,
  saveProfile,
  getSavedApplications,
  addApplication,
  getSavedFacultyIds,
  getSavedDrdoIds,
  getSavedIsroIds,
  getRoadmapProgress,
  getPlanningSeason,
  savePlanningSeason,
} from './utils/storage';
import {
  OnboardingProfile,
  ApplicationRecord,
  FacultyMember,
  DrdoLab,
  IsroCentre,
} from './types';
import { EmailFormData } from './data/emailTemplates';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('start');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Core State
  const [season, setSeason] = useState<string>(() => getPlanningSeason());
  const [profile, setProfile] = useState<OnboardingProfile>(() => getSavedProfile());
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => getSavedApplications());
  const [savedFacultyIds, setSavedFacultyIds] = useState<string[]>(() => getSavedFacultyIds());
  const [savedDrdoIds, setSavedDrdoIds] = useState<string[]>(() => getSavedDrdoIds());
  const [savedIsroIds, setSavedIsroIds] = useState<string[]>(() => getSavedIsroIds());
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean>>(() => getRoadmapProgress());

  // Email Studio Prefill Data
  const [emailPrefill, setEmailPrefill] = useState<Partial<EmailFormData> | undefined>(undefined);

  // Sync season updates
  const handleSeasonChange = (newSeason: string) => {
    setSeason(newSeason);
    savePlanningSeason(newSeason);
  };

  // Profile update
  const handleProfileUpdate = (updated: OnboardingProfile) => {
    setProfile(updated);
    saveProfile(updated);
  };

  // Refresh applications from storage
  const handleRefreshApplications = () => {
    setApplications(getSavedApplications());
    setSavedFacultyIds(getSavedFacultyIds());
    setSavedDrdoIds(getSavedDrdoIds());
    setSavedIsroIds(getSavedIsroIds());
    setRoadmapProgress(getRoadmapProgress());
  };

  // Prepare email from Faculty Directory
  const handlePrepareEmailFromFaculty = (faculty: FacultyMember, paperNote?: { title: string; note?: string }) => {
    const surnameMatch = faculty.name.match(/\b([A-Z][a-z]+)$/);
    const surname = surnameMatch ? surnameMatch[1] : faculty.name.replace(/^(Prof\.|Dr\.)\s*/, '');

    setEmailPrefill({
      recipientName: faculty.name,
      recipientSurname: surname,
      recipientEmail: faculty.email,
      recipientInstitution: faculty.institution,
      researchTopic: faculty.researchInterests.split(/[,;]/)[0] || 'your core research field',
      paperOrLabPage: paperNote?.title || 'your recent research publications',
      specificObservation: paperNote?.note || 'the methodology and experimental findings discussed in your work',
      templateType: 'A',
    });
    setCurrentTab('email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare lab inquiry from DRDO Directory
  const handlePrepareEmailFromDrdo = (lab: DrdoLab) => {
    setEmailPrefill({
      recipientName: lab.pocName,
      recipientSurname: 'Director / Training Office',
      recipientEmail: lab.email,
      recipientInstitution: lab.labName,
      researchTopic: lab.researchAreas[0] || 'applied defence research',
      templateType: 'C',
    });
    setCurrentTab('email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare lab inquiry from ISRO Directory
  const handlePrepareEmailFromIsro = (centre: IsroCentre) => {
    setEmailPrefill({
      recipientName: centre.pocName,
      recipientSurname: centre.contactTypeLabel || 'Director / Training Division',
      recipientEmail: centre.email || '',
      recipientInstitution: `${centre.labName} (${centre.acronym})`,
      researchTopic: centre.researchAreas[0] || 'space science and technology',
      templateType: 'C',
    });
    setCurrentTab('email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to tracker from anywhere
  const handleAddToTracker = (data: Partial<ApplicationRecord>) => {
    addApplication({
      name: data.name || 'Target Lab',
      institution: data.institution || 'Academic Institute',
      researchArea: data.researchArea || 'Research',
      contactEmail: data.contactEmail || '',
      sourceLink: data.sourceLink || '',
      applicationRoute: data.applicationRoute || 'direct_email',
      status: data.status || 'Shortlisted',
      appliedDate: data.appliedDate || '',
      lastContactDate: data.lastContactDate || new Date().toISOString().split('T')[0],
      nextAction: data.nextAction || 'Prepare application draft',
      nextActionDate: data.nextActionDate || '',
      followUpCount: data.followUpCount || 0,
      deadline: data.deadline || '',
      notes: data.notes || '',
    });
    handleRefreshApplications();
  };

  // Keyboard shortcut Cmd+K or Ctrl+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const completedTasksCount = Object.values(roadmapProgress).filter(Boolean).length;
  const totalSavedCount = savedFacultyIds.length + savedDrdoIds.length + savedIsroIds.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-ink-primary font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        applications={applications}
        savedCount={totalSavedCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          season={season}
          onSeasonChange={handleSeasonChange}
          onOpenGlobalSearch={() => setSearchModalOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'start' && (
            <StartHere
              profile={profile}
              onUpdateProfile={handleProfileUpdate}
              applications={applications}
              savedFacultyCount={savedFacultyIds.length}
              savedDrdoCount={savedDrdoIds.length}
              savedIsroCount={savedIsroIds.length}
              completedTasksCount={completedTasksCount}
              season={season}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'faculty' && (
            <FacultyDirectory
              facultyList={iitFacultyList}
              onPrepareEmail={handlePrepareEmailFromFaculty}
              onAddToTracker={handleAddToTracker}
            />
          )}

          {currentTab === 'drdo' && (
            <DrdoDirectory
              drdoLabs={drdoLabsList}
              onPrepareLabInquiry={handlePrepareEmailFromDrdo}
              onAddToTracker={handleAddToTracker}
            />
          )}

          {currentTab === 'isro' && (
            <IsroDirectory
              isroCentres={isroCentresList}
              onPrepareLabInquiry={handlePrepareEmailFromIsro}
              onAddToTracker={handleAddToTracker}
            />
          )}

          {currentTab === 'email' && (
            <EmailStudio
              profile={profile}
              prefillData={emailPrefill}
              onClearPrefill={() => setEmailPrefill(undefined)}
            />
          )}

          {currentTab === 'tracker' && (
            <ApplicationTracker
              applications={applications}
              onRefreshApplications={handleRefreshApplications}
              onOpenEmailStudioWithApp={(app) => {
                setEmailPrefill({
                  recipientName: app.name,
                  recipientEmail: app.contactEmail,
                  recipientInstitution: app.institution,
                  researchTopic: app.researchArea,
                });
                setCurrentTab('email');
              }}
            />
          )}

          {currentTab === 'roadmap' && <ResearchRoadmap />}

          {currentTab === 'resources' && <ResourcesSection />}
        </main>

        {/* Global Footer with Honest Disclaimers */}
        <footer className="mt-auto border-t border-stone-line bg-white/70 backdrop-blur-xs py-6 px-4 sm:px-8 text-xs text-ink-muted">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <p className="font-semibold text-ink-secondary">
                  Research Internship Desk — Academic Internship Preparation & Tracking ({season})
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  <span className="text-ink-muted">Developer:</span>
                  <span className="font-bold text-indigo-800">Amit Kumar Behera</span>
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Three Integrated Tracks: IITs • DRDO • ISRO. Independent student preparation tool; not officially affiliated with or endorsed by IITs, DRDO, or ISRO.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Client-Side & Private
              </span>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-ink-secondary hover:text-ink-primary font-medium"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        facultyList={iitFacultyList}
        drdoLabs={drdoLabsList}
        isroCentres={isroCentresList}
        onSelectFaculty={(faculty) => {
          handlePrepareEmailFromFaculty(faculty);
        }}
        onSelectDrdoLab={(lab) => {
          handlePrepareEmailFromDrdo(lab);
        }}
        onSelectIsroCentre={(centre) => {
          handlePrepareEmailFromIsro(centre);
        }}
        onSelectGuide={() => {
          setCurrentTab('resources');
        }}
      />
    </div>
  );
}

export default App;
