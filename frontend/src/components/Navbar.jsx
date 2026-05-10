import { BrainCircuit, GitBranch, Github, LayoutDashboard, Loader2, Search } from 'lucide-react';

const Navbar = ({
  repositoryUrl,
  onRepositoryUrlChange,
  onAnalyze,
  isLoading,
  mode,
  onModeChange,
  currentView,
  onNavigate,
  hasAnalysis,
}) => (
  <header className="sticky top-0 z-20 border-b border-line bg-white/85 shadow-[0_10px_30px_rgba(23,32,51,0.06)] backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1540px] flex-col gap-3 px-4 py-3.5 lg:flex-row lg:items-center lg:px-6">
      <button type="button" onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 text-left">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white shadow-[0_14px_28px_rgba(23,32,51,0.22)]">
          <BrainCircuit size={22} />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-normal text-ink">RepoLens</p>
          <p className="text-xs font-medium text-slate-500">AI repository intelligence</p>
        </div>
      </button>

      <div className="flex rounded-xl border border-line bg-slate-100/80 p-1 lg:ml-3">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-extrabold transition ${
            currentView === 'dashboard' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:bg-white/70 hover:text-ink'
          }`}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => hasAnalysis && onNavigate('structure')}
          disabled={!hasAnalysis}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-extrabold transition ${
            currentView === 'structure' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:bg-white/70 hover:text-ink'
          } disabled:cursor-not-allowed disabled:opacity-45`}
        >
          <GitBranch size={15} />
          Project Structure
        </button>
      </div>

      <form className="flex flex-1 flex-col gap-3 lg:ml-6 lg:flex-row" onSubmit={onAnalyze}>
        <div className="relative flex-1">
          <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input
            value={repositoryUrl}
            onChange={(event) => onRepositoryUrlChange(event.target.value)}
            placeholder="https://github.com/facebook/react"
            className="h-11 w-full rounded-xl border border-line bg-white/95 pl-10 pr-4 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <select
          value={mode}
          onChange={(event) => onModeChange(event.target.value)}
          className="h-11 rounded-xl border border-line bg-white/95 px-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-violet-100"
        >
          <option value="standard">Standard</option>
          <option value="beginner">Beginner</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(192,132,252,0.30)] transition hover:-translate-y-0.5 hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Analyze
        </button>
      </form>
    </div>
  </header>
);

export default Navbar;
