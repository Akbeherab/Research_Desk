import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Check,
  Plus
} from 'lucide-react';
import { ROADMAP_WEEKS } from '../data/roadmapData';
import { getRoadmapProgress, toggleRoadmapTask } from '../utils/storage';

export const ResearchRoadmap: React.FC = () => {
  const [progress, setProgress] = useState<Record<string, boolean>>(() => getRoadmapProgress());
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState(0);
  const [activeWeekAccordion, setActiveWeekAccordion] = useState<number>(1);

  // Interactive Paper Notes Scratchpad for Week 3
  const [paperNotesForm, setPaperNotesForm] = useState({
    citation: '',
    question: '',
    method: '',
    dataSetup: '',
    mainResult: '',
    limitation: '',
    unresolvedQuestion: '',
    connection: '',
  });
  const [savedNotesList, setSavedNotesList] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wrd_custom_paper_notes') || '[]');
    } catch {
      return [];
    }
  });
  const [savedNoteNotification, setSavedNoteNotification] = useState(false);

  const totalTasks = ROADMAP_WEEKS.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  const handleToggle = (taskId: string) => {
    const updated = toggleRoadmapTask(taskId);
    setProgress(updated);
  };

  const handleSavePaperNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperNotesForm.citation.trim()) {
      alert('Please enter a paper title or citation.');
      return;
    }
    const updated = [paperNotesForm, ...savedNotesList];
    setSavedNotesList(updated);
    localStorage.setItem('wrd_custom_paper_notes', JSON.stringify(updated));
    setPaperNotesForm({
      citation: '',
      question: '',
      method: '',
      dataSetup: '',
      mainResult: '',
      limitation: '',
      unresolvedQuestion: '',
      connection: '',
    });
    setSavedNoteNotification(true);
    setTimeout(() => setSavedNoteNotification(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
              6-Week Research Preparation Roadmap
            </h2>
            <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
              Self-Paced
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
            A concrete, structured roadmap from zero to ready-to-apply. You can compress or extend this timeline based on your university winter break schedule. Check official fellowship deadlines from Day 1.
          </p>
        </div>

        {/* Overall Completion Metric */}
        <div className="flex items-center gap-3 bg-white border border-stone-line rounded-xl p-3 shadow-subtle self-start sm:self-auto">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-mono font-bold text-teal-800 text-xs">
            {progressPercentage}%
          </div>
          <div>
            <span className="block text-xs font-semibold text-ink-primary">
              {completedCount} of {totalTasks} Tasks Done
            </span>
            <span className="text-[10px] text-ink-muted">
              Auto-saved to local browser
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-line/70 h-2 rounded-full overflow-hidden">
        <div
          className="bg-teal-700 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Weeks Accordion / List */}
      <div className="space-y-4">
        {ROADMAP_WEEKS.map((week) => {
          const isOpen = activeWeekAccordion === week.weekNumber;
          const weekTasksDone = week.tasks.filter((t) => progress[t.id]).length;
          const isWeekComplete = weekTasksDone === week.tasks.length;

          return (
            <div
              key={week.weekNumber}
              className="bg-white rounded-xl border border-stone-line shadow-subtle overflow-hidden transition-all"
            >
              {/* Accordion Header */}
              <div
                onClick={() => setActiveWeekAccordion(isOpen ? 0 : week.weekNumber)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-hover/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${
                      isWeekComplete
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-[#FAF8F5] text-ink-primary border-stone-line'
                    }`}
                  >
                    {isWeekComplete ? <Check className="w-4 h-4" /> : week.weekNumber}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-serif-title font-semibold text-ink-primary">
                        Week {week.weekNumber}: {week.title}
                      </h3>
                      {isWeekComplete && (
                        <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {week.subtitle} • Est: {week.estimatedHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted font-mono hidden sm:inline">
                    {weekTasksDone}/{week.tasks.length} done
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-ink-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-muted" />
                  )}
                </div>
              </div>

              {/* Accordion Content */}
              {isOpen && (
                <div className="p-6 pt-0 border-t border-stone-line/60 space-y-6 text-xs animate-fade-in">
                  {/* Tangible Deliverable Banner */}
                  <div className="mt-4 p-3 bg-teal-50/60 border border-teal-200 rounded-lg flex items-start gap-2.5 text-teal-950">
                    <Award className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-[11px] uppercase tracking-wider text-teal-900 font-mono">
                        Tangible Week Output
                      </span>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {week.deliverable}
                      </p>
                    </div>
                  </div>

                  {/* Discipline Guidance Tabs for Week 2 */}
                  {week.disciplineGuidance && (
                    <div className="space-y-3 pt-2">
                      <span className="block font-semibold text-ink-primary font-mono text-[11px] uppercase">
                        Discipline-Specific Tooling Tracks
                      </span>

                      <div className="flex flex-wrap gap-1.5">
                        {week.disciplineGuidance.map((track, idx) => (
                          <button
                            key={track.discipline}
                            onClick={() => setSelectedDisciplineTab(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              selectedDisciplineTab === idx
                                ? 'bg-teal-700 text-white shadow-subtle'
                                : 'bg-[#FAF8F5] text-ink-secondary hover:bg-stone-hover border border-stone-line'
                            }`}
                          >
                            {track.discipline}
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-lg border border-stone-line bg-[#FAF8F5] space-y-2">
                        <p className="text-ink-secondary leading-relaxed">
                          <strong>Focus:</strong> {week.disciplineGuidance[selectedDisciplineTab].focus}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-ink-muted uppercase font-mono font-semibold">Recommended Stack:</span>
                          <div className="flex flex-wrap gap-1">
                            {week.disciplineGuidance[selectedDisciplineTab].recommendedTools.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white text-ink-primary border border-stone-line text-[11px] font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tasks Checkbox List */}
                  <div className="space-y-3 pt-2">
                    <span className="block font-semibold text-ink-primary font-mono text-[11px] uppercase">
                      Action Checklist
                    </span>

                    <div className="space-y-2.5">
                      {week.tasks.map((task) => {
                        const isDone = Boolean(progress[task.id]);
                        return (
                          <div
                            key={task.id}
                            onClick={() => handleToggle(task.id)}
                            className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                              isDone
                                ? 'bg-teal-50/40 border-teal-200'
                                : 'bg-white hover:bg-stone-hover/50 border-stone-line'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 text-teal-700 hover:text-teal-800"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-teal-700 fill-teal-100" />
                              ) : (
                                <Circle className="w-4 h-4 text-ink-muted" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-xs font-semibold ${
                                    isDone ? 'line-through text-ink-muted' : 'text-ink-primary'
                                  }`}
                                >
                                  {task.title}
                                </h4>
                                <span className="text-[10px] text-ink-muted font-mono shrink-0">
                                  {task.estimatedEffort}
                                </span>
                              </div>
                              <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                                {task.description}
                              </p>
                              {task.tip && (
                                <p className="text-[10px] text-amber-800 bg-amber-50/70 p-1.5 rounded mt-2 border border-amber-200/70">
                                  💡 <strong>Tip:</strong> {task.tip}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Embedded Paper Notes Tool in Week 3 */}
                  {week.weekNumber === 3 && (
                    <div className="mt-6 pt-5 border-t border-stone-line space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-700" />
                          <h4 className="font-semibold text-xs text-ink-primary font-serif-title text-sm">
                            Structured Paper-Notes Template (Interactive)
                          </h4>
                        </div>
                        <span className="text-[10px] text-ink-muted font-mono">
                          Saved in browser
                        </span>
                      </div>

                      {savedNoteNotification && (
                        <div className="text-xs p-2 rounded bg-teal-50 text-teal-900 border border-teal-200">
                          Paper notes saved locally!
                        </div>
                      )}

                      <form onSubmit={handleSavePaperNote} className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-stone-line">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Citation & Link *</label>
                            <input
                              type="text"
                              required
                              value={paperNotesForm.citation}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, citation: e.target.value })}
                              placeholder="e.g. Kipf & Welling, Semi-Supervised Classification (ICLR 2017)"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Core Research Question</label>
                            <input
                              type="text"
                              value={paperNotesForm.question}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, question: e.target.value })}
                              placeholder="How to scale convolutional representations to graph-structured data?"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Methodology & Architecture</label>
                            <input
                              type="text"
                              value={paperNotesForm.method}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, method: e.target.value })}
                              placeholder="First-order Chebyshev polynomial spectral approximation"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Data / Experimental Setup</label>
                            <input
                              type="text"
                              value={paperNotesForm.dataSetup}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, dataSetup: e.target.value })}
                              placeholder="Cora, Citeseer, Pubmed citation networks"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Main Quantitative Result</label>
                            <input
                              type="text"
                              value={paperNotesForm.mainResult}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, mainResult: e.target.value })}
                              placeholder="81.5% accuracy on Cora with 2-layer GCN"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-ink-muted mb-0.5">Noted Limitation</label>
                            <input
                              type="text"
                              value={paperNotesForm.limitation}
                              onChange={(e) => setPaperNotesForm({ ...paperNotesForm, limitation: e.target.value })}
                              placeholder="Memory scales with full adjacency matrix; over-smoothing at >3 layers"
                              className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-ink-muted mb-0.5">Question I still have (Use this in Email Studio!)</label>
                          <input
                            type="text"
                            value={paperNotesForm.unresolvedQuestion}
                            onChange={(e) => setPaperNotesForm({ ...paperNotesForm, unresolvedQuestion: e.target.value })}
                            placeholder="Can neighborhood sampling preserve performance on highly heterophilic graphs?"
                            className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-sm cursor-pointer"
                          >
                            Save Paper Note
                          </button>
                        </div>
                      </form>

                      {/* List of Saved Paper Notes */}
                      {savedNotesList.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-semibold text-ink-secondary">
                            Your Saved Paper Notes ({savedNotesList.length})
                          </span>
                          <div className="space-y-2">
                            {savedNotesList.map((item, idx) => (
                              <div key={idx} className="p-3 bg-white rounded-lg border border-stone-line text-[11px] space-y-1">
                                <span className="font-semibold text-ink-primary block">{item.citation}</span>
                                <p className="text-ink-secondary">
                                  <strong>Question:</strong> {item.question || '—'}
                                </p>
                                <p className="text-amber-800">
                                  <strong>My Question:</strong> {item.unresolvedQuestion || '—'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
