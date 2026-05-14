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
    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-4xl">{title}</h2>
    <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
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
    <section className="relative isolate min-h-[calc(100vh-7.5rem)] rounded-[28px] border border-white/80 bg-white/88 px-5 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-12">
      <div className="hero-grid" />
      <div className="hero-sheen" />

      <div className="relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.45 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-extrabold text-brand shadow-[0_10px_28px_rgba(124,58,237,0.10)]">
            <Sparkles size={14} />
            AI repository intelligence
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-extrabold leading-[0.98] text-ink md:text-7xl xl:text-[82px]">
            Turn any GitHub repository into an executive-ready technical brief.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl md:leading-9">
            RepoLens analyzes structure, documentation, dependencies, and source files to deliver clear architecture,
            setup, quality, and hiring-ready insights in one polished report.
          </p>

          <form
            onSubmit={onAnalyze}
            className="mt-9 max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_150px_190px]">
              <label className="relative block">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={21} />
                <input
                  value={repositoryUrl}
                  onChange={(event) => onRepositoryUrlChange(event.target.value)}
                  placeholder="https://github.com/facebook/react"
                  className="h-14 w-full rounded-xl border border-transparent bg-slate-50 pl-12 pr-4 text-base font-semibold text-ink outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(192,132,252,0.16)]"
                />
              </label>

              <select
                value={mode}
                onChange={(event) => onModeChange(event.target.value)}
                className="h-14 rounded-xl border border-transparent bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition hover:bg-white focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(192,132,252,0.16)]"
              >
                <option value="standard">Standard</option>
                <option value="beginner">Beginner</option>
                <option value="recruiter">Recruiter</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-extrabold text-white shadow-[0_18px_44px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Analyze Repository
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-500">Try:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => onExampleSelect(example)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-sm"
              >
                {example.replace('https://github.com/', '')}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              Explore Features
              <ChevronRight size={17} />
            </a>
            <a
              href="#showcase"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent px-5 text-sm font-extrabold text-slate-600 transition hover:bg-white hover:text-ink"
            >
              View Demo
              <ArrowRight size={17} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <section id="features" className="scroll-mt-28 py-10">
      <SectionHeader
        eyebrow="Repository intelligence"
        title="Everything an engineering team needs to understand a codebase faster."
        description="Feature cards are tuned for real repository analysis, from architecture and setup to quality signals and project structure."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_28px_70px_rgba(15,23,42,0.11)]"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white shadow-lg transition group-hover:scale-105 group-hover:bg-brand">
              <Icon size={20} />
            </div>
            <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-12">
      <SectionHeader
        eyebrow="Workflow"
        title="From repository URL to boardroom-ready analysis."
        description="The existing backend workflow stays intact while the experience now communicates the product value clearly."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {workflowSteps.map(([step, title, description]) => (
          <div key={step} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <span className="text-sm font-extrabold text-brand">{step}</span>
            <h3 className="mt-4 text-xl font-extrabold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="showcase" className="scroll-mt-28 py-12">
      <div className="showcase-panel grid gap-6 rounded-[28px] p-5 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="showcase-eyebrow text-xs font-extrabold uppercase tracking-[0.18em]">Product showcase</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">A polished analysis workspace for serious code review.</h2>
            <p className="showcase-copy mt-4 text-base leading-7">
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

        <div className="showcase-media rounded-2xl p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map(([value, label]) => (
              <div key={label} className="showcase-card rounded-xl p-5">
                <p className="text-4xl font-extrabold">{value}</p>
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

    <section className="py-12">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-ink text-white shadow-lg">
          <FileSearch size={22} />
        </div>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-ink md:text-4xl">
          Analyze your next repository with confidence.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Built for developers, students, recruiters, and engineering teams who need technical clarity quickly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#top"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-extrabold text-white shadow-[0_18px_44px_rgba(15,23,42,0.20)] transition hover:-translate-y-0.5 hover:bg-slate-800"
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
