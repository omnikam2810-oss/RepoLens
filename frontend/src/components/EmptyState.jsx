import { motion } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  ChevronRight,
  Code2,
  FileSearch,
  Github,
  Layers3,
  Loader2,
  LockKeyhole,
  Network,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import projectTreePreview from '../assets/project-tree-preview.png';

const examples = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'https://github.com/nodejs/node',
];

const featureCards = [
  {
    icon: Layers3,
    title: 'Architecture intelligence',
    description: 'Map folders, entry points, services, components, and system flow into a readable technical narrative.',
  },
  {
    icon: Rocket,
    title: 'Setup clarity',
    description: 'Extract install steps, runtime requirements, manifests, and practical onboarding guidance from the repository.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality review',
    description: 'Surface maintainability signals, security suggestions, dependency notes, and a concise health score.',
  },
  {
    icon: Network,
    title: 'Project structure',
    description: 'Explore a focused repository tree with important files and directories grouped for fast inspection.',
  },
];

const workflowSteps = [
  ['01', 'Paste a public repository', 'RepoLens validates the GitHub URL and prepares the analysis mode.'],
  ['02', 'Build a repository snapshot', 'The backend fetches metadata, directory structure, and high-signal files.'],
  ['03', 'Generate structured insight', 'Gemini returns a typed report for developers, recruiters, and teams.'],
];

const showcaseCards = [
  ['Architecture', 'Routing, services, modules, and data flow summarized for quick review.', Layers3],
  ['Dependencies', 'Package manifests and framework signals converted into practical insight.', Boxes],
  ['Recruiter view', 'Project value, purpose, and technical scope explained without noise.', Star],
];

const metrics = [
  ['92', 'Readability score'],
  ['14', 'Important files'],
  ['38', 'Folders scanned'],
  ['7', 'Actionable suggestions'],
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="mx-auto max-w-3xl text-center">
    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-xs sm:tracking-[0.18em]">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:mt-3 md:text-4xl">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">{description}</p>
  </div>
);

