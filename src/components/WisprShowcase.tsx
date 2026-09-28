import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  Clock,
  Eye,
  Check,
  X
} from 'lucide-react';

interface WisprShowcaseProps {
  onLoadTemplateInStudio: () => void;
}

export const WisprShowcase: React.FC<WisprShowcaseProps> = ({ onLoadTemplateInStudio }) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');

  return (
    <div className="rounded-2xl border border-stone-line bg-white shadow-subtle overflow-hidden">
      {/* Top Bar with Wispr Flow Segmented Pill Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-line bg-canvas-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
          <h3 className="font-serif-title text-base sm:text-lg font-semibold text-ink-primary">
            The Outreach Anatomy: What Faculty Actually Read
          </h3>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Interactive Comparison
          </span>
        </div>

        {/* Segmented Pill Selector (Wispr Flow style) */}
        <div className="inline-flex bg-white rounded-full p-1 border border-stone-line shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('after')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'after'
                ? 'bg-teal-700 text-white shadow-xs font-semibold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Targeted Pitch (Accepted)</span>
          </button>
          <button
            onClick={() => setActiveTab('before')}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'before'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cliché Cold Email (Deleted)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Email Document Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-stone-line bg-[#FDFCFB] p-5 sm:p-7 shadow-xs relative text-xs font-mono leading-relaxed space-y-4">
            {activeTab === 'after' ? (
              /* ACCEPTED TARGETED PITCH */
              <>
                <div className="pb-3 border-b border-stone-line/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
                  <div>
                    <span className="text-ink-primary font-semibold">Subject:</span>{' '}
                    <span>Winter research inquiry — Graph Representation Learning, Dec 1–Jan 15</span>
                  </div>
                  <span className="annotation-pill bg-emerald-50 text-emerald-800 border border-emerald-300">
                    ✓ Clear Subject & Exact Window
                  </span>
                </div>

                <div className="space-y-3.5 text-ink-primary text-xs">
                  <div className="relative group">
                    <p>Dear Professor Chaudhari,</p>
                    <span className="annotation-pill bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                      ✓ Direct surname salutation (No "Respected Visionary")
                    </span>
                  </div>

                  <div>
                    <p>
                      I’m Aarav Sharma, a 3rd-year B.Tech student in Computer Science at NIT Trichy. I’m writing to ask whether you might consider a student researcher in your group from Dec 1, 2026 to Jan 15, 2027.
                    </p>
                    <span className="annotation-pill bg-teal-50 text-teal-800 border border-teal-200 mt-1">
                      ✓ Exact dates & background stated in sentence 2
                    </span>
                  </div>

                  <div>
                    <p>
                      I read your recent work on adaptive message-passing in sparse graph neural networks, particularly your analysis in Section 3.2 regarding the memory overhead on high-degree hub nodes.
                    </p>
                    <span className="annotation-pill bg-blue-50 text-blue-800 border border-blue-200 mt-1">
                      ✓ Specific section cited (Proof of genuine reading)
                    </span>
                  </div>

                  <div>
                    <p>
                      To prepare, I implemented a lightweight PyTorch Geometric baseline reproducing inference latency benchmarks on citation graphs (code & report:{' '}
                      <span className="text-teal-700 underline font-semibold">github.com/aarav/gnn-benchmark</span>). During a winter stay, I could contribute to baseline profiling or dataset curation while learning more about your theoretical work.
                    </p>
                    <span className="annotation-pill bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                      ✓ Verifiable code link + realistic humble task
                    </span>
                  </div>

                  <div>
                    <p>
                      Would you be open to discussing whether there is a suitable project in your lab? I have attached my 1-page CV.
                    </p>
                    <p className="mt-2 text-ink-secondary">
                      Best,<br />
                      Aarav Sharma<br />
                      github.com/aarav
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* REJECTED CLICHÉ COLD EMAIL */
              <>
                <div className="pb-3 border-b border-stone-line/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
                  <div>
                    <span className="text-ink-primary font-semibold">Subject:</span>{' '}
                    <span className="text-amber-800">REQUEST FOR WINTER INTERNSHIP OPPORTUNITY 2026</span>
                  </div>
                  <span className="annotation-pill bg-amber-50 text-amber-800 border border-amber-300">
                    ! Generic all-caps subject
                  </span>
                </div>

                <div className="space-y-3.5 text-ink-primary text-xs">
                  <div>
                    <p className="text-ink-secondary">
                      Respected Sir / Esteemed Director, I hope this email finds you in the best of health and spirits.
                    </p>
                    <span className="annotation-pill bg-amber-100 text-amber-900 border border-amber-300 mt-1">
                      ! Cliché greeting & sycophantic filler
                    </span>
                  </div>

                  <div>
                    <p className="text-ink-secondary">
                      Your globally esteemed and prestigious laboratory is a beacon of innovation in India. I am deeply fascinated by your visionary research.
                    </p>
                    <span className="annotation-pill bg-red-50 text-red-800 border border-red-200 mt-1">
                      ! Copy-pasted empty flattery (Immediate delete signal)
                    </span>
                  </div>

                  <div>
                    <p className="text-ink-secondary">
                      I am a highly motivated student passionate about Artificial Intelligence, Machine Learning, Deep Learning, Cloud Computing, Cyber Security, and Robotics. I am eager to work on any project you deem fit.
                    </p>
                    <span className="annotation-pill bg-amber-100 text-amber-900 border border-amber-300 mt-1">
                      ! Buzzword overload + No domain focus ("will do anything")
                    </span>
                  </div>

                  <div>
                    <p className="text-ink-secondary">
                      I have built many impressive projects and have high academic excellence. Please grant me a prestigious internship in your laboratory. Attached are my high school marksheets and certificates.
                    </p>
                    <span className="annotation-pill bg-red-50 text-red-800 border border-red-200 mt-1">
                      ! Zero links to verifiable code • High school filler
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-ink-muted">
              {activeTab === 'after'
                ? 'Length: 138 words (45-sec skim reading time)'
                : 'Length: 260 words (bloated with meaningless filler)'}
            </span>

            {activeTab === 'after' && (
              <button
                onClick={onLoadTemplateInStudio}
                className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
              >
                <span>Customize this in Email Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Diagnosis & Metrics Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`rounded-xl p-5 border text-xs space-y-3.5 ${
            activeTab === 'after'
              ? 'bg-teal-50/50 border-teal-200 text-teal-950'
              : 'bg-amber-50/50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-current/20">
              <span className="font-mono uppercase font-bold text-[11px] tracking-wider">
                {activeTab === 'after' ? 'Faculty Reception: Favorable' : 'Faculty Reception: Ignored'}
              </span>
              <span className="text-[10px] font-mono">
                {activeTab === 'after' ? '45s Skim' : '<5s Delete'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Signal-to-Noise Ratio:</span>
                <strong className="font-mono text-ink-primary">
                  {activeTab === 'after' ? '98% (High)' : '10% (Low)'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Verifiable Evidence:</span>
                <strong className="font-mono text-ink-primary">
                  {activeTab === 'after' ? 'GitHub Baseline Repo' : 'None (Claims Only)'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Timeline Clarity:</span>
                <strong className="font-mono text-ink-primary">
                  {activeTab === 'after' ? 'Dec 1 – Jan 15 (Exact)' : 'Unspecified'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Tone:</span>
                <strong className="font-mono text-ink-primary">
                  {activeTab === 'after' ? 'Quiet Technical Competence' : 'Sycophancy & Desperation'}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-current/20 text-[11px] leading-relaxed">
              {activeTab === 'after' ? (
                <p>
                  <strong>Why it works:</strong> Professors read this email in 45 seconds between classes. The specific citation shows you did your homework; the code link proves you can write scripts; the realistic task suggests you won't be a burden.
                </p>
              ) : (
                <p>
                  <strong>Why it fails:</strong> Professors get 30+ identical emails daily. Sycophancy ("esteemed lab", "visionary") signals mass copy-pasting. Without a link or specific research tie-in, it goes straight to the archive folder.
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onLoadTemplateInStudio}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Email Studio with Template A</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
