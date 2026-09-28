import React, { useState } from 'react';
import { Search, Calendar, Download, Upload, Check, Edit2 } from 'lucide-react';
import { exportBackupJSON, restoreBackupJSON } from '../utils/storage';

interface HeaderProps {
  currentTab: string;
  season: string;
  onSeasonChange: (newSeason: string) => void;
  onOpenGlobalSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  season,
  onSeasonChange,
  onOpenGlobalSearch,
  onToggleMobileMenu,
}) => {
  const [isEditingSeason, setIsEditingSeason] = useState(false);
  const [tempSeason, setTempSeason] = useState(season);
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const handleSaveSeason = () => {
    if (tempSeason.trim()) {
      onSeasonChange(tempSeason.trim());
    }
    setIsEditingSeason(false);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = restoreBackupJSON(json);
        if (success) {
          setRestoreNotice('Backup successfully restored. Reloading...');
          setTimeout(() => window.location.reload(), 900);
        } else {
          setRestoreNotice('Invalid backup file format.');
          setTimeout(() => setRestoreNotice(null), 3000);
        }
      } catch {
        setRestoreNotice('Failed to read JSON backup.');
        setTimeout(() => setRestoreNotice(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    start: { title: 'Start Here', subtitle: 'Overview, Onboarding & 3 Research Tracks' },
    faculty: { title: 'Faculty Directory', subtitle: '1,400+ Professors across Indian Institutes of Technology' },
    drdo: { title: 'DRDO Directory', subtitle: '50 Defence Research Laboratories & Associated Centres' },
    isro: { title: 'ISRO Directory', subtitle: '20 Space Centres, Laboratories & Research Institutes' },
    email: { title: 'Email Studio', subtitle: 'Honest, Concise Academic Outreach Generator' },
    tracker: { title: 'My Applications', subtitle: 'Personal Local Tracker & Follow-up Manager' },
    roadmap: { title: 'Research Roadmap', subtitle: '6-Week Step-by-Step Preparation Framework' },
    resources: { title: 'Resources & Guides', subtitle: 'Academic CV, README, Interview Prep & Opportunity Board' },
  };

  const info = tabTitles[currentTab] || { title: 'Research Internship Desk', subtitle: 'Undergraduate Research Portal' };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-stone-line px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-ink-secondary hover:text-ink-primary hover:bg-stone-hover rounded-full transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif-title font-semibold text-ink-primary tracking-tight">
                {info.title}
              </h1>
            </div>
            <p className="text-xs text-ink-muted hidden sm:block">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Season Pill (Wispr Flow style) */}
          <div className="relative">
            {isEditingSeason ? (
              <div className="flex items-center gap-1.5 bg-white border border-teal-600 rounded-full px-3 py-1 text-xs shadow-sm">
                <input
                  type="text"
                  value={tempSeason}
                  onChange={(e) => setTempSeason(e.target.value)}
                  className="w-32 bg-transparent text-xs text-ink-primary outline-none font-medium"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveSeason();
                    if (e.key === 'Escape') setIsEditingSeason(false);
                  }}
                />
                <button
                  onClick={handleSaveSeason}
                  className="text-teal-700 hover:text-teal-800 p-0.5 rounded-full"
                  title="Save season"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempSeason(season);
                  setIsEditingSeason(true);
                }}
                className="wispr-pill bg-white hover:bg-stone-hover border-stone-line text-ink-secondary hover:text-ink-primary text-xs cursor-pointer shadow-subtle group"
                title="Click to edit planning season"
              >
                <Calendar className="w-3 h-3 text-teal-600" />
                <span className="font-medium text-[11px] sm:text-xs">{season}</span>
                <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 transition-opacity ml-0.5" />
              </button>
            )}
          </div>

          {/* Quick Search Shortcut (Pill) */}
          <button
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-ink-secondary bg-white hover:bg-stone-hover border border-stone-line rounded-full shadow-subtle transition-all cursor-pointer"
            title="Search directory and resources (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-ink-muted" />
            <span className="hidden md:inline">Quick Find</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-stone-hover text-ink-muted rounded-full border border-stone-line">
              ⌘K
            </kbd>
          </button>

          {/* Data Backup / Export Menu */}
          <div className="flex items-center gap-1 bg-white border border-stone-line rounded-full p-0.5 shadow-subtle">
            <button
              onClick={exportBackupJSON}
              className="p-1.5 text-ink-muted hover:text-ink-primary hover:bg-stone-hover rounded-full transition-colors"
              title="Download complete JSON backup of tracker and notes"
              aria-label="Export backup"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <label
              className="p-1.5 text-ink-muted hover:text-ink-primary hover:bg-stone-hover rounded-full transition-colors cursor-pointer"
              title="Restore from JSON backup"
              aria-label="Restore backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <input
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {restoreNotice && (
        <div className="mt-2 text-xs py-1.5 px-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-md animate-fade-in flex items-center justify-between">
          <span>{restoreNotice}</span>
          <button onClick={() => setRestoreNotice(null)} className="text-teal-600 hover:text-teal-900 ml-2 font-bold">×</button>
        </div>
      )}
    </header>
  );
};
