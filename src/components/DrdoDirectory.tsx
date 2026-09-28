import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
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
  Compass
} from 'lucide-react';
import { DrdoLab, ApplicationRecord } from '../types';
import {
  getSavedDrdoIds,
  toggleSavedDrdoId,
  getContactNotes,
  saveContactNote
} from '../utils/storage';

interface DrdoDirectoryProps {
  drdoLabs: DrdoLab[];
  onPrepareLabInquiry: (lab: DrdoLab) => void;
  onAddToTracker: (appData: Partial<ApplicationRecord>) => void;
}

export const DrdoDirectory: React.FC<DrdoDirectoryProps> = ({
  drdoLabs,
  onPrepareLabInquiry,
  onAddToTracker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedContactType, setSelectedContactType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [onlySaved, setOnlySaved] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedDrdoIds());
  const [contactNotes, setContactNotes] = useState<Record<string, string>>(() => getContactNotes());

  const [activeLab, setActiveLab] = useState<DrdoLab | null>(null);
  const [activeNoteText, setActiveNoteText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // States
  const states = useMemo(() => {
    const s = new Set<string>();
    drdoLabs.forEach((l) => s.add(l.state));
    return Array.from(s).sort();
  }, [drdoLabs]);

  // Unique research domains
  const domains = useMemo(() => {
    const d = new Set<string>();
    drdoLabs.forEach((l) => l.researchAreas.forEach((area) => d.add(area)));
    return Array.from(d).sort();
  }, [drdoLabs]);

  // Filtering
  const filteredLabs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return drdoLabs.filter((lab) => {
      if (onlySaved && !savedIds.includes(lab.id)) return false;
      if (selectedState !== 'all' && lab.state !== selectedState) return false;
      if (selectedContactType !== 'all' && lab.contactType !== selectedContactType) return false;
      if (selectedDomain !== 'all' && !lab.researchAreas.includes(selectedDomain)) return false;

      if (!q) return true;
      return (
        lab.labName.toLowerCase().includes(q) ||
        lab.acronym.toLowerCase().includes(q) ||
        lab.location.toLowerCase().includes(q) ||
        lab.state.toLowerCase().includes(q) ||
        lab.researchAreasRaw.toLowerCase().includes(q) ||
        lab.pocName.toLowerCase().includes(q)
      );
    });
  }, [drdoLabs, searchQuery, selectedState, selectedDomain, selectedContactType, onlySaved, savedIds]);

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = toggleSavedDrdoId(id);
    setSavedIds(updated);
  };

  const handleCopyEmail = (email: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDrawer = (lab: DrdoLab) => {
    setActiveLab(lab);
    setActiveNoteText(contactNotes[lab.id] || '');
  };

  const handleSaveNotes = () => {
    if (!activeLab) return;
    saveContactNote(activeLab.id, activeNoteText);
    setContactNotes({ ...contactNotes, [activeLab.id]: activeNoteText });
    setNotification(`Saved note for ${activeLab.acronym}.`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleQuickAddTracker = (lab: DrdoLab, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onAddToTracker({
      name: lab.labName,
      institution: `DRDO (${lab.acronym})`,
      researchArea: lab.researchAreas.join(', '),
      contactEmail: lab.email,
      sourceLink: lab.officialUrl,
      applicationRoute: 'lab_inquiry',
      status: 'Shortlisted',
      appliedDate: '',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextAction: 'Check official circular on drdo.gov.in & draft process inquiry',
      nextActionDate: '',
      followUpCount: 0,
      deadline: '',
      notes: `POC: ${lab.pocName}. Location: ${lab.location}.`,
    });
    setNotification(`Added ${lab.acronym} to My Applications as Shortlisted.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Verification Warning Banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
                DRDO Laboratories & Centres
              </h2>
              <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
                50 Facilities
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
              Directory of 50 defence research establishments across India. Note that director's emails represent executive offices; use our structured inquiry template or formal student training circulars.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-stone-line rounded-lg p-0.5 shadow-subtle">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-stone-hover text-ink-primary font-medium' : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs cursor-pointer flex items-center gap-1 ${
                  viewMode === 'cards' ? 'bg-stone-hover text-ink-primary font-medium' : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Verification Notice Required by Guidelines */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 shadow-subtle flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-900">
              Mandatory Source & Application Guidance
            </h4>
            <p className="leading-relaxed text-amber-900/90">
              <strong>These contacts come from a supplied resource. Check the organisation’s official website for current contacts, eligibility, and application instructions before applying.</strong> Most DRDO laboratories require formal project-training applications backed by a college sponsorship letter / NOC. Never send unsolicited mass emails.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="text-xs py-2 px-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg flex items-center justify-between shadow-subtle animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="font-bold text-teal-700 ml-2">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-line p-4 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lab name, acronym (e.g. 'CAIR', 'RCI'), research area, or city..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs text-ink-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-ink-muted hover:text-ink-primary text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              onlySaved
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-[#FAF8F5] border-stone-line text-ink-secondary hover:bg-stone-hover'
            }`}
          >
            {onlySaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5 text-ink-muted" />}
            <span>Saved Labs ({savedIds.length})</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-line/60 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">
              State / Location
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary outline-none"
            >
              <option value="all">All States ({drdoLabs.length} labs)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">
              Research Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary outline-none"
            >
              <option value="all">All Domains</option>
              {domains.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">
              Contact Channel
            </label>
            <select
              value={selectedContactType}
              onChange={(e) => setSelectedContactType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary outline-none"
            >
              <option value="all">All Contact Types</option>
              <option value="director_office">Director's Office</option>
              <option value="general_contact">General Lab Contact</option>
              <option value="webmaster">Webmaster / Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-stone-line overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-stone-line text-ink-secondary font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">S.No</th>
                  <th className="py-3 px-4">Laboratory & Org Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Contact Type & Email</th>
                  <th className="py-3 px-4">Research Domains</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-line/70">
                {filteredLabs.map((lab) => {
                  const isSaved = savedIds.includes(lab.id);
                  return (
                    <tr
                      key={lab.id}
                      onClick={() => handleOpenDrawer(lab)}
                      className="hover:bg-stone-hover/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-center font-mono text-ink-muted">
                        {lab.sNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink-primary group-hover:text-teal-800 transition-colors">
                            {lab.labName}
                          </span>
                        </div>
                        <span className="text-[10px] text-ink-muted font-mono block mt-0.5">
                          {lab.orgType} • Acronym: {lab.acronym}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-ink-secondary">
                          <MapPin className="w-3 h-3 text-ink-muted" />
                          <span>{lab.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-hover text-ink-secondary border border-stone-line">
                            {lab.contactTypeLabel}
                          </span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                            <span>{lab.email}</span>
                            <button
                              onClick={(e) => handleCopyEmail(lab.email, lab.id, e)}
                              className="text-ink-muted hover:text-ink-primary p-0.5 rounded"
                              title="Copy email"
                            >
                              {copiedId === lab.id ? (
                                <Check className="w-3 h-3 text-teal-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {lab.researchAreas.map((area) => (
                            <span
                              key={area}
                              className="text-[10px] bg-[#FAF8F5] text-ink-secondary border border-stone-line px-1.5 py-0.5 rounded"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleSave(lab.id)}
                            className="p-1.5 text-ink-muted hover:text-amber-600 rounded transition-colors"
                            title={isSaved ? 'Remove from saved' : 'Save lab'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-100" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onPrepareLabInquiry(lab)}
                            className="px-2 py-1 bg-white hover:bg-stone-hover border border-stone-line text-ink-primary text-[11px] font-medium rounded shadow-subtle transition-all cursor-pointer"
                            title="Compose process inquiry in Email Studio (Template C)"
                          >
                            Inquiry Draft
                          </button>
                          <button
                            onClick={(e) => handleQuickAddTracker(lab, e)}
                            className="p-1.5 text-ink-muted hover:text-teal-700 rounded"
                            title="Add to application tracker"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLabs.map((lab) => {
            const isSaved = savedIds.includes(lab.id);
            return (
              <div
                key={lab.id}
                onClick={() => handleOpenDrawer(lab)}
                className="wispr-card p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {lab.acronym}
                    </span>
                    <button
                      onClick={(e) => handleToggleSave(lab.id, e)}
                      className="p-1 text-ink-muted hover:text-amber-600"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-100" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-ink-primary font-serif-title group-hover:text-teal-800 transition-colors">
                    {lab.labName}
                  </h3>
                  <p className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-ink-faint" />
                    {lab.location}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {lab.researchAreas.map((area) => (
                      <span
                        key={area}
                        className="text-[10px] bg-[#FAF8F5] text-ink-secondary border border-stone-line px-1.5 py-0.5 rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 p-2 bg-[#FAF8F5] rounded border border-stone-line/70 text-[11px]">
                    <span className="block text-[10px] text-ink-muted font-mono uppercase">
                      Channel: {lab.contactTypeLabel}
                    </span>
                    <span className="font-mono text-ink-secondary truncate block mt-0.5">
                      {lab.email}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-line/70 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleCopyEmail(lab.email, lab.id)}
                    className="text-[11px] text-ink-muted hover:text-ink-primary font-mono flex items-center gap-1"
                  >
                    {copiedId === lab.id ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === lab.id ? 'Copied' : 'Copy Email'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPrepareLabInquiry(lab)}
                      className="px-2 py-1 bg-white hover:bg-stone-hover border border-stone-line text-ink-primary text-[11px] font-medium rounded shadow-subtle cursor-pointer"
                    >
                      Process Inquiry
                    </button>
                    <button
                      onClick={(e) => handleQuickAddTracker(lab, e)}
                      className="p-1 text-ink-muted hover:text-teal-700"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DRDO Detail Drawer with 5-Step Application Route Checklist */}
      {activeLab && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-ink-primary/30 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveLab(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-float border-l border-stone-line flex flex-col z-10 animate-slide-left overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-stone-line bg-[#FAF8F5] flex items-start justify-between">
              <div>
                <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] mb-2 font-mono">
                  DRDO • {activeLab.acronym}
                </span>
                <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
                  {activeLab.labName}
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {activeLab.orgType} • {activeLab.location}
                </p>
              </div>

              <button
                onClick={() => setActiveLab(null)}
                className="p-1.5 text-ink-muted hover:text-ink-primary rounded-lg text-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Mandatory Checklist Required by Guidelines */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-teal-700" />
                  <h4 className="font-semibold text-teal-950 text-xs">
                    5-Step DRDO Application Route Checklist
                  </h4>
                </div>
                <ol className="space-y-2 text-ink-secondary text-[11px] list-decimal list-inside leading-relaxed">
                  <li>
                    <strong>Look for current official training notice:</strong> Check official training or apprentice notifications at <code className="font-mono text-teal-900">drdo.gov.in</code> or RAC.
                  </li>
                  <li>
                    <strong>Check eligibility & required documents:</strong> Marksheets, recommendation letters, and college NOC are required <em>only if explicitly requested</em> by the official notice.
                  </li>
                  <li>
                    <strong>Follow the specified application channel:</strong> If an HR / Training Officer is specified, use that route rather than writing to the Director.
                  </li>
                  <li>
                    <strong>If no route is published:</strong> Send a brief, polite inquiry asking for the correct student training protocol (use Template C in Email Studio).
                  </li>
                  <li>
                    <strong>Record source and date checked:</strong> Keep a record of the web circular URL and date in your Application Tracker.
                  </li>
                </ol>
              </div>

              {/* Source Metadata & Contact Details */}
              <div className="space-y-3">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Supplied Resource Metadata
                </span>

                <div className="p-3.5 rounded-lg border border-stone-line bg-[#FAF8F5] space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-stone-line/60">
                    <span className="text-ink-muted">Supplied POC / Official</span>
                    <span className="font-semibold text-ink-primary">{activeLab.pocName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-line/60">
                    <span className="text-ink-muted">Channel Type</span>
                    <span className="text-ink-primary font-mono">{activeLab.contactTypeLabel}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-ink-muted">Contact Email</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-ink-primary">{activeLab.email}</span>
                      <button
                        onClick={() => handleCopyEmail(activeLab.email, 'drdo-drawer')}
                        className="text-teal-700 hover:text-teal-900"
                        title="Copy email"
                      >
                        {copiedId === 'drdo-drawer' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(activeLab.labName + ' DRDO internship project training')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-primary font-medium shadow-subtle"
                  >
                    <span>Search Official Lab Notices</span>
                    <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                  </a>
                  <a
                    href="https://www.drdo.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 py-2 px-3 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary"
                  >
                    <span>drdo.gov.in</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>
              </div>

              {/* Research Areas */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Research Areas (from Supplied Compilation)
                </span>
                <div className="p-3 rounded-lg border border-stone-line bg-[#FAF8F5] leading-relaxed text-ink-primary">
                  {activeLab.researchAreasRaw}
                </div>
              </div>

              {/* Personal Notes */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Personal Notes / Checked Date
                </span>
                <textarea
                  rows={3}
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  placeholder="Record when you checked their website, notice status, or department requirements..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 rounded bg-stone-hover hover:bg-stone-line/70 text-ink-primary text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-stone-line bg-[#FAF8F5] flex items-center gap-2">
              <button
                onClick={() => handleToggleSave(activeLab.id)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  savedIds.includes(activeLab.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-line text-ink-secondary hover:bg-stone-hover'
                }`}
              >
                {savedIds.includes(activeLab.id) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Lab</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onPrepareLabInquiry(activeLab);
                  setActiveLab(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-sm transition-all text-center cursor-pointer"
              >
                Draft Inquiry in Studio (Template C)
              </button>

              <button
                onClick={(e) => {
                  handleQuickAddTracker(activeLab, e);
                }}
                className="p-2 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary"
                title="Add to My Applications"
              >
                <PlusCircle className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
