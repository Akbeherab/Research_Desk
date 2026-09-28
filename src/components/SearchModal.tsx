import React, { useState, useEffect, useRef } from 'react';
import { Search, GraduationCap, Building2, Rocket, BookOpen, X, ArrowRight } from 'lucide-react';
import { FacultyMember, DrdoLab, IsroCentre } from '../types';
import { PRACTICAL_GUIDES } from '../data/resourcesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  facultyList: FacultyMember[];
  drdoLabs: DrdoLab[];
  isroCentres: IsroCentre[];
  onSelectFaculty: (faculty: FacultyMember) => void;
  onSelectDrdoLab: (lab: DrdoLab) => void;
  onSelectIsroCentre: (centre: IsroCentre) => void;
  onSelectGuide: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  facultyList,
  drdoLabs,
  isroCentres,
  onSelectFaculty,
  onSelectDrdoLab,
  onSelectIsroCentre,
  onSelectGuide,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingFaculty = q
    ? facultyList
        .filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.researchInterests.toLowerCase().includes(q) ||
            f.institution.toLowerCase().includes(q) ||
            f.department.toLowerCase().includes(q)
        )
        .slice(0, 5)
    : [];

  const matchingDrdo = q
    ? drdoLabs
        .filter(
          (l) =>
            l.labName.toLowerCase().includes(q) ||
            l.acronym.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q) ||
            l.researchAreasRaw.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchingIsro = q
    ? isroCentres
        .filter(
          (c) =>
            c.labName.toLowerCase().includes(q) ||
            c.acronym.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.researchAreasRaw.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchingGuides = q
    ? PRACTICAL_GUIDES.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.summary.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults =
    matchingFaculty.length > 0 ||
    matchingDrdo.length > 0 ||
    matchingIsro.length > 0 ||
    matchingGuides.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-ink-primary/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-line max-w-2xl w-full shadow-float overflow-hidden flex flex-col max-h-[80vh] animate-fade-in">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-line flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 1,411 IIT faculty, 50 DRDO labs, 20 ISRO centres, or topics..."
            className="flex-1 bg-transparent text-sm text-ink-primary outline-none font-medium placeholder:text-ink-muted"
          />
          <button
            onClick={onClose}
            className="p-1 text-ink-muted hover:text-ink-primary text-xs font-mono bg-stone-hover rounded border border-stone-line"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <div className="py-8 text-center space-y-1.5 text-ink-muted">
              <Search className="w-8 h-8 text-ink-faint mx-auto stroke-1" />
              <p className="font-medium text-ink-secondary">Search across the entire workspace</p>
              <p className="text-[11px]">
                Type at least 2 characters to search 1,411 IIT faculty, 50 DRDO labs, 20 ISRO centres, and practical guides.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-ink-muted">
              No results found for &ldquo;{query}&rdquo;. Try another topic or institution acronym.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Matching Faculty */}
              {matchingFaculty.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-700 px-2">
                    IIT Professors & Researchers ({matchingFaculty.length})
                  </span>
                  <div className="space-y-1">
                    {matchingFaculty.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onSelectFaculty(f);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-hover/80 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-stone-line"
                      >
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-ink-primary">{f.name}</span>
                            <span className="text-ink-muted block text-[11px]">
                              {f.institution} • {f.department}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching DRDO Labs */}
              {matchingDrdo.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-line/60">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-700 px-2">
                    DRDO Defence Laboratories ({matchingDrdo.length})
                  </span>
                  <div className="space-y-1">
                    {matchingDrdo.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onSelectDrdoLab(l);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-hover/80 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-stone-line"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-ink-primary">{l.labName}</span>
                            <span className="text-ink-muted block text-[11px]">
                              {l.orgType} • {l.location}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching ISRO Centres */}
              {matchingIsro.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-line/60">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-700 px-2">
                    ISRO Space Centres & Institutes ({matchingIsro.length})
                  </span>
                  <div className="space-y-1">
                    {matchingIsro.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectIsroCentre(c);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-hover/80 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-stone-line"
                      >
                        <div className="flex items-center gap-2.5">
                          <Rocket className="w-4 h-4 text-sky-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-ink-primary">{c.labName} ({c.acronym})</span>
                            <span className="text-ink-muted block text-[11px]">
                              {c.orgType} • {c.location}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Guides */}
              {matchingGuides.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-line/60">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-muted px-2">
                    Guides & Advice ({matchingGuides.length})
                  </span>
                  <div className="space-y-1">
                    {matchingGuides.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          onSelectGuide();
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-stone-hover/80 transition-colors cursor-pointer flex items-center justify-between border border-transparent hover:border-stone-line"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                          <div>
                            <span className="font-semibold text-ink-primary">{g.title}</span>
                            <span className="text-ink-muted block text-[11px]">
                              {g.category} • {g.readTime}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
