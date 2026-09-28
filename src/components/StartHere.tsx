import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Building2,
  Rocket,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  ChevronRight,
  SlidersHorizontal,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Mail,
  Zap
} from 'lucide-react';
import { OnboardingProfile, ApplicationRecord } from '../types';
import { WisprShowcase } from './WisprShowcase';
import { iitFacultyList } from '../data';

interface StartHereProps {
  profile: OnboardingProfile;
  onUpdateProfile: (updated: OnboardingProfile) => void;
  applications: ApplicationRecord[];
  savedFacultyCount: number;
  savedDrdoCount: number;
  savedIsroCount: number;
  completedTasksCount: number;
  season: string;
  onNavigate: (tab: string) => void;
}

export const StartHere: React.FC<StartHereProps> = ({
  profile,
  onUpdateProfile,
  applications,
  savedFacultyCount,
  savedDrdoCount,
  savedIsroCount,
  completedTasksCount,
  season,
  onNavigate,
}) => {
  // Never show as a blocking popup modal at start
  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
  const [formData, setFormData] = useState<OnboardingProfile>(profile);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Live Mini Faculty Matcher state
  const [miniQuery, setMiniQuery] = useState('Deep Learning');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const pendingFollowups = applications.filter(
    (a) =>
      ['Applied', 'Follow-up sent'].includes(a.status) &&
      a.nextActionDate &&
      a.nextActionDate <= new Date().toISOString().split('T')[0]
  ).length;

  const totalSaved = savedFacultyCount + savedDrdoCount + savedIsroCount;

  const handleSaveOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...formData, completedOnboarding: true };
    onUpdateProfile(updated);
    setSaveSuccessMessage('Your winter research plan and preferences have been updated!');
    setTimeout(() => {
      setSaveSuccessMessage(null);
      setIsPlanBuilderOpen(false);
    }, 1800);
  };

  const domainOptions = [
    'AI & Machine Learning',
    'Computer Vision & NLP',
    'Systems & Networking',
    'Robotics & Control',
    'VLSI & Embedded Electronics',
    'Chemical Sciences & Energetic Materials',
    'Materials & Metallurgical Eng.',
    'Aerospace & Fluid Mechanics',
    'Life Sciences & Biotechnology',
    'Theoretical Physics & Mathematics',
  ];

  const toggleInterest = (interest: string) => {
    const current = formData.broadInterests || [];
    if (current.includes(interest)) {
      setFormData({ ...formData, broadInterests: current.filter((i) => i !== interest) });
    } else {
      setFormData({ ...formData, broadInterests: [...current, interest] });
    }
  };

  const handleOpenPlanBuilder = () => {
    setIsPlanBuilderOpen(true);
    setTimeout(() => {
      document.getElementById('plan-builder-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Mini live faculty search preview
  const livePreviewFaculty = useMemo(() => {
    const q = miniQuery.toLowerCase().trim();
    if (!q) return iitFacultyList.slice(0, 3);
    return iitFacultyList
      .filter((f) => f.researchInterests.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.name.toLowerCase().includes(q))
      .slice(0, 3);
  }, [miniQuery]);

  // 6-stage roadmap workflow stages
  const workflowSteps = [
    {
      num: 1,
      title: 'Prepare',
      desc: 'Audit your foundational math & coding tools. Understand the 4–6 week winter constraints.',
      action: () => onNavigate('roadmap'),
    },
    {
      num: 2,
      title: 'Explore',
      desc: 'Search 1,411 IIT faculty & 50 DRDO labs by genuine domain overlap rather than prestige.',
      action: () => onNavigate('faculty'),
    },
    {
      num: 3,
      title: 'Read',
      desc: 'Read 3 recent papers using the 3-pass method. Note one limitation or question.',
      action: () => onNavigate('resources'),
    },
    {
      num: 4,
      title: 'Reach out',
      desc: 'Write a 150-word targeted email connecting your project to their recent publication.',
      action: () => onNavigate('email'),
    },
    {
      num: 5,
      title: 'Follow up',
      desc: 'Schedule a respectful 7–10 day reminder in your tracker. Never mass-spam.',
      action: () => onNavigate('tracker'),
    },
    {
      num: 6,
      title: 'Interview',
      desc: 'Prepare a 2-minute project pitch, a debugging failure, and clarify logistical requirements.',
      action: () => onNavigate('resources'),
    },
  ];

  const faqs = [
    {
      q: 'Do first and second-year undergraduate students stand a chance for winter internships?',
      a: 'Yes, but the strategy is fundamentally different. Professors don\'t expect first or second-year students to have published papers. They look for strong programming hygiene, mastery of foundational math or lab fundamentals, and the ability to reproduce a known baseline without constant hand-holding. Use Template B in Email Studio specifically calibrated for early-stage students.',
    },
    {
      q: 'Should I email the DRDO Laboratory Director directly for internships?',
      a: 'The 50 DRDO contacts represent director and executive offices. While they are included for institutional identification, most DRDO laboratories have formal student training cells or apprentice notifications published on drdo.gov.in. Use Template C ("DRDO Process Inquiry") to ask for the correct official training desk or check the official noticeboard before writing.',
    },
    {
      q: 'How do I apply for student internships or project training at ISRO centres?',
      a: 'ISRO centres (such as VSSC, URSC, SAC, NRSC, and IIRS) accept undergraduate and postgraduate students for academic project work and internships via their Human Resource Development (HRD) or Student Training Division. Requirements typically include an active bonafide certificate from your college Principal or HOD, marks sheets (minimum 60% or 6.5+ CGPA), and an NOC. You can browse all 20 centres in our ISRO Directory and draft inquiries using Template C.',
    },
    {
      q: 'My CGPA is not 9.0+. Will IIT faculty automatically ignore my email?',
      a: 'In formal summer fellowships (like SURP), strict CGPA cutoffs often apply. In individualized winter outreach, however, faculty care far more about whether you have written code that works. If you include a verified GitHub repository reproducing a paper baseline or solving a concrete problem, it carries far more weight than a high GPA without tangible projects.',
    },
    {
      q: 'When and how many times should I follow up if I don’t receive a reply?',
      a: 'Follow up exactly once, 7 to 10 days after your initial email (Template D). If you receive no reply 7 to 10 days after the first follow-up, send a final polite closure note (Template E) and move on. Never email a professor daily or ping them on WhatsApp or LinkedIn without invitation.',
    },
    {
      q: 'Does clicking "Open in Email Client" attach my CV automatically?',
      a: 'No. The "mailto:" web standard is prohibited by browser security from accessing your local filesystem or attaching files automatically. You must manually attach your PDF CV (named FirstName_LastName_CV.pdf) before clicking send in your email client.',
    },
    {
      q: 'Is an official college NOC (No Objection Certificate) required?',
      a: 'Most formal academic training programs and all defence (DRDO) and space (ISRO) facilities require a college sponsorship letter or NOC from your HOD or Dean. Check with your university\'s academic section before finalizing travel plans.',
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-2">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-white border border-stone-line p-6 sm:p-12 shadow-card overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 via-sky-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-slate-50/80 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-ink-primary border border-stone-line shadow-xs">
            <span className="pulse-dot bg-indigo-600" />
            <span className="font-mono text-[11px] font-semibold text-indigo-700">WINTER {season}</span>
            <span className="text-ink-muted">•</span>
            <span className="font-medium text-ink-secondary">1,411 IIT Faculty • 50 DRDO Labs • 20 ISRO Centres</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-normal text-ink-primary tracking-tight leading-[1.12]">
            Your winter research internship starts{' '}
            <span className="italic font-normal text-indigo-700">before</span> the first email.
          </h2>

          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-sans max-w-2xl">
            Target premier academic laboratories (IITs), national defence establishments (DRDO), and space science centres (ISRO) with structured, transparent preparation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenPlanBuilder}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Build my plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('faculty')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-hover border border-stone-line text-ink-primary text-xs sm:text-sm font-medium shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>IITs (1,411 Faculty)</span>
            </button>

            <button
              onClick={() => onNavigate('drdo')}
              className="px-5 py-2.5 rounded-full bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>DRDO (50 Labs)</span>
            </button>

            <button
              onClick={() => onNavigate('isro')}
              className="px-5 py-2.5 rounded-full bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200 text-sky-950 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Rocket className="w-4 h-4 text-sky-600" />
              <span>ISRO (20 Centres)</span>
            </button>
          </div>
        </div>

        {/* Personalized Student Profile Snippet */}
        <div className="mt-10 pt-6 border-t border-stone-line flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              {profile.name ? profile.name[0] : 'S'}
            </div>
            <div>
              <span className="font-semibold text-ink-primary block">
                {profile.name || 'Anonymous Student'} ({profile.degree}, {profile.year})
              </span>
              <span className="text-ink-muted text-[11px]">
                Target: {profile.startDate} to {profile.endDate} • {profile.weeklyHours}h/week prep • {profile.discipline}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPlanBuilderOpen(!isPlanBuilderOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-line bg-white hover:bg-stone-hover text-xs font-medium text-teal-700 cursor-pointer shadow-xs transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isPlanBuilderOpen ? 'Hide Preferences Form' : 'Customize Profile & Dates'}</span>
            {isPlanBuilderOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Inline Plan Builder Section (Integrated directly in page flow, NO popup!) */}
      {isPlanBuilderOpen && (
        <div id="plan-builder-section" className="rounded-2xl border border-teal-200 bg-white p-6 sm:p-8 shadow-subtle space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-stone-line">
            <div>
              <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] mb-1">
                <UserCheck className="w-3 h-3" />
                Personal Plan Builder
              </span>
              <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
                Set Your Winter Research Preferences
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Saved locally in this browser. Used to tailor your outreach dates and suggested starting steps.
              </p>
            </div>

            <button
              onClick={() => setIsPlanBuilderOpen(false)}
              className="text-xs text-ink-muted hover:text-ink-primary px-2.5 py-1 rounded-full border border-stone-line hover:bg-stone-hover cursor-pointer"
            >
              Close
            </button>
          </div>

          {saveSuccessMessage && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-700" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveOnboarding} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Your Name (or preferred initials)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Your Institution / College
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. NIT Trichy / DTU / BITS Pilani"
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Degree
                </label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                >
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="Dual Degree (B.Tech + M.Tech)">Dual Degree (B.Tech + M.Tech)</option>
                  <option value="B.S.">B.S. (Four-Year Science)</option>
                  <option value="B.Sc">B.Sc (Three-Year)</option>
                  <option value="Integrated M.Sc">Integrated M.Sc</option>
                  <option value="M.Sc / M.Tech">M.Sc / M.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Year of Study
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                >
                  <option value="1st Year">1st Year (Foundational)</option>
                  <option value="2nd Year">2nd Year (Pre-Junior)</option>
                  <option value="3rd Year">3rd Year (Primary Winter Candidate)</option>
                  <option value="4th Year">4th Year (Senior / Thesis)</option>
                  <option value="Masters (1st/2nd Year)">Masters Student</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                Discipline / Department
              </label>
              <input
                type="text"
                value={formData.discipline}
                onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
              />
            </div>

            {/* Research Interests Multi-select */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-secondary mb-1.5">
                Broad Research Areas of Interest
              </label>
              <div className="flex flex-wrap gap-1.5">
                {domainOptions.map((domain) => {
                  const isSelected = (formData.broadInterests || []).includes(domain);
                  return (
                    <button
                      type="button"
                      key={domain}
                      onClick={() => toggleInterest(domain)}
                      className={`px-3 py-1 rounded-full text-xs transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 font-medium'
                          : 'bg-white hover:bg-stone-hover border-stone-line text-ink-secondary'
                      }`}
                    >
                      {domain}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Key Technical Skills (Tools, languages)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Python, PyTorch, C++, Git, Linux"
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Weekly Preparation Time
                </label>
                <select
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                >
                  <option value={5}>5–8 hours/week (Light prep)</option>
                  <option value={15}>12–15 hours/week (Recommended standard)</option>
                  <option value={25}>20–25 hours/week (Intensive preparation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                One Substantive Project or Baseline you have built
              </label>
              <textarea
                rows={2}
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="e.g. Implemented a lightweight Graph Neural Network baseline for node classification on Cora with PyTorch Geometric."
                className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Internship Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink-secondary mb-1">
                  Internship End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-line flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPlanBuilderOpen(false)}
                className="px-4 py-2 rounded-full border border-stone-line text-ink-secondary hover:bg-stone-hover text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
              >
                Save Preferences & Update Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Actual Personal Progress Metrics (Wispr Flow style cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-mono tracking-wider text-ink-muted font-semibold">
            Your Personal Progress ({season})
          </h3>
          <span className="text-[11px] text-ink-muted">
            Stored locally in browser
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: Saved Contacts */}
          <div
            onClick={() => onNavigate('faculty')}
            className="wispr-card p-5 cursor-pointer hover:border-teal-500 group"
          >
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-xs font-medium">Saved Contacts</span>
              <GraduationCap className="w-4 h-4 group-hover:text-teal-600 transition-colors" />
            </div>
            <div className="text-3xl font-serif-title font-semibold text-ink-primary font-mono">
              {totalSaved}
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">
              {totalSaved === 0 ? 'No contacts saved yet' : `${savedFacultyCount} IIT, ${savedDrdoCount} DRDO, ${savedIsroCount} ISRO`}
            </p>
          </div>

          {/* Card 2: Applications Recorded */}
          <div
            onClick={() => onNavigate('tracker')}
            className="wispr-card p-5 cursor-pointer hover:border-teal-500 group"
          >
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-xs font-medium">Applications Recorded</span>
              <BookOpen className="w-4 h-4 group-hover:text-teal-600 transition-colors" />
            </div>
            <div className="text-3xl font-serif-title font-semibold text-ink-primary font-mono">
              {applications.length}
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">
              {applications.length === 0 ? 'Start shortlisting target labs' : `${applications.filter((a) => a.status === 'Applied').length} active outreach sent`}
            </p>
          </div>

          {/* Card 3: Follow-ups Due */}
          <div
            onClick={() => onNavigate('tracker')}
            className={`wispr-card p-5 cursor-pointer group ${
              pendingFollowups > 0 ? 'border-amber-300 bg-amber-50/40' : 'hover:border-teal-500'
            }`}
          >
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-xs font-medium">Follow-ups Due</span>
              <Clock className={`w-4 h-4 ${pendingFollowups > 0 ? 'text-amber-600' : 'group-hover:text-teal-600'}`} />
            </div>
            <div className={`text-3xl font-serif-title font-semibold font-mono ${pendingFollowups > 0 ? 'text-amber-800' : 'text-ink-primary'}`}>
              {pendingFollowups}
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">
              {pendingFollowups === 0 ? 'No reminders pending' : 'Requires follow-up attention'}
            </p>
          </div>

          {/* Card 4: Roadmap Tasks Completed */}
          <div
            onClick={() => onNavigate('roadmap')}
            className="wispr-card p-5 cursor-pointer hover:border-teal-500 group"
          >
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-xs font-medium">Roadmap Progress</span>
              <CheckCircle2 className="w-4 h-4 group-hover:text-teal-600 transition-colors" />
            </div>
            <div className="text-3xl font-serif-title font-semibold text-ink-primary font-mono">
              {completedTasksCount} <span className="text-xs text-ink-muted font-normal font-sans">/ 22 tasks</span>
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">
              {completedTasksCount === 0 ? 'Week 1 foundations ready' : `${Math.round((completedTasksCount / 22) * 100)}% completed`}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE: Wispr Flow Interactive Annotation Comparison */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-mono tracking-wider text-ink-muted font-semibold">
            Live Analysis & Annotations
          </h3>
          <span className="text-[11px] text-teal-800 font-medium">
            Based on feedback from 30+ faculty reviewers
          </span>
        </div>
        <WisprShowcase onLoadTemplateInStudio={() => onNavigate('email')} />
      </section>

      {/* THREE CORE RESEARCH TRACKS: IITs, DRDO & ISRO */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-ink-muted font-bold">
              Three Core Research Tracks (IITs • DRDO • ISRO)
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5">
              Target premier academic laboratories, national defence establishments, or space exploration centres.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto font-semibold">
            All 3 Tracks Supported
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Track 1: IITs Academic Research Track */}
          <div className="wispr-card p-6 space-y-4 flex flex-col justify-between bg-gradient-to-b from-indigo-50/30 to-white hover:border-indigo-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="wispr-pill bg-indigo-50 text-indigo-900 border-indigo-200 text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  Academic Track
                </span>
                <span className="text-[11px] font-mono text-indigo-700 font-bold">1,411 IIT Faculty</span>
              </div>
              <h4 className="text-xl font-serif-title font-semibold text-ink-primary">
                IITs Faculty & Labs
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Connect directly with professors working on AI, robotics, quantum tech, mechanical and physical sciences.
              </p>

              {/* Mini keyword pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                  Quick Filter by Domain
                </span>
                <div className="flex flex-wrap gap-1">
                  {['Deep Learning', 'Robotics', 'Quantum', 'VLSI'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setMiniQuery(k)}
                      className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer border ${
                        miniQuery === k
                          ? 'bg-indigo-700 text-white border-indigo-700 font-medium'
                          : 'bg-white hover:bg-slate-50 border-stone-line text-ink-secondary'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Preview */}
              <div className="space-y-1.5 pt-2 border-t border-stone-line/70">
                {livePreviewFaculty.slice(0, 2).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onNavigate('faculty')}
                    className="p-2.5 bg-white hover:bg-indigo-50/50 rounded-xl border border-stone-line transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-ink-primary block text-[11px]">{f.name}</span>
                      <span className="text-ink-muted text-[10px]">
                        {f.institution} • {f.department}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('faculty')}
              className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-950 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Explore 1,411 IIT Faculty</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
            </button>
          </div>

          {/* Track 2: DRDO Defence R&D Track */}
          <div className="wispr-card p-6 space-y-4 flex flex-col justify-between bg-gradient-to-b from-amber-50/30 to-white hover:border-amber-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="wispr-pill bg-amber-50 text-amber-900 border-amber-200 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  Defence Track
                </span>
                <span className="text-[11px] font-mono text-amber-700 font-bold">50 Defence Labs</span>
              </div>
              <h4 className="text-xl font-serif-title font-semibold text-ink-primary">
                DRDO Laboratories
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                National defence labs developing radar, aeronautics, combat vehicles, materials and cyber defence technologies.
              </p>

              <div className="p-3 rounded-xl border border-amber-200/80 bg-white space-y-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                  Application Protocol
                </span>
                <div className="space-y-1.5 text-[11px] text-ink-secondary">
                  <p>1. Check official circulars at <code className="font-mono text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">drdo.gov.in</code></p>
                  <p>2. College bonafide letter & HOD/Dean NOC mandatory</p>
                  <p>3. Submit procedural inquiry via Template C if unlisted</p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-line text-[11px] text-ink-muted">
                <span className="font-medium text-ink-primary block mb-0.5">Key Facilities:</span>
                CAIR (Bengaluru), ADE (Bengaluru), ASL (Hyderabad), DMRL (Hyderabad), DIAT (Pune).
              </div>
            </div>

            <button
              onClick={() => onNavigate('drdo')}
              className="w-full py-2.5 px-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-950 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Browse 50 DRDO Labs</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>

          {/* Track 3: ISRO Space Science & Tech Track */}
          <div className="wispr-card p-6 space-y-4 flex flex-col justify-between bg-gradient-to-b from-sky-50/30 to-white hover:border-sky-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="wispr-pill bg-sky-50 text-sky-900 border-sky-200 text-[11px]">
                  <Rocket className="w-3.5 h-3.5 text-sky-600" />
                  Space Tech Track
                </span>
                <span className="text-[11px] font-mono text-sky-700 font-bold">20 Space Centres</span>
              </div>
              <h4 className="text-xl font-serif-title font-semibold text-ink-primary">
                ISRO Space Centres
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                India&apos;s premier space programme centres for satellite design, launch vehicle propulsion, remote sensing, and Gaganyaan.
              </p>

              <div className="p-3 rounded-xl border border-sky-200/80 bg-white space-y-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-sky-900 tracking-wider block">
                  Application Protocol
                </span>
                <div className="space-y-1.5 text-[11px] text-ink-secondary">
                  <p>1. Check HRD notices at centre portals on <code className="font-mono text-sky-800 bg-sky-50 px-1 py-0.2 rounded border border-sky-200">isro.gov.in</code></p>
                  <p>2. Min 60% / 6.5+ CGPA & College Bonafide/NOC needed</p>
                  <p>3. Direct inquiries to Centre HRD / Student Training Desk</p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-line text-[11px] text-ink-muted">
                <span className="font-medium text-ink-primary block mb-0.5">Key Centres:</span>
                VSSC (Kerala), URSC (Bengaluru), SAC (Ahmedabad), NRSC (Hyderabad), IIRS (Dehradun).
              </div>
            </div>

            <button
              onClick={() => onNavigate('isro')}
              className="w-full py-2.5 px-4 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-sky-950 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Browse 20 ISRO Centres</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-700" />
            </button>
          </div>
        </div>
      </section>

      {/* The 6-Stage Process (Prepare -> Explore -> Read -> Reach out -> Follow up -> Interview) */}
      <section className="rounded-2xl bg-white border border-stone-line p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-line pb-4">
          <div>
            <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
              The 6-Stage Application Process
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Prepare → Explore → Read → Reach out → Follow up → Interview
            </p>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full 6-Week Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              onClick={step.action}
              className="p-4 rounded-xl border border-stone-line hover:border-stone-border bg-[#FDFCFB] hover:bg-stone-hover/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold flex items-center justify-center">
                    {step.num}
                  </span>
                  <span className="text-[10px] text-ink-muted uppercase tracking-wider font-mono">
                    Phase {step.num}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-ink-primary group-hover:text-teal-700 transition-colors">
                  {step.title}
                </h4>
                <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-stone-line/60 flex items-center justify-between text-[11px] text-teal-700 font-medium">
                <span>Open module</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WISPR FLOW STYLE FAQ ACCORDION */}
      <section className="space-y-4">
        <div className="border-b border-stone-line pb-3">
          <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Objective guidance on cold emails, eligibility, and academic expectations.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className="wispr-card overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas-subtle/30"
                >
                  <span className="font-semibold text-xs sm:text-sm text-ink-primary font-serif-title">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-ink-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-ink-secondary leading-relaxed border-t border-stone-line/60 mt-1 animate-fade-in">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