const EmptyState = ({
  repositoryUrl,
  onRepositoryUrlChange,
  onAnalyze,
  isLoading,
  mode,
  onModeChange,
  onExampleSelect,
}) => (
  <div id="top" className="landing-page overflow-hidden">
    <section className="relative isolate min-h-[calc(100vh-6rem)] rounded-2xl border border-white/80 bg-white/88 px-4 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:rounded-[24px] sm:px-8 sm:py-8 lg:rounded-[28px] lg:px-10 lg:py-12">
      <div className="hero-grid" />
      <div className="hero-sheen" />

      <div className="relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.45 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[11px] font-extrabold text-brand shadow-[0_10px_28px_rgba(124,58,237,0.10)] sm:text-xs">
            <Sparkles size={14} />
            AI repository intelligence
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-[1.03] text-ink sm:mt-7 sm:text-5xl md:text-7xl xl:text-[82px]">
            Turn any GitHub repository into an executive-ready technical brief.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:mt-6 md:text-xl md:leading-9">
            RepoLens analyzes structure, documentation, dependencies, and source files to deliver clear architecture,
            setup, quality, and hiring-ready insights in one polished report.
          </p>

          <form
            onSubmit={onAnalyze}
            className="mt-6 max-w-4xl rounded-xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_48px_rgba(15,23,42,0.10)] sm:mt-9 sm:rounded-2xl sm:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_112px] gap-2 lg:grid-cols-[minmax(0,1fr)_150px_190px]">
              <label className="relative col-span-2 block sm:col-span-1">
                <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4" size={20} />
                <input
                  value={repositoryUrl}
                  onChange={(event) => onRepositoryUrlChange(event.target.value)}
                  placeholder="https://github.com/facebook/react"
                  className="h-11 w-full rounded-lg border border-transparent bg-slate-50 pl-10 pr-3 text-sm font-semibold text-ink outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(192,132,252,0.16)] sm:h-14 sm:rounded-xl sm:pl-12 sm:pr-4 sm:text-base"
                />
              </label>

              <select
                value={mode}
                onChange={(event) => onModeChange(event.target.value)}
                className="h-11 min-w-0 rounded-lg border border-transparent bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none transition hover:bg-white focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(192,132,252,0.16)] sm:h-14 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                <option value="fast">Fast</option>
                <option value="standard">Standard</option>
                <option value="beginner">Beginner</option>
                <option value="recruiter">Recruiter</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-extrabold text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                <span className="sm:hidden">Analyze</span>
                <span className="hidden sm:inline">Analyze Repository</span>
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4 sm:text-sm">
            <span className="font-semibold text-slate-500">Try:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => onExampleSelect(example)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-sm sm:px-3"
              >
                {example.replace('https://github.com/', '')}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <a
              href="#features"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:h-12 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
            >
              Explore Features
              <ChevronRight size={17} />
            </a>
            <a
              href="#showcase"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 text-xs font-extrabold text-slate-600 transition hover:bg-white hover:text-ink sm:h-12 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
            >
              View Demo
              <ArrowRight size={17} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section id="features" className="scroll-mt-24 py-8 sm:scroll-mt-28 sm:py-10">
      <SectionHeader
        eyebrow="Repository intelligence"
        title="Everything an engineering team needs to understand a codebase faster."
        description="Feature cards are tuned for real repository analysis, from architecture and setup to quality signals and project structure."
      />
      <div className="mt-7 grid gap-3 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_28px_70px_rgba(15,23,42,0.11)] sm:rounded-2xl sm:p-5"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white shadow-lg transition group-hover:scale-105 group-hover:bg-brand">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-ink sm:mt-5 sm:text-lg">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3">{description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-8 sm:py-12">
      <SectionHeader
        eyebrow="Workflow"
        title="From repository URL to boardroom-ready analysis."
        description="The existing backend workflow stays intact while the experience now communicates the product value clearly."
      />
      <div className="mt-7 grid gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
        {workflowSteps.map(([step, title, description]) => (
          <div key={step} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] sm:rounded-2xl sm:p-6">
            <span className="text-sm font-extrabold text-brand">{step}</span>
            <h3 className="mt-4 text-xl font-extrabold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="showcase" className="scroll-mt-24 py-8 sm:scroll-mt-28 sm:py-12">
      <div className="showcase-panel grid gap-4 rounded-2xl p-4 sm:gap-6 sm:rounded-[28px] sm:p-5 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
        <div className="flex flex-col justify-between gap-6 sm:gap-10">
          <div>
            <p className="showcase-eyebrow text-xs font-extrabold uppercase tracking-[0.18em]">Product showcase</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:mt-4 md:text-4xl">A polished analysis workspace for serious code review.</h2>
            <p className="showcase-copy mt-3 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7">
              RepoLens turns raw repository data into a clean dashboard that is easy to scan, export, and share.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {showcaseCards.map(([title, description, Icon]) => (
              <div key={title} className="showcase-card rounded-xl p-4">
                <Icon className="showcase-icon" size={18} />
                <p className="mt-3 text-sm font-extrabold">{title}</p>
                <p className="showcase-copy mt-1 text-xs leading-5">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-media rounded-xl p-3 sm:rounded-2xl sm:p-4">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {metrics.map(([value, label]) => (
              <div key={label} className="showcase-card rounded-lg p-3 sm:rounded-xl sm:p-5">
                <p className="text-3xl font-extrabold sm:text-4xl">{value}</p>
                <p className="showcase-copy mt-2 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
          <div className="showcase-tree-preview mt-4 overflow-hidden rounded-xl">
            <img
              src={projectTreePreview}
              alt="RepoLens project structure tree preview"
              className="h-auto max-h-[320px] w-full object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>

    <section className="py-8 sm:py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:rounded-[28px] sm:p-8 sm:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-ink text-white shadow-lg">
          <FileSearch size={22} />
        </div>
        <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold leading-tight text-ink sm:mt-5 md:text-4xl">
          Analyze your next repository with confidence.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
          Built for developers, students, recruiters, and engineering teams who need technical clarity quickly.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-7">
          <a
            href="#top"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-extrabold text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 sm:h-12 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
          >
            Analyze Repository
            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>

    <footer className="border-t border-slate-200 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
            <Code2 size={20} />
          </div>
          <div>
            <p className="font-extrabold text-ink">RepoLens</p>
            <p className="text-sm font-medium text-slate-500">AI repository intelligence</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
          <a href="#features" className="transition hover:text-ink">Features</a>
          <a href="#showcase" className="transition hover:text-ink">Showcase</a>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <LockKeyhole size={14} />
            Public repositories only
          </span>
        </div>
      </div>
    </footer>
  </div>
);

export default EmptyState;
