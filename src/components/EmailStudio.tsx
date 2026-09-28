import React, { useState, useMemo } from 'react';
import {
  Mail,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText,
  Send,
  HelpCircle,
  CheckSquare,
  Square,
  Paperclip,
  Clock,
  Wand2,
  Key,
  Info
} from 'lucide-react';
import { EmailFormData, renderEmail, INITIAL_EMAIL_FORM } from '../data/emailTemplates';
import { OnboardingProfile } from '../types';
import { isGroqAvailable, getGroqApiKey, setGroqApiKey, reviewEmailDraft, suggestResearchConnection } from '../utils/groq';

interface EmailStudioProps {
  profile: OnboardingProfile;
  prefillData?: Partial<EmailFormData>;
  onClearPrefill?: () => void;
}

export const EmailStudio: React.FC<EmailStudioProps> = ({
  profile,
  prefillData,
  onClearPrefill,
}) => {
  // Initialize form with profile defaults or prefillData
  const [formData, setFormData] = useState<EmailFormData>(() => {
    return {
      ...INITIAL_EMAIL_FORM,
      studentName: profile.name || INITIAL_EMAIL_FORM.studentName,
      studentDegree: profile.degree || INITIAL_EMAIL_FORM.studentDegree,
      studentYear: profile.year || INITIAL_EMAIL_FORM.studentYear,
      studentDiscipline: profile.discipline || INITIAL_EMAIL_FORM.studentDiscipline,
      studentInstitution: profile.institution || INITIAL_EMAIL_FORM.studentInstitution,
      studentEmail: '',
      relevantProject: profile.project || INITIAL_EMAIL_FORM.relevantProject,
      relevantTools: profile.skills || INITIAL_EMAIL_FORM.relevantTools,
      startDate: profile.startDate || INITIAL_EMAIL_FORM.startDate,
      endDate: profile.endDate || INITIAL_EMAIL_FORM.endDate,
      ...prefillData,
    };
  });

  // Track editable preview text
  const [customBodyOverride, setCustomBodyOverride] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<'subject' | 'body' | 'full' | null>(null);
  const [placeholderWarning, setPlaceholderWarning] = useState<string | null>(null);

  // Groq AI State
  const [groqLoading, setGroqLoading] = useState(false);
  const [groqFeedback, setGroqFeedback] = useState<{
    critique: string[];
    suggestions: string[];
    polishedText?: string;
  } | null>(null);
  const [groqError, setGroqError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGroqApiKey());
  const [hasKey, setHasKey] = useState(isGroqAvailable());

  const handleSaveApiKey = () => {
    setGroqApiKey(apiKeyInput);
    setHasKey(isGroqAvailable());
    setShowApiKeyModal(false);
  };

  // Personalization checklist items state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    recipient: true,
    connection: false,
    example: false,
    availability: false,
    reasonable: false,
    links: false,
    noClaims: true,
    cv: false,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate rendered email
  const rendered = useMemo(() => {
    const base = renderEmail(formData);
    if (customBodyOverride !== null) {
      const words = customBodyOverride.trim().split(/\s+/).filter(Boolean).length;
      return {
        ...base,
        body: customBodyOverride,
        fullEmail: `To: ${formData.recipientEmail || '[Recipient Email]'}\nSubject: ${base.subject}\n\n${customBodyOverride}`,
        wordCount: words,
      };
    }
    return base;
  }, [formData, customBodyOverride]);

  const handleInputChange = (field: keyof EmailFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCustomBodyOverride(null); // reset custom override when structured inputs change
  };

  const handleTemplateChange = (type: EmailFormData['templateType']) => {
    setFormData((prev) => ({ ...prev, templateType: type }));
    setCustomBodyOverride(null);
  };

  const handleReset = () => {
    setFormData({
      ...INITIAL_EMAIL_FORM,
      studentName: profile.name || '',
      studentDegree: profile.degree || 'B.Tech',
      studentYear: profile.year || '3rd Year',
      studentDiscipline: profile.discipline || 'Computer Science and Engineering',
      studentInstitution: profile.institution || '',
      startDate: profile.startDate || 'Dec 1, 2026',
      endDate: profile.endDate || 'Jan 15, 2027',
    });
    setCustomBodyOverride(null);
    setGroqFeedback(null);
    setPlaceholderWarning(null);
    if (onClearPrefill) onClearPrefill();
  };

  // Copy actions with placeholder checking
  const checkPlaceholdersBeforeCopy = (): boolean => {
    if (rendered.unresolvedPlaceholders.length > 0) {
      setPlaceholderWarning(
        `Please resolve the following placeholders before sending: ${rendered.unresolvedPlaceholders.join(', ')}`
      );
      return false;
    }
    setPlaceholderWarning(null);
    return true;
  };

  const copySubject = () => {
    navigator.clipboard.writeText(rendered.subject);
    setCopySuccess('subject');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const copyBody = () => {
    if (!checkPlaceholdersBeforeCopy()) return;
    navigator.clipboard.writeText(rendered.body);
    setCopySuccess('body');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const copyFullEmail = () => {
    if (!checkPlaceholdersBeforeCopy()) return;
    navigator.clipboard.writeText(rendered.fullEmail);
    setCopySuccess('full');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Launch email app via mailto:
  const launchEmailClient = () => {
    const to = encodeURIComponent(formData.recipientEmail || '');
    const sub = encodeURIComponent(rendered.subject);
    const bod = encodeURIComponent(rendered.body);
    window.location.href = `mailto:${to}?subject=${sub}&body=${bod}`;
  };

  // Groq AI polish handler
  const handleGroqReview = async () => {
    setGroqLoading(true);
    setGroqError(null);
    try {
      const result = await reviewEmailDraft(rendered.subject, rendered.body, {
        recipient: formData.recipientName,
        studentDegree: formData.studentDegree,
        project: formData.relevantProject,
      });
      setGroqFeedback(result);
    } catch (err: any) {
      setGroqError(err.message || 'Groq AI request failed.');
    } finally {
      setGroqLoading(false);
    }
  };

  const applyGroqPolish = () => {
    if (groqFeedback?.polishedText) {
      setCustomBodyOverride(groqFeedback.polishedText);
      setGroqFeedback(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
              Email Studio
            </h2>
            <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
              Working Template Engine
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1 max-w-2xl">
            Generates concise, respectful, academic outreach drafts. Zero exaggerated flattery or buzzwords. Verified links and exact availability dates only.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-xs font-medium text-ink-secondary shadow-subtle transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Template Selector Tabs (Wispr Flow style) */}
      <div className="flex flex-wrap gap-2">
        {[
          { type: 'A', label: 'Template A: Specific Professor Outreach' },
          { type: 'B', label: 'Template B: Limited Research Experience' },
          { type: 'C', label: 'Template C: DRDO / ISRO Lab Inquiry' },
          { type: 'D', label: 'Template D: First Follow-Up (7–10 Days)' },
          { type: 'E', label: 'Template E: Final Follow-Up' },
        ].map((t) => (
          <button
            key={t.type}
            onClick={() => handleTemplateChange(t.type as EmailFormData['templateType'])}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              formData.templateType === t.type
                ? 'bg-teal-700 text-white shadow-sm font-semibold'
                : 'bg-white hover:bg-stone-hover text-ink-secondary border border-stone-line'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Split-Screen Workspace: Inputs on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Structured Input Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-line p-5 shadow-subtle space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-line">
            <span className="font-semibold text-ink-primary uppercase tracking-wider font-mono text-[11px]">
              Outreach Parameters
            </span>
            <span className="text-[10px] text-ink-muted">
              Auto-fills templates
            </span>
          </div>

          {/* Recipient Details */}
          <div className="space-y-2.5">
            <span className="block text-[11px] font-semibold text-teal-800">
              Recipient & Institution
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Professor / Office Name</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Prof. Narendra S. Chaudhari"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Surname (Salutation)</label>
                <input
                  type="text"
                  value={formData.recipientSurname}
                  onChange={(e) => handleInputChange('recipientSurname', e.target.value)}
                  placeholder="Chaudhari"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Recipient Email</label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  placeholder="nsc@iiti.ac.in"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Institution / Lab</label>
                <input
                  type="text"
                  value={formData.recipientInstitution}
                  onChange={(e) => handleInputChange('recipientInstitution', e.target.value)}
                  placeholder="IIT Indore"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Student Background */}
          <div className="space-y-2.5 pt-2 border-t border-stone-line/70">
            <span className="block text-[11px] font-semibold text-teal-800">
              Your Details
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Your Full Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Degree & Year</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.studentYear}
                    onChange={(e) => handleInputChange('studentYear', e.target.value)}
                    placeholder="3rd Year"
                    className="w-1/2 px-2 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={formData.studentDegree}
                    onChange={(e) => handleInputChange('studentDegree', e.target.value)}
                    placeholder="B.Tech"
                    className="w-1/2 px-2 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Discipline</label>
                <input
                  type="text"
                  value={formData.studentDiscipline}
                  onChange={(e) => handleInputChange('studentDiscipline', e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Home Institution</label>
                <input
                  type="text"
                  value={formData.studentInstitution}
                  onChange={(e) => handleInputChange('studentInstitution', e.target.value)}
                  placeholder="e.g. NIT Trichy"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">GitHub / Portfolio Link</label>
              <input
                type="text"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
              />
            </div>
          </div>

          {/* Research Connection Details */}
          <div className="space-y-2.5 pt-2 border-t border-stone-line/70">
            <span className="block text-[11px] font-semibold text-teal-800">
              Specific Research Connection
            </span>
            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">Research Domain / Topic</label>
              <input
                type="text"
                value={formData.researchTopic}
                onChange={(e) => handleInputChange('researchTopic', e.target.value)}
                placeholder="e.g. Graph Neural Networks & Theoretical CS"
                className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
              />
            </div>

            {formData.templateType !== 'C' && (
              <>
                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">Paper / Project Reference</label>
                  <input
                    type="text"
                    value={formData.paperOrLabPage}
                    onChange={(e) => handleInputChange('paperOrLabPage', e.target.value)}
                    placeholder="e.g. your recent paper on adaptive message passing"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">Honest Observation or Question</label>
                  <textarea
                    rows={2}
                    value={formData.specificObservation}
                    onChange={(e) => handleInputChange('specificObservation', e.target.value)}
                    placeholder="e.g. how the diffusion matrix scales when graphs have dense hub nodes"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">Your Relevant Project / Baseline</label>
              <input
                type="text"
                value={formData.relevantProject}
                onChange={(e) => handleInputChange('relevantProject', e.target.value)}
                placeholder="e.g. a sparse benchmark for GNN convergence"
                className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">Specific Contribution & Tools</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.specificContribution}
                  onChange={(e) => handleInputChange('specificContribution', e.target.value)}
                  placeholder="profiled memory usage and latency"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
                <input
                  type="text"
                  value={formData.relevantTools}
                  onChange={(e) => handleInputChange('relevantTools', e.target.value)}
                  placeholder="PyTorch & Weights/Biases"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">Project / Code Link</label>
              <input
                type="text"
                value={formData.projectLink}
                onChange={(e) => handleInputChange('projectLink', e.target.value)}
                placeholder="https://github.com/user/project-repo"
                className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-ink-muted mb-0.5">Realistic Task you could contribute to</label>
              <input
                type="text"
                value={formData.realisticTask}
                onChange={(e) => handleInputChange('realisticTask', e.target.value)}
                placeholder="benchmarking baseline models or curating clean datasets"
                className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Dates & Follow-up Details */}
          <div className="space-y-2.5 pt-2 border-t border-stone-line/70">
            <span className="block text-[11px] font-semibold text-teal-800">
              Availability & Follow-up Settings
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">Start Date</label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="Dec 1, 2026"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted mb-0.5">End Date</label>
                <input
                  type="text"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  placeholder="Jan 15, 2027"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>
            </div>

            {(formData.templateType === 'D' || formData.templateType === 'E') && (
              <div className="space-y-2 bg-[#FAF8F5] p-2.5 rounded border border-stone-line">
                <div>
                  <label className="block text-[10px] text-ink-muted mb-0.5">Original Email Date</label>
                  <input
                    type="text"
                    value={formData.originalDateSent}
                    onChange={(e) => handleInputChange('originalDateSent', e.target.value)}
                    placeholder="October 14, 2026"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                  />
                </div>
                {formData.templateType === 'D' && (
                  <div>
                    <label className="block text-[10px] text-ink-muted mb-0.5">Optional One-Sentence Technical Update</label>
                    <input
                      type="text"
                      value={formData.recentUpdate}
                      onChange={(e) => handleInputChange('recentUpdate', e.target.value)}
                      placeholder="I recently completed benchmarking an additional baseline and posted the report."
                      className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-white text-xs outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="cvCheck"
                checked={formData.cvAttached}
                onChange={(e) => handleInputChange('cvAttached', e.target.checked)}
                className="rounded border-stone-line text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="cvCheck" className="text-xs text-ink-secondary cursor-pointer">
                Mention attached CV in closing line
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Preview & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-stone-line shadow-subtle overflow-hidden">
            {/* Live Preview Header */}
            <div className="p-4 border-b border-stone-line bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="font-semibold text-xs text-ink-primary font-mono uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-[11px] text-ink-muted font-mono">
                  ({rendered.wordCount} words)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Groq AI Button with Setup option */}
                {hasKey ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleGroqReview}
                      disabled={groqLoading}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-subtle transition-all cursor-pointer disabled:opacity-50"
                      title="Review tone and remove buzzwords using Groq AI"
                    >
                      <Wand2 className="w-3 h-3 text-teal-700" />
                      <span>{groqLoading ? 'Analyzing...' : 'AI Tone Review (Groq)'}</span>
                    </button>
                    <button
                      onClick={() => { setApiKeyInput(getGroqApiKey()); setShowApiKeyModal(true); }}
                      className="p-1 rounded-lg border border-teal-200 bg-white hover:bg-teal-50 text-teal-700 transition-colors"
                      title="Configure Groq API Key"
                    >
                      <Key className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setApiKeyInput(getGroqApiKey()); setShowApiKeyModal(true); }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 shadow-subtle transition-all cursor-pointer"
                    title="Add your free Groq API key to unlock AI tone review"
                  >
                    <Wand2 className="w-3 h-3 text-stone-500" />
                    <span>AI Review (Setup Key)</span>
                  </button>
                )}

                <button
                  onClick={copySubject}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary cursor-pointer shadow-subtle transition-all"
                  title="Copy subject line only"
                >
                  {copySuccess === 'subject' ? 'Copied Subject!' : 'Copy Subject'}
                </button>

                <button
                  onClick={copyBody}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-stone-line bg-white hover:bg-stone-hover text-ink-secondary cursor-pointer shadow-subtle transition-all"
                  title="Copy email body only"
                >
                  {copySuccess === 'body' ? 'Copied Body!' : 'Copy Body'}
                </button>

                <button
                  onClick={copyFullEmail}
                  className="px-3 py-1 text-xs font-semibold rounded bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all cursor-pointer"
                  title="Copy complete email with recipient and subject"
                >
                  {copySuccess === 'full' ? 'Copied Complete Email!' : 'Copy All'}
                </button>
              </div>
            </div>

            {/* Placeholder Warning */}
            {placeholderWarning && (
              <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{placeholderWarning}</span>
                </div>
                <button
                  onClick={() => setPlaceholderWarning(null)}
                  className="text-amber-800 font-bold ml-2"
                >
                  ×
                </button>
              </div>
            )}

            {/* Email Canvas */}
            <div className="p-6 space-y-4">
              {/* To: and Subject: fields */}
              <div className="space-y-1.5 pb-3 border-b border-stone-line/70 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-ink-muted w-14">To:</span>
                  <span className="text-ink-primary font-semibold">
                    {formData.recipientEmail || <span className="text-amber-700 bg-amber-50 px-1 rounded">[Recipient Email]</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-muted w-14">Subject:</span>
                  <span className="text-ink-primary font-semibold">
                    {rendered.subject}
                  </span>
                </div>
              </div>

              {/* Email Body text */}
              <div className="relative">
                <textarea
                  rows={14}
                  value={rendered.body}
                  onChange={(e) => setCustomBodyOverride(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#FAF8F5] border border-stone-line/80 font-mono text-xs text-ink-primary leading-relaxed outline-none focus:bg-white focus:border-teal-600 transition-colors"
                />
                <span className="absolute right-3 bottom-3 text-[10px] text-ink-muted font-sans bg-white/80 px-1.5 py-0.5 rounded border border-stone-line">
                  Editable preview
                </span>
              </div>

              {/* Unresolved Placeholders Indicator */}
              {rendered.unresolvedPlaceholders.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unresolved Bracketed Placeholders ({rendered.unresolvedPlaceholders.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rendered.unresolvedPlaceholders.map((ph) => (
                      <span
                        key={ph}
                        className="px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-300 font-mono text-[11px]"
                      >
                        {ph}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mailto Launcher Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <button
                  onClick={launchEmailClient}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-stone-hover border border-stone-line text-ink-primary font-medium shadow-subtle transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-teal-700" />
                  <span>Open in Default Email Client (mailto)</span>
                </button>

                <p className="text-[11px] text-ink-muted leading-tight">
                  Note: Email apps do not attach files automatically via mailto. Attach your PDF CV manually before sending!
                </p>
              </div>
            </div>
          </div>

          {/* Groq AI Critique & Polished Text Drawer */}
          {groqFeedback && (
            <div className="rounded-xl border border-teal-300 bg-teal-50/80 p-5 space-y-3 shadow-subtle animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-teal-700" />
                  <h4 className="font-semibold text-teal-950 font-serif-title text-sm">
                    Academic Tone Feedback (Groq AI)
                  </h4>
                </div>
                <button
                  onClick={() => setGroqFeedback(null)}
                  className="text-teal-800 hover:text-teal-950 font-bold"
                >
                  ×
                </button>
              </div>

              {groqFeedback.critique.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-teal-900 text-[11px]">Academic Review:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-teal-950/90 text-[11px]">
                    {groqFeedback.critique.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {groqFeedback.polishedText && (
                <div className="space-y-2 pt-2 border-t border-teal-200/80">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-teal-900 text-[11px]">Suggested Tighter Version:</span>
                    <button
                      onClick={applyGroqPolish}
                      className="px-2 py-0.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-medium shadow-subtle cursor-pointer"
                    >
                      Apply Polish to Canvas
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-white/90 border border-teal-200 font-mono text-[11px] text-ink-primary whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {groqFeedback.polishedText}
                  </pre>
                </div>
              )}
            </div>
          )}

          {groqError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
              {groqError}
            </div>
          )}

          {/* Pre-Send Personalization Checklist (Mandatory prompt requirement) */}
          <div className="bg-white rounded-xl border border-stone-line p-5 shadow-subtle space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-line pb-2">
              <span className="font-semibold text-ink-primary uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-teal-700" />
                Pre-Send Personalization Checklist
              </span>
              <span className="text-[10px] text-ink-muted">
                Academic Best Practices
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-secondary">
              {[
                { key: 'recipient', label: 'Correct recipient name and institution' },
                { key: 'connection', label: 'One specific research connection (paper/project)' },
                { key: 'example', label: 'One concrete example of your own work' },
                { key: 'availability', label: 'Exact availability (e.g. Dec 1 to Jan 15)' },
                { key: 'reasonable', label: 'A clear, reasonable request (not asking for a job)' },
                { key: 'links', label: 'Working links (GitHub, report, or demo verified)' },
                { key: 'noClaims', label: 'No unsupported claims or exaggerated enthusiasm' },
                { key: 'cv', label: 'CV attached if mentioned in email' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className="flex items-start gap-2 p-1.5 rounded hover:bg-stone-hover text-left cursor-pointer transition-colors"
                >
                  {checklist[item.key] ? (
                    <CheckSquare className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-ink-muted shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[11px] ${checklist[item.key] ? 'text-ink-primary font-medium' : 'text-ink-muted'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="pt-2 text-[10px] text-ink-muted border-t border-stone-line/60">
              Disclaimer: These are starting drafts, not messages guaranteed to get replies. Faculty response rates depend on group capacity, funding, and genuine research fit.
            </p>
          </div>
        </div>
      </div>

      {/* Groq API Key Setup Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug">Groq AI Settings</h3>
                  <p className="text-[11px] text-stone-500">Optional AI tone review & buzzword stripper</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              Your key is saved locally in your browser (<span className="font-mono text-[10px] bg-stone-100 px-1 py-0.5 rounded">localStorage</span>). It connects directly to Groq's high-speed Llama 3.3 model and is never stored on any server.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Groq API Key <span className="font-normal text-stone-500">(starts with gsk_)</span>
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700 bg-stone-50/50"
              />
              <p className="text-[11px] text-stone-400">
                Don't have one? Get a free API key in seconds from{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 underline hover:text-teal-900"
                >
                  console.groq.com
                </a>
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput('');
                  setGroqApiKey('');
                  setHasKey(false);
                  setShowApiKeyModal(false);
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear Key
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 text-xs font-medium bg-teal-800 hover:bg-teal-900 text-white rounded-lg transition-colors shadow-subtle"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
