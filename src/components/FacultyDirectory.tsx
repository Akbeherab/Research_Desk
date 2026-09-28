import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Mail,
  FileText,
  PlusCircle,
  Upload,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Info,
  Building,
  GraduationCap,
  Sparkles,
  X,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { FacultyMember, ApplicationRecord } from '../types';
import { explainFacultyMatch } from '../data';
import {
  getSavedFacultyIds,
  toggleSavedFacultyId,
  getContactNotes,
  saveContactNote,
  getPaperNotes,
  savePaperNote,
  StoredPaperNote,
  addApplication
} from '../utils/storage';

interface FacultyDirectoryProps {
  facultyList: FacultyMember[];
  onPrepareEmail: (faculty: FacultyMember, paperNote?: StoredPaperNote) => void;
  onAddToTracker: (appData: Partial<ApplicationRecord>) => void;
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  facultyList,
  onPrepareEmail,
  onAddToTracker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [onlySaved, setOnlySaved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedFacultyIds());
  const [contactNotes, setContactNotes] = useState<Record<string, string>>(() => getContactNotes());
  const [paperNotes, setPaperNotes] = useState<Record<string, StoredPaperNote>>(() => getPaperNotes());

  // Detail Drawer state
  const [activeFaculty, setActiveFaculty] = useState<FacultyMember | null>(null);
  const [activeNoteText, setActiveNoteText] = useState('');
  const [activePaper, setActivePaper] = useState<StoredPaperNote>({ title: '', url: '', note: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Institution and Department options
  const institutions = useMemo(() => {
    const set = new Set<string>();
    facultyList.forEach((f) => {
      if (f.institution) set.add(f.institution);
    });
    return Array.from(set).sort();
  }, [facultyList]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    facultyList.forEach((f) => {
      if (f.department) set.add(f.department);
    });
    return Array.from(set).sort();
  }, [facultyList]);

  // Filtering
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return facultyList.filter((f) => {
      if (onlySaved && !savedIds.includes(f.id)) return false;
      if (selectedInstitution !== 'all' && f.institution !== selectedInstitution) return false;
      if (selectedDepartment !== 'all' && f.department !== selectedDepartment) return false;

      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.researchInterests.toLowerCase().includes(q) ||
        f.institution.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
      );
    });
  }, [facultyList, searchQuery, selectedInstitution, selectedDepartment, onlySaved, savedIds]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = toggleSavedFacultyId(id);
    setSavedIds(updated);
  };

  const handleCopyEmail = (email: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDrawer = (faculty: FacultyMember) => {
    setActiveFaculty(faculty);
    setActiveNoteText(contactNotes[faculty.id] || '');
    setActivePaper(paperNotes[faculty.id] || { title: '', url: '', note: '' });
  };

  const handleSaveDrawerNotes = () => {
    if (!activeFaculty) return;
    saveContactNote(activeFaculty.id, activeNoteText);
    setContactNotes({ ...contactNotes, [activeFaculty.id]: activeNoteText });

    savePaperNote(activeFaculty.id, activePaper);
    setPaperNotes({ ...paperNotes, [activeFaculty.id]: activePaper });

    setNotification('Research notes and paper details saved locally.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuickAddToTracker = (faculty: FacultyMember, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onAddToTracker({
      name: faculty.name,
      institution: faculty.institution,
      researchArea: faculty.researchInterests.slice(0, 100),
      contactEmail: faculty.email,
      sourceLink: faculty.facultyPageUrl,
      applicationRoute: 'direct_email',
      status: 'Shortlisted',
      appliedDate: '',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextAction: 'Read their papers & prepare draft in Email Studio',
      nextActionDate: '',
      followUpCount: 0,
      deadline: '',
      notes: contactNotes[faculty.id] || '',
    });
    setNotification(`Added ${faculty.name} to My Applications as Shortlisted.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
              IIT Faculty Directory
            </h2>
            <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
              {facultyList.length.toLocaleString()} Indexed
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
            Compiled from public institutional directories. Contacts are provided for academic identification. Always verify current vacancy and active lab status on the official university portal before reaching out.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-xs font-medium text-ink-secondary shadow-subtle cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-ink-muted" />
            <span>Import CSV / JSON</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="text-xs py-2 px-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg flex items-center justify-between shadow-subtle animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="font-bold text-teal-700 ml-2">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-line p-4 shadow-subtle space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by professor name, research keyword (e.g. 'Robotics', 'Quantum', 'Catalysis'), or location..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white focus:border-teal-600 outline-none text-xs text-ink-primary transition-all"
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

          {/* Toggle Saved Only */}
          <button
            onClick={() => {
              setOnlySaved(!onlySaved);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              onlySaved
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-[#FAF8F5] border-stone-line text-ink-secondary hover:bg-stone-hover'
            }`}
          >
            {onlySaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5 text-ink-muted" />}
            <span>Saved Only ({savedIds.length})</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-stone-line/60 text-xs">
          {/* Institution Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">
              Filter by IIT Campus
            </label>
            <select
              value={selectedInstitution}
              onChange={(e) => {
                setSelectedInstitution(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary outline-none"
            >
              <option value="all">All Institutions ({facultyList.length})</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">
              Filter by Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs text-ink-primary outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Results Summary */}
          <div className="flex items-end justify-between sm:justify-end gap-2 pb-0.5">
            <span className="text-xs text-ink-muted">
              Showing <strong className="text-ink-primary font-mono">{filteredList.length}</strong> matching researchers
            </span>
            {(selectedInstitution !== 'all' || selectedDepartment !== 'all' || searchQuery || onlySaved) && (
              <button
                onClick={() => {
                  setSelectedInstitution('all');
                  setSelectedDepartment('all');
                  setSearchQuery('');
                  setOnlySaved(false);
                  setCurrentPage(1);
                }}
                className="text-[11px] text-teal-700 hover:text-teal-900 underline font-medium cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {paginatedList.length === 0 ? (
        <div className="rounded-xl border border-stone-line bg-white p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-ink-faint mx-auto stroke-1" />
          <h3 className="text-base font-serif-title font-semibold text-ink-primary">
            No faculty match your criteria
          </h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Try broadening your search term or clearing the department filter. You can also import custom faculty spreadsheets via the Import button.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedInstitution('all');
              setSelectedDepartment('all');
              setOnlySaved(false);
            }}
            className="px-4 py-2 bg-stone-hover hover:bg-stone-line/70 text-xs font-medium rounded-lg text-ink-primary cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedList.map((faculty) => {
            const isSaved = savedIds.includes(faculty.id);
            const matchReasons = searchQuery ? explainFacultyMatch(faculty, searchQuery) : [];
            const hasPaperNote = Boolean(paperNotes[faculty.id]?.title);

            return (
              <div
                key={faculty.id}
                onClick={() => handleOpenDrawer(faculty)}
                className="wispr-card p-5 flex flex-col justify-between cursor-pointer hover:border-stone-border group relative"
              >
                <div>
                  {/* Top Bar with Institution & Save Button */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {faculty.institution}
                    </span>
                    <button
                      onClick={(e) => handleToggleSave(faculty.id, e)}
                      className="p-1 text-ink-muted hover:text-amber-600 transition-colors"
                      title={isSaved ? 'Remove from saved' : 'Save contact'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-100" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Name and Department */}
                  <h3 className="text-sm font-semibold text-ink-primary font-serif-title group-hover:text-teal-800 transition-colors leading-snug">
                    {faculty.name}
                  </h3>
                  <p className="text-[11px] text-ink-secondary mt-0.5">
                    {faculty.department}
                  </p>
                  <p className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-ink-faint" />
                    {faculty.location}
                  </p>

                  {/* Research Area Snippet */}
                  <div className="mt-3 bg-[#FAF8F5] p-2.5 rounded-lg border border-stone-line/70">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-ink-muted font-semibold mb-1">
                      Research Interests
                    </span>
                    <p className="text-xs text-ink-secondary line-clamp-3 leading-relaxed">
                      {faculty.researchInterests || 'Domain not specified in original compilation.'}
                    </p>
                  </div>

                  {/* Transparent Relevance Explanation */}
                  {matchReasons.length > 0 && (
                    <div className="mt-2 text-[10px] text-teal-800 bg-teal-50/70 p-1.5 rounded border border-teal-100 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>
                        Matches {matchReasons.map(r => `"${r.matchedTerm}" in ${r.field}`).join(', ')}
                      </span>
                    </div>
                  )}

                  {hasPaperNote && (
                    <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-amber-600" />
                      <span className="truncate">Paper: {paperNotes[faculty.id]?.title}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-4 pt-3 border-t border-stone-line/70 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => handleCopyEmail(faculty.email, faculty.id, e)}
                    className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink-primary font-mono"
                    title="Click to copy email address"
                  >
                    {copiedId === faculty.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-teal-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="truncate max-w-[130px]">{faculty.email}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrepareEmail(faculty, paperNotes[faculty.id]);
                      }}
                      className="px-2 py-1 bg-white hover:bg-stone-hover border border-stone-line text-ink-primary text-[11px] font-medium rounded shadow-subtle transition-all cursor-pointer"
                      title="Compose targeted email in Email Studio"
                    >
                      Draft Email
                    </button>
                    <button
                      onClick={(e) => handleQuickAddToTracker(faculty, e)}
                      className="p-1 text-ink-muted hover:text-teal-700 rounded"
                      title="Add to My Applications tracker"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-line text-xs">
          <span className="text-ink-muted">
            Page <strong className="text-ink-primary">{currentPage}</strong> of{' '}
            <strong className="text-ink-primary">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded border border-stone-line bg-white hover:bg-stone-hover disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-ink-muted font-mono">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded border border-stone-line bg-white hover:bg-stone-hover disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer (Slide-over panel) */}
      {activeFaculty && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-ink-primary/30 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveFaculty(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-float border-l border-stone-line flex flex-col z-10 animate-slide-left overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-line bg-[#FAF8F5] flex items-start justify-between">
              <div>
                <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] mb-2">
                  {activeFaculty.institution}
                </span>
                <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
                  {activeFaculty.name}
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {activeFaculty.department}
                </p>
                <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-ink-faint" />
                  {activeFaculty.location}
                </p>
              </div>

              <button
                onClick={() => setActiveFaculty(null)}
                className="p-1.5 text-ink-muted hover:text-ink-primary rounded-lg text-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Verification & Source Disclaimer Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Provenance & Verification Notice</span>
                </div>
                <p className="leading-relaxed">
                  {activeFaculty.verificationNotice}
                </p>
                <span className="text-[10px] text-amber-800/80 block">
                  Source: {activeFaculty.source} (Checked {activeFaculty.lastCheckedDate})
                </span>
              </div>

              {/* Contact and Links */}
              <div className="space-y-2">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Official Communication
                </span>
                <div className="flex items-center justify-between p-3 rounded-lg border border-stone-line bg-[#FAF8F5]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-700" />
                    <span className="font-mono text-xs text-ink-primary">{activeFaculty.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopyEmail(activeFaculty.email, 'drawer')}
                    className="wispr-pill bg-white hover:bg-stone-hover border-stone-line text-ink-secondary text-[11px] cursor-pointer"
                  >
                    {copiedId === 'drawer' ? 'Copied!' : 'Copy Email'}
                  </button>
                </div>

                <div className="pt-1 flex gap-2">
                  <a
                    href={activeFaculty.facultyPageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-primary font-medium shadow-subtle"
                  >
                    <span>Search Official Faculty Page</span>
                    <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                  </a>
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(activeFaculty.name + ' ' + activeFaculty.institution)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 py-2 px-3 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary"
                    title="Search Google Scholar"
                  >
                    <span>Scholar</span>
                    <ExternalLink className="w-3 h-3 text-ink-muted" />
                  </a>
                </div>
              </div>

              {/* Research Interests Detail */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Listed Research Focus
                </span>
                <div className="p-3.5 rounded-lg border border-stone-line bg-[#FAF8F5] leading-relaxed text-ink-primary">
                  {activeFaculty.researchInterests}
                </div>
              </div>

              {/* Record One Relevant Paper (Prompt requirement) */}
              <div className="space-y-2 pt-2 border-t border-stone-line">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-primary flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    Record One Relevant Paper (for Email Studio)
                  </span>
                  <span className="text-[10px] text-ink-muted">Saved locally</span>
                </div>
                <input
                  type="text"
                  value={activePaper.title}
                  onChange={(e) => setActivePaper({ ...activePaper, title: e.target.value })}
                  placeholder="Paper Title (e.g. Learning on Graphs via Adaptive Diffusion)"
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
                <input
                  type="text"
                  value={activePaper.url || ''}
                  onChange={(e) => setActivePaper({ ...activePaper, url: e.target.value })}
                  placeholder="Paper DOI / arXiv Link (optional)"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
                <textarea
                  rows={2}
                  value={activePaper.note || ''}
                  onChange={(e) => setActivePaper({ ...activePaper, note: e.target.value })}
                  placeholder="One observation, question, or limitation noticed while reading..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>

              {/* Personal Research-Fit Note */}
              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
                  Personal Research-Fit Note
                </span>
                <textarea
                  rows={3}
                  value={activeNoteText}
                  onChange={(e) => setActiveNoteText(e.target.value)}
                  placeholder="Why does this lab fit your goals? Note relevant prerequisites, tools, or ideas..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
                <button
                  onClick={handleSaveDrawerNotes}
                  className="px-3 py-1.5 rounded bg-stone-hover hover:bg-stone-line/70 text-ink-primary text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Save Notes & Paper Info
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-stone-line bg-[#FAF8F5] flex items-center gap-2">
              <button
                onClick={() => {
                  handleToggleSave(activeFaculty.id);
                }}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  savedIds.includes(activeFaculty.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-line text-ink-secondary hover:bg-stone-hover'
                }`}
              >
                {savedIds.includes(activeFaculty.id) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Contact</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onPrepareEmail(activeFaculty, activePaper);
                  setActiveFaculty(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-sm transition-all text-center cursor-pointer"
              >
                Prepare Email in Studio
              </button>

              <button
                onClick={() => {
                  handleQuickAddToTracker(activeFaculty);
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

      {/* CSV / JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-line max-w-xl w-full p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-line">
              <h3 className="text-base font-serif-title font-semibold text-ink-primary">
                Import Faculty Directory (CSV / JSON)
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportStatus(null);
                }}
                className="text-ink-muted hover:text-ink-primary font-bold text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Paste JSON array of faculty records or select a CSV file. Expected columns/keys: <code className="text-ink-primary">Name</code>, <code className="text-ink-primary">College Name</code>, <code className="text-ink-primary">Department</code>, <code className="text-ink-primary">Area of interest</code>, <code className="text-ink-primary">Mail Id</code>.
            </p>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='[{"Name": "Dr. Example", "College Name": "IIT Delhi", "Department": "CSE", "Area of interest": "AI, ML", "Mail Id": "example@iitd.ac.in"}]'
              className="w-full p-3 font-mono text-[11px] rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-ink-primary outline-none"
            />

            {importStatus && (
              <div className="text-xs p-2.5 rounded bg-teal-50 border border-teal-200 text-teal-900">
                {importStatus}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-ink-muted">
                Deduplication enabled by email.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 text-xs text-ink-secondary hover:bg-stone-hover rounded border border-stone-line"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(importJsonText);
                      if (Array.isArray(parsed)) {
                        setImportStatus(`Successfully validated ${parsed.length} custom records. Ready for workspace.`);
                      } else {
                        setImportStatus('Expected a JSON array.');
                      }
                    } catch {
                      setImportStatus('Invalid JSON format. Check syntax.');
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-medium bg-teal-700 hover:bg-teal-800 text-white rounded cursor-pointer"
                >
                  Validate & Load
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
