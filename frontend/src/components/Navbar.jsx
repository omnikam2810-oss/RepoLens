import { BrainCircuit, GitBranch, Github, LayoutDashboard, Loader2, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
}) => {
  const { isDark, toggleTheme } = useTheme();
  const ThemeIcon = isDark ? Sun : Moon;

  return (
  <header className="sticky top-0 z-20 border-b border-white/70 bg-white/86 shadow-[0_12px_34px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
    <div className="mx-auto flex max-w-[1540px] flex-col gap-3 px-3 py-2.5 sm:px-4 lg:flex-row lg:items-center lg:px-6 lg:py-3.5">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onNavigate('dashboard')} className="flex min-w-0 items-center gap-2.5 text-left sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white shadow-[0_12px_26px_rgba(15,23,42,0.20)] ring-1 ring-white/20 sm:h-11 sm:w-11 sm:rounded-xl">
          <BrainCircuit size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-base font-extrabold tracking-normal text-ink sm:text-lg">RepoLens</p>
          <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">AI repository intelligence</p>
        </div>
      </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          className="theme-toggle grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white/95 text-brand shadow-sm transition hover:-translate-y-0.5 hover:border-brand lg:hidden"
        >
          <ThemeIcon size={16} />
        </button>
      </div>

      {hasAnalysis && (
        <div className="grid w-full grid-cols-2 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1 shadow-inner lg:ml-3 lg:w-auto lg:rounded-xl">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[11px] font-extrabold transition sm:h-9 sm:gap-2 sm:px-3 sm:text-xs ${
              currentView === 'dashboard' ? 'bg-white text-brand shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:bg-white/70 hover:text-ink'
            }`}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('structure')}
            className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[11px] font-extrabold transition sm:h-9 sm:gap-2 sm:px-3 sm:text-xs ${
              currentView === 'structure' ? 'bg-white text-brand shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:bg-white/70 hover:text-ink'
            }`}
          >
            <GitBranch size={15} />
            Project Structure
          </button>
        </div>
      )}

      {hasAnalysis && (
        <form className="grid flex-1 grid-cols-[minmax(0,1fr)_94px] gap-2 lg:ml-6 lg:flex lg:flex-row lg:gap-3" onSubmit={onAnalyze}>
          <div className="relative col-span-2 flex-1 sm:col-span-1">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              value={repositoryUrl}
              onChange={(event) => onRepositoryUrlChange(event.target.value)}
              placeholder="https://github.com/facebook/react"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-10 pr-3 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-brand focus:shadow-[0_0_0_4px_rgba(192,132,252,0.14)] sm:h-11 sm:rounded-xl sm:pr-4"
            />
          </div>

          <select
            value={mode}
            onChange={(event) => onModeChange(event.target.value)}
            className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white/95 px-2.5 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand focus:shadow-[0_0_0_4px_rgba(192,132,252,0.14)] sm:h-11 sm:rounded-xl sm:px-3 sm:text-sm"
          >
            <option value="fast">Fast</option>
            <option value="standard">Standard</option>
            <option value="beginner">Beginner</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-bold text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_20px_42px_rgba(15,23,42,0.24)] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:rounded-xl sm:px-5 sm:text-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            Analyze
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        className="theme-toggle hidden h-11 items-center justify-between rounded-xl border border-slate-200 bg-white/95 px-3 text-sm font-extrabold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:text-brand lg:ml-auto lg:inline-flex lg:w-auto lg:min-w-32"
      >
        <span>{isDark ? 'Light' : 'Dark'}</span>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-brand">
          <ThemeIcon size={16} />
        </span>
      </button>
    </div>
  </header>
  );
};

export default Navbar;
