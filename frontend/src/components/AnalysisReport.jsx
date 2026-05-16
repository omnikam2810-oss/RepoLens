import { BookOpen, Gauge, Layers3, Lightbulb, ListChecks, Rocket, ShieldCheck } from 'lucide-react';

const Section = ({ icon: Icon, title, children, id }) => (
  <section
    id={id}
    className="surface-card card-glow scroll-mt-24 rounded-xl p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_26px_60px_rgba(23,32,51,0.13)] sm:scroll-mt-28 sm:rounded-2xl sm:p-6"
  >
    <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-violet-100 bg-violet-50 text-brand shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
        <Icon size={19} />
      </span>
      <h2 className="text-base font-extrabold text-ink">{title}</h2>
    </div>
    {children}
  </section>
);

const BulletList = ({ items = [] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="soft-panel rounded-lg px-3 py-2.5 text-sm leading-6 text-slate-600 transition hover:border-violet-200 hover:bg-white sm:rounded-xl sm:px-4 sm:py-3">
        {item}
      </li>
    ))}
  </ul>
);

const toBulletItems = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value || typeof value !== 'string') return [];

  return value
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((item) => item.replace(/^[-*\u2022\d.]+\s*/, '').trim())
    .filter(Boolean);
};

const AnalysisReport = ({ result }) => {
  const analysis = result.analysis;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Section id="project-summary" icon={BookOpen} title="Project Summary">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-base font-semibold leading-7 text-ink sm:text-lg sm:leading-8">{analysis.projectSummary}</p>
          <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{analysis.projectPurpose}</p>
          <div className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {analysis.projectType}
          </div>
        </div>
      </Section>

      <div className="grid gap-4 sm:gap-6">
        <Section id="architecture-overview" icon={Layers3} title="Architecture Overview">
          <BulletList items={toBulletItems(analysis.architectureOverview)} />
        </Section>
        <Section id="setup-instructions" icon={Rocket} title="Setup Instructions">
          <BulletList items={analysis.setupInstructions || []} />
        </Section>
      </div>

      <Section id="feature-breakdown" icon={ListChecks} title="Feature Breakdown">
        <BulletList items={analysis.features || []} />
      </Section>

      <div className="grid gap-4 sm:gap-6">
        <Section id="folder-explanation" icon={BookOpen} title="Folder Explanation">
          <div className="space-y-3">
            {(analysis.folderExplanation || []).map((folder) => (
              <div key={folder.path} className="rounded-lg border border-line bg-slate-50/70 p-3 transition hover:border-violet-200 hover:bg-white hover:shadow-sm sm:rounded-xl sm:p-4">
                <p className="text-sm font-extrabold text-ink">{folder.path}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{folder.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section id="important-files" icon={Lightbulb} title="Important Files">
          <div className="space-y-3">
            {(analysis.importantFiles || []).map((file) => (
              <div key={file.path} className="rounded-lg border border-line bg-slate-50/70 p-3 transition hover:border-violet-200 hover:bg-white hover:shadow-sm sm:rounded-xl sm:p-4">
                <p className="text-sm font-extrabold text-ink">{file.path}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{file.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Section id="suggestions" icon={Lightbulb} title="Suggestions">
          <BulletList items={analysis.suggestions || []} />
        </Section>
        <Section id="security-suggestions" icon={ShieldCheck} title="Security Suggestions">
          <BulletList items={analysis.securitySuggestions || []} />
        </Section>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Section id="quality-score" icon={Gauge} title="Quality Score">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[7px] border-violet-100 bg-white shadow-inner sm:h-24 sm:w-24 sm:border-8">
              <span className="text-xl font-extrabold text-ink sm:text-2xl">{analysis.codeQualityScore?.score ?? 0}</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-500">Repository health score</p>
              <div className="mt-3">
                <BulletList items={toBulletItems(analysis.codeQualityScore?.rationale || 'Run an analysis to generate scoring.')} />
              </div>
            </div>
          </div>
        </Section>
        <Section id="beginner-mode" icon={BookOpen} title="Beginner Mode">
          <BulletList items={toBulletItems(analysis.beginnerExplanation)} />
        </Section>
      </div>
    </div>
  );
};

export default AnalysisReport;
