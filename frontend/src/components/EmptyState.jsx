import { ArrowRight, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';

const examples = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'https://github.com/nodejs/node',
];

const EmptyState = ({ onExampleSelect }) => (
  <section className="surface-card overflow-hidden rounded-xl">
    <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[minmax(0,1.05fr)_420px] xl:p-10">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-brand shadow-sm">
          <Sparkles size={14} />
          Enterprise repository analysis
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-normal text-ink md:text-5xl xl:text-6xl">
          Understand any public GitHub repository in minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
          RepoLens reads structure, documentation, dependencies, and source files to produce a clear technical report for developers, students, recruiters, and engineering teams.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            ['Architecture', 'Folder and flow insights'],
            ['Setup', 'Install and run steps'],
            ['Quality', 'Suggestions and scoring'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-xl border border-line bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white">
              <p className="font-bold text-ink">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-line bg-slate-50/80 p-5 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <FileSearch size={18} />
          Try a repository
        </div>
        <div className="mt-4 space-y-3">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onExampleSelect(example)}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-sm"
            >
              <span className="min-w-0 truncate">{example}</span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <p>Public repositories work immediately. Add a GitHub token on the backend for higher rate limits.</p>
        </div>
      </div>
    </div>
  </section>
);

export default EmptyState;
