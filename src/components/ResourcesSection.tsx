import React, { useState } from 'react';
import {
  BookOpen,
  CheckSquare,
  Square,
  BookmarkCheck,
  Plus,
  ExternalLink,
  Trash2,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { PRACTICAL_GUIDES, ACCEPTANCE_CHECKLIST_ITEMS, GuideArticle } from '../data/resourcesData';
import {
  getSavedOpportunities,
  addOpportunity,
  deleteOpportunity
} from '../utils/storage';
import { OpportunityNotice } from '../types';

export const ResourcesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'checklist' | 'board'>('guides');
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(PRACTICAL_GUIDES[0]);

  // Acceptance Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('wrd_acceptance_checklist') || '{}');
    } catch {
      return {};
    }
  });

  // Opportunity Board State
  const [opportunities, setOpportunities] = useState<OpportunityNotice[]>(() => getSavedOpportunities());
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [oppFormData, setOppFormData] = useState({
    title: '',
    organization: '',
    officialLink: '',
    deadline: '',
    eligibility: '',
    stipend: '',
    dates: '',
    documents: '',
    notes: '',
  });

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('wrd_acceptance_checklist', JSON.stringify(updated));
  };

  const handleAddOppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppFormData.title.trim() || !oppFormData.organization.trim()) {
      alert('Please fill out the title and organization.');
      return;
    }
    const updated = addOpportunity(oppFormData);
    setOpportunities(updated);
    setShowAddOppModal(false);
    setOppFormData({
      title: '',
      organization: '',
      officialLink: '',
      deadline: '',
      eligibility: '',
      stipend: '',
      dates: '',
      documents: '',
      notes: '',
    });
  };

  const handleDeleteOpp = (id: string) => {
    if (window.confirm('Delete this opportunity notice?')) {
      const updated = deleteOpportunity(id);
      setOpportunities(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
              Resources & Decision Tools
            </h2>
            <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
              Academic Best Practices
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
            Practical guides for scientific literature, 1-page CVs, repository standards, and an interactive opportunity board to track official fellowship circulars.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-white border border-stone-line rounded-lg p-1 shadow-subtle self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-all ${
              activeTab === 'guides' ? 'bg-teal-700 text-white shadow-xs' : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Practical Guides
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-all ${
              activeTab === 'checklist' ? 'bg-teal-700 text-white shadow-xs' : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Before You Accept Checklist
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded font-medium cursor-pointer transition-all ${
              activeTab === 'board' ? 'bg-teal-700 text-white shadow-xs' : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Opportunity Board ({opportunities.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Practical Guides Reader */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Guide Selector List (4 Cols) */}
          <div className="md:col-span-4 bg-white rounded-xl border border-stone-line p-3 shadow-subtle space-y-1.5">
            <span className="block px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
              Guide Library ({PRACTICAL_GUIDES.length})
            </span>
            {PRACTICAL_GUIDES.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer block border ${
                  selectedGuide?.id === guide.id
                    ? 'bg-teal-50/60 border-teal-200 text-ink-primary'
                    : 'bg-white hover:bg-stone-hover border-transparent text-ink-secondary'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-ink-muted mb-1 font-mono">
                  <span>{guide.category}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h4 className="text-xs font-semibold leading-snug font-serif-title text-ink-primary">
                  {guide.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Guide Reader Content (8 Cols) */}
          <div className="md:col-span-8 bg-white rounded-xl border border-stone-line p-6 sm:p-8 shadow-subtle text-xs space-y-6">
            {selectedGuide ? (
              <>
                <div className="border-b border-stone-line pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {selectedGuide.category}
                    </span>
                    <span className="text-ink-muted text-[11px]">
                      • {selectedGuide.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif-title font-semibold text-ink-primary">
                    {selectedGuide.title}
                  </h3>
                  <p className="text-ink-secondary leading-relaxed text-sm">
                    {selectedGuide.summary}
                  </p>
                </div>

                <div className="space-y-6 leading-relaxed">
                  {selectedGuide.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="text-sm font-semibold text-ink-primary font-serif-title">
                        {section.heading}
                      </h4>
                      <p className="text-ink-secondary leading-relaxed">
                        {section.content}
                      </p>
                      {section.bulletPoints && (
                        <ul className="list-disc list-inside space-y-1.5 text-ink-secondary pl-1">
                          {section.bulletPoints.map((pt, i) => (
                            <li key={i} className="leading-relaxed">
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-ink-muted">Select a guide from the sidebar.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: "Before You Accept" Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-xl border border-stone-line p-6 sm:p-8 shadow-subtle space-y-6 text-xs max-w-3xl mx-auto">
          <div className="border-b border-stone-line pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <h3 className="text-xl font-serif-title font-semibold text-ink-primary">
                The "Before You Accept" Checklist
              </h3>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              Do not confirm an offer or buy non-refundable train tickets until you have clarified these essential points in writing.
            </p>
          </div>

          <div className="space-y-3">
            {ACCEPTANCE_CHECKLIST_ITEMS.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-teal-50/50 border-teal-200'
                      : 'bg-[#FAF8F5] hover:bg-stone-hover border-stone-line'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-teal-700">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-muted" />
                    )}
                  </button>

                  <div className="flex-1">
                    <span
                      className={`text-xs font-semibold ${
                        isChecked ? 'line-through text-ink-muted' : 'text-ink-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                    <p className="text-[11px] text-ink-secondary mt-0.5">
                      {item.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>College Administration Notice:</strong> Most Indian universities require a formal No Objection Certificate (NOC) from your Head of Department (HOD) or Dean of Academic Affairs before you are permitted to miss end-semester or early-semester classes for an external internship.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Opportunity Board */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-ink-secondary">
              Save and monitor verified official fellowship circulars and laboratory project-training notices.
            </p>
            <button
              onClick={() => setShowAddOppModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Opportunity Notice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="wispr-card p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {opp.organization}
                    </span>
                    <button
                      onClick={() => handleDeleteOpp(opp.id)}
                      className="text-ink-muted hover:text-red-700 p-1"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-ink-primary font-serif-title mt-2">
                    {opp.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-ink-secondary text-[11px]">
                    <p>
                      <strong>Dates:</strong> {opp.dates || 'Winter window'}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{' '}
                      <span className="text-amber-800 font-semibold">{opp.deadline || 'Rolling'}</span>
                    </p>
                    <p>
                      <strong>Eligibility:</strong> {opp.eligibility || 'Check official circular'}
                    </p>
                    <p>
                      <strong>Stipend / Accommodation:</strong> {opp.stipend || 'Unspecified'}
                    </p>
                    {opp.notes && (
                      <p className="p-2 bg-[#FAF8F5] rounded border border-stone-line/70 mt-2 text-ink-muted">
                        {opp.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-line/70 flex items-center justify-between">
                  <span className="text-[10px] text-ink-muted font-mono">
                    Recorded {opp.savedAt}
                  </span>
                  {opp.officialLink && (
                    <a
                      href={opp.officialLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium"
                    >
                      <span>Official Notice Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Opportunity Notice Modal */}
      {showAddOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-line max-w-xl w-full p-6 shadow-float space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-line">
              <h3 className="text-base font-serif-title font-semibold text-ink-primary">
                Add Official Research Opportunity Notice
              </h3>
              <button
                onClick={() => setShowAddOppModal(false)}
                className="text-ink-muted hover:text-ink-primary text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddOppSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={oppFormData.title}
                    onChange={(e) => setOppFormData({ ...oppFormData, title: e.target.value })}
                    placeholder="e.g. IIT Madras Winter Research Fellowship"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Organization / Lab *</label>
                  <input
                    type="text"
                    required
                    value={oppFormData.organization}
                    onChange={(e) => setOppFormData({ ...oppFormData, organization: e.target.value })}
                    placeholder="e.g. IIT Madras"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Official Circular URL</label>
                  <input
                    type="url"
                    value={oppFormData.officialLink}
                    onChange={(e) => setOppFormData({ ...oppFormData, officialLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Application Deadline</label>
                  <input
                    type="text"
                    value={oppFormData.deadline}
                    onChange={(e) => setOppFormData({ ...oppFormData, deadline: e.target.value })}
                    placeholder="e.g. Oct 31, 2026 or Rolling"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={oppFormData.eligibility}
                  onChange={(e) => setOppFormData({ ...oppFormData, eligibility: e.target.value })}
                  placeholder="e.g. 2nd or 3rd year B.Tech, CGPA > 8.0"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Stipend / Accommodation</label>
                  <input
                    type="text"
                    value={oppFormData.stipend}
                    onChange={(e) => setOppFormData({ ...oppFormData, stipend: e.target.value })}
                    placeholder="e.g. ₹6,000/mo + hostel"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Tentative Dates</label>
                  <input
                    type="text"
                    value={oppFormData.dates}
                    onChange={(e) => setOppFormData({ ...oppFormData, dates: e.target.value })}
                    placeholder="Dec 1, 2026 – Jan 10, 2027"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">Notes / Required Docs</label>
                <textarea
                  rows={2}
                  value={oppFormData.notes}
                  onChange={(e) => setOppFormData({ ...oppFormData, notes: e.target.value })}
                  placeholder="e.g. Requires college bonafide letter and NOC from HOD..."
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOppModal(false)}
                  className="px-3 py-1.5 rounded border border-stone-line text-ink-secondary hover:bg-stone-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
