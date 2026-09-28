import React, { useState, useMemo } from 'react';
import {
  Rocket,
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Mail,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
  Info,
  MapPin,
  X,
  FileCheck2,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Compass,
  Satellite,
  Radio,
  FileText
} from 'lucide-react';
import { IsroCentre, ApplicationRecord } from '../types';
import {
  getSavedIsroIds,
  toggleSavedIsroId,
  getContactNotes,
  saveContactNote
} from '../utils/storage';

interface IsroDirectoryProps {
  isroCentres: IsroCentre[];
  onPrepareLabInquiry: (centre: IsroCentre) => void;
  onAddToTracker: (appData: Partial<ApplicationRecord>) => void;
}

export const IsroDirectory: React.FC<IsroDirectoryProps> = ({
  isroCentres,
  onPrepareLabInquiry,
  onAddToTracker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedContactType, setSelectedContactType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [onlySaved, setOnlySaved] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedIsroIds());
  const [contactNotes, setContactNotes] = useState<Record<string, string>>(() => getContactNotes());

  const [activeCentre, setActiveCentre] = useState<IsroCentre | null>(null);
  const [activeNoteText, setActiveNoteText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // States
  const states = useMemo(() => {
    const s = new Set<string>();
    isroCentres.forEach((l) => {
      // Split multi-state like "Kerala / Karnataka"
      l.state.split('/').forEach((part) => s.add(part.trim()));
    });
    return Array.from(s).sort();
  }, [isroCentres]);

  // Unique research domains
  const domains = useMemo(() => {
    const d = new Set<string>();
    isroCentres.forEach((l) => l.researchAreas.forEach((area) => d.add(area)));
    return Array.from(d).sort();
  }, [isroCentres]);

  // Filtering
  const filteredCentres = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return isroCentres.filter((centre) => {
      if (onlySaved && !savedIds.includes(centre.id)) return false;
      if (selectedState !== 'all' && !centre.state.toLowerCase().includes(selectedState.toLowerCase())) return false;
      if (selectedContactType === 'verified_email' && !centre.email) return false;
      if (selectedContactType === 'no_email' && centre.email) return false;
      if (selectedDomain !== 'all' && !centre.researchAreas.includes(selectedDomain)) return false;

      if (!q) return true;
      return (
        centre.labName.toLowerCase().includes(q) ||
        centre.acronym.toLowerCase().includes(q) ||
        centre.location.toLowerCase().includes(q) ||
        centre.state.toLowerCase().includes(q) ||
        centre.city.toLowerCase().includes(q) ||
        centre.researchAreasRaw.toLowerCase().includes(q) ||
        centre.pocName.toLowerCase().includes(q)
      );
    });
  }, [isroCentres, searchQuery, selectedState, selectedDomain, selectedContactType, onlySaved, savedIds]);

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = toggleSavedIsroId(id);
    setSavedIds(updated);
  };

  const handleCopyEmail = (email: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDrawer = (centre: IsroCentre) => {
    setActiveCentre(centre);
    setActiveNoteText(contactNotes[centre.id] || '');
  };

  const handleSaveNotes = () => {
    if (!activeCentre) return;
    saveContactNote(activeCentre.id, activeNoteText);
    setContactNotes({ ...contactNotes, [activeCentre.id]: activeNoteText });
    setNotification(`Saved note for ${activeCentre.acronym}.`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleQuickAddTracker = (centre: IsroCentre, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onAddToTracker({
      name: centre.labName,
      institution: `ISRO (${centre.acronym})`,
      researchArea: centre.researchAreas.join(', '),
      contactEmail: centre.email || '',
      sourceLink: centre.officialUrl,
      applicationRoute: 'lab_inquiry',
      status: 'Shortlisted',
      appliedDate: '',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextAction: 'Check student project/internship circular on centre portal & draft inquiry',
      nextActionDate: '',
      followUpCount: 0,
      deadline: '',
      notes: `POC: ${centre.pocName}. Location: ${centre.location}. Contact Route: ${centre.contactTypeLabel}.`,
    });
    setNotification(`Added ${centre.acronym} to My Applications as Shortlisted.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Verification Guidance Banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="wispr-pill bg-sky-50 text-sky-900 border-sky-200 text-xs">
                <Rocket className="w-3.5 h-3.5 text-sky-600" />
                20 Space Centres & Autonomous Institutes
              </span>
              <span className="font-mono text-xs text-ink-muted hidden md:inline">
                Department of Space (DOS)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-ink-primary mt-1 tracking-tight">
              ISRO Centres & Space Laboratories
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Verified public leadership and official institutional contact routes across India’s premier space research establishments.
            </p>
          </div>

          {/* View Mode Toggle & Saved Counter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`wispr-pill text-xs cursor-pointer ${
                onlySaved
                  ? 'bg-sky-100 text-sky-900 border-sky-300 font-semibold'
                  : 'bg-white text-ink-secondary border-stone-line hover:bg-stone-hover'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-sky-700 text-sky-700' : 'text-ink-muted'}`} />
              <span>Saved ({savedIds.length})</span>
            </button>

            <div className="flex items-center rounded-lg border border-stone-line bg-white p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-stone-hover text-ink-primary shadow-xs' : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-stone-hover text-ink-primary shadow-xs' : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Realistic ISRO Application Protocol Banner */}
        <div className="p-4 rounded-xl border border-sky-200/80 bg-sky-50/50 text-xs text-sky-950 flex items-start gap-3 shadow-xs">
          <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sky-900">
                Official ISRO Student Training & Internship Protocol
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Crucial for Applicants
              </span>
            </div>
            <p className="text-sky-900/90 leading-relaxed text-[11px]">
              Most ISRO centres (e.g. <strong>VSSC</strong>, <strong>URSC</strong>, <strong>SAC</strong>, <strong>IIRS</strong>, <strong>NRSC</strong>) conduct student project work and internships through their designated <strong>HRD / Student Training Division</strong>. Direct cold emails to Directors should only be sent if no separate training notice exists, or to request the appropriate training desk route (using Template C). Always secure an official <strong>Bonafide Certificate / NOC</strong> and minimum 60% / 6.5 CGPA score sheet from your college prior to applying.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-stone-line shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ISRO centre, acronym (e.g. 'URSC', 'VSSC'), city, or space domain..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs sm:text-sm text-ink-primary focus:outline-none focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Domain Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-stone-line bg-[#FAF8F5] text-ink-secondary focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Domains ({domains.length})</option>
              {domains.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-stone-line bg-[#FAF8F5] text-ink-secondary focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Regions ({states.length})</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Email Availability Filter */}
            <select
              value={selectedContactType}
              onChange={(e) => setSelectedContactType(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-stone-line bg-[#FAF8F5] text-ink-secondary focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Contact Routes</option>
              <option value="verified_email">Has Direct Listed Email (18)</option>
              <option value="no_email">HQ / Official Portal Route (2)</option>
            </select>
          </div>
        </div>

        {/* Results Count & Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted pt-1">
          <div>
            Showing <span className="font-semibold text-ink-primary">{filteredCentres.length}</span> of {isroCentres.length} space centres
            {onlySaved && ' (Saved only)'}
          </div>
          {(selectedState !== 'all' || selectedDomain !== 'all' || selectedContactType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('all');
                setSelectedDomain('all');
                setSelectedContactType('all');
                setSearchQuery('');
                setOnlySaved(false);
              }}
              className="text-sky-700 hover:text-sky-900 font-medium underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink-primary text-white text-xs px-4 py-2.5 rounded-xl shadow-float flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Directory Content: Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-stone-line bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-line bg-[#FAF8F5] text-ink-muted font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Centre Name & Acronym</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Research & Mission Focus</th>
                  <th className="py-3 px-4">Director / POC & Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-line">
                {filteredCentres.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-muted">
                      No ISRO centres matched your query. Try resetting your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredCentres.map((centre) => {
                    const isSaved = savedIds.includes(centre.id);
                    const hasNote = Boolean(contactNotes[centre.id]);

                    return (
                      <tr
                        key={centre.id}
                        onClick={() => handleOpenDrawer(centre)}
                        className="hover:bg-stone-hover/60 transition-colors cursor-pointer group"
                      >
                        {/* Index & Bookmark */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => handleToggleSave(centre.id, e)}
                            className="text-ink-muted hover:text-sky-600 transition-colors"
                            title={isSaved ? 'Remove from saved' : 'Save this centre'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-sky-600 fill-sky-600" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-ink-faint group-hover:text-ink-muted" />
                            )}
                          </button>
                        </td>

                        {/* Centre Name & Acronym */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-ink-primary hover:text-sky-700 transition-colors">
                                {centre.labName}
                              </span>
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200">
                                {centre.acronym}
                              </span>
                            </div>
                            <div className="text-[11px] text-ink-muted flex items-center gap-2">
                              <span>{centre.orgType}</span>
                              {hasNote && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-sky-700 font-medium">
                                  • Note attached
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-ink-secondary">
                            <MapPin className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                            <span>{centre.city}</span>
                          </div>
                          <span className="text-[10px] text-ink-muted block pl-4.5">
                            {centre.state}
                          </span>
                        </td>

                        {/* Research Areas */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {centre.researchAreas.slice(0, 3).map((area, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-sans"
                              >
                                {area}
                              </span>
                            ))}
                            {centre.researchAreas.length > 3 && (
                              <span className="text-[10px] text-ink-muted self-center">
                                +{centre.researchAreas.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* POC & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-medium text-ink-primary block text-[11px]">
                              {centre.pocName}
                            </span>
                            {centre.email ? (
                              <div className="flex items-center gap-1.5">
                                <code className="font-mono text-[10px] text-sky-800 bg-sky-50 px-1 py-0.2 rounded border border-sky-200">
                                  {centre.email}
                                </code>
                                <button
                                  onClick={(e) => handleCopyEmail(centre.email!, centre.id, e)}
                                  className="text-ink-muted hover:text-sky-700 transition-colors p-0.5"
                                  title="Copy official email"
                                >
                                  {copiedId === centre.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 inline-block font-mono">
                                Use DOS/HQ Portal Route
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleQuickAddTracker(centre, e)}
                              className="p-1.5 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
                              title="Add to My Applications as Shortlisted"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-sky-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPrepareLabInquiry(centre);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 font-medium text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Generate inquiry email in Email Studio"
                            >
                              <Mail className="w-3 h-3 text-sky-700" />
                              <span>Draft</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Directory Content: Card Grid View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCentres.length === 0 ? (
            <div className="col-span-full py-12 text-center text-ink-muted bg-white rounded-2xl border border-stone-line">
              No ISRO centres matched your query. Try resetting your search filters.
            </div>
          ) : (
            filteredCentres.map((centre) => {
              const isSaved = savedIds.includes(centre.id);
              const hasNote = Boolean(contactNotes[centre.id]);

              return (
                <div
                  key={centre.id}
                  onClick={() => handleOpenDrawer(centre)}
                  className="wispr-card p-5 space-y-4 flex flex-col justify-between cursor-pointer hover:border-sky-300 hover:shadow-card group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Acronym Badge & Bookmark */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                        {centre.acronym}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {hasNote && (
                          <span className="text-[10px] text-sky-700 font-mono px-1.5 py-0.2 bg-sky-50 rounded border border-sky-200">
                            Note
                          </span>
                        )}
                        <button
                          onClick={(e) => handleToggleSave(centre.id, e)}
                          className="p-1 rounded text-ink-muted hover:text-sky-600 transition-colors"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-sky-600 fill-sky-600" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-ink-faint" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Centre Title */}
                    <div>
                      <h3 className="font-serif-title text-base font-semibold text-ink-primary group-hover:text-sky-800 transition-colors line-clamp-2">
                        {centre.labName}
                      </h3>
                      <p className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ink-muted shrink-0" />
                        <span>{centre.location}</span>
                      </p>
                    </div>

                    {/* Research Focus Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {centre.researchAreas.slice(0, 3).map((area, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          {area}
                        </span>
                      ))}
                      {centre.researchAreas.length > 3 && (
                        <span className="text-[10px] text-ink-muted self-center">
                          +{centre.researchAreas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom POC & Quick Actions */}
                  <div className="pt-3 border-t border-stone-line space-y-2.5">
                    <div className="text-[11px] space-y-0.5">
                      <span className="text-ink-muted block text-[10px] uppercase font-mono tracking-wider">
                        {centre.contactTypeLabel}
                      </span>
                      <span className="font-medium text-ink-primary block truncate">
                        {centre.pocName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {centre.email ? (
                        <button
                          onClick={(e) => handleCopyEmail(centre.email!, centre.id, e)}
                          className="text-[11px] font-mono text-sky-800 hover:text-sky-950 flex items-center gap-1 py-1"
                        >
                          {copiedId === centre.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-sans">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-ink-muted" />
                              <span className="truncate max-w-[140px]">{centre.email}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          HQ Portal Route
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleQuickAddTracker(centre, e)}
                          className="p-1.5 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary"
                          title="Add to My Applications"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-sky-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPrepareLabInquiry(centre);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 font-medium text-[11px] flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-sky-700" />
                          <span>Draft</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Detail & Notes Drawer Modal */}
      {activeCentre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-line max-w-2xl w-full shadow-float overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-line bg-[#FAF8F5] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                    {activeCentre.acronym}
                  </span>
                  <span className="text-xs text-ink-muted">{activeCentre.orgType}</span>
                </div>
                <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
                  {activeCentre.labName}
                </h3>
                <p className="text-xs text-ink-secondary flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{activeCentre.location}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveCentre(null)}
                className="p-1 rounded-full text-ink-muted hover:text-ink-primary hover:bg-stone-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-ink-secondary">
              {/* Official Source & Verification Notice */}
              <div className="p-3.5 rounded-xl border border-stone-line bg-canvas-subtle/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verification & Official Route Notice
                  </span>
                  <span className="font-mono text-[10px] text-ink-muted">
                    Source: {activeCentre.source}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-ink-secondary">
                  {activeCentre.verificationNotice}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <a
                    href={activeCentre.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 underline"
                  >
                    <span>Visit official ISRO centre page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Leadership & Contact Desk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-stone-line bg-white space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ink-muted block">
                    Leadership / {activeCentre.contactTypeLabel}
                  </span>
                  <p className="text-sm font-semibold text-ink-primary">{activeCentre.pocName}</p>
                  <p className="text-[11px] text-ink-muted">Designated Executive Office</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-line bg-white space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ink-muted block">
                    Contact Email
                  </span>
                  {activeCentre.email ? (
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <code className="font-mono text-xs text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {activeCentre.email}
                      </code>
                      <button
                        onClick={() => handleCopyEmail(activeCentre.email!, activeCentre.id)}
                        className="wispr-pill text-[11px] py-1 px-2 cursor-pointer"
                      >
                        {copiedId === activeCentre.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      Use the general ISRO / Department of Space contact and training application desk.
                    </p>
                  )}
                </div>
              </div>

              {/* Research & Technical Domains */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase font-bold text-ink-muted tracking-wider block">
                  Core Research & Technological Mandate
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {centreResearchTags(activeCentre).map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs bg-sky-50 text-sky-900 border border-sky-200 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-ink-muted italic pt-1">
                  &quot;{activeCentre.researchAreasRaw}&quot;
                </p>
              </div>

              {/* Personal Notes (Saved in browser localStorage) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase font-bold text-ink-muted tracking-wider block">
                    My Private Research Notes
                  </span>
                  <span className="text-[10px] text-ink-muted">Private to this browser</span>
                </div>
                <textarea
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  placeholder="Record relevant space missions, training circular dates, eligibility notes, or professor/scientist contacts here..."
                  className="w-full p-3 rounded-xl border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary focus:outline-none focus:border-sky-500 transition-all h-24 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="wispr-pill bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100 text-xs font-semibold cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-stone-line bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={(e) => handleToggleSave(activeCentre.id, e)}
                className={`wispr-pill text-xs cursor-pointer ${
                  savedIds.includes(activeCentre.id)
                    ? 'bg-sky-100 text-sky-900 border-sky-300 font-semibold'
                    : 'bg-white text-ink-secondary hover:bg-stone-hover'
                }`}
              >
                {savedIds.includes(activeCentre.id) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                    <span>Saved in My Bookmarks</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Save Centre</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleQuickAddTracker(activeCentre, e)}
                  className="px-3 py-1.5 rounded-full border border-stone-line bg-white hover:bg-stone-hover text-ink-primary text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-sky-700" />
                  <span>Add to Tracker</span>
                </button>

                <button
                  onClick={() => {
                    const c = activeCentre;
                    setActiveCentre(null);
                    onPrepareLabInquiry(c);
                  }}
                  className="px-4 py-1.5 rounded-full bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Prepare Inquiry in Email Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function centreResearchTags(centre: IsroCentre): string[] {
  if (centre.researchAreas && centre.researchAreas.length > 0) {
    return centre.researchAreas;
  }
  return centre.researchAreasRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}
