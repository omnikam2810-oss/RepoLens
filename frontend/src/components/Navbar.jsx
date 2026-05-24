import { useEffect, useState } from 'react';
import { BrainCircuit, GitBranch, Github, LayoutDashboard, Loader2, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitch = ({ isDark, onToggle, className = '' }) => (
  <button
    type="button"
    role="switch"
    onClick={onToggle}
    aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    aria-checked={isDark}
    title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    className={`theme-switch inline-grid h-7 w-[60px] shrink-0 grid-cols-2 place-items-center rounded-full border p-1 shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-200/70 sm:h-8 sm:w-[68px] ${className}`}
  >
    <span className="sr-only">{isDark ? 'Dark theme enabled' : 'Light theme enabled'}</span>
    <span className={`theme-switch-knob absolute left-1 top-1 h-5 w-5 rounded-full transition-transform duration-300 ease-out sm:h-6 sm:w-6 ${isDark ? 'translate-x-[29px] sm:translate-x-[33px]' : 'translate-x-0'}`} />
    <span className={`theme-switch-slot relative z-10 grid h-5 w-5 place-items-center rounded-full transition-colors sm:h-6 sm:w-6 ${isDark ? 'text-amber-300' : 'theme-switch-active-text'}`}>
      <Sun size={14} fill="currentColor" strokeWidth={2.4} />
    </span>
    <span className={`theme-switch-slot relative z-10 grid h-5 w-5 place-items-center rounded-full transition-colors sm:h-6 sm:w-6 ${isDark ? 'theme-switch-active-text' : 'text-sky-500'}`}>
      <Moon size={14} fill="currentColor" strokeWidth={2.4} />
    </span>
  </button>
);

const Navbar = ({
  repositoryUrl,
  onRepositoryUrlChange,
  onAnalyze,
  isLoading,
  currentView,
  onNavigate,
  hasAnalysis,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <ThemeSwitch isDark={isDark} onToggle={toggleTheme} className="relative lg:hidden" />
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
        <form
          className={`grid flex-1 grid-cols-[minmax(0,1fr)_94px] gap-2 overflow-hidden transition-all duration-200 lg:ml-6 lg:flex lg:flex-row lg:gap-3 lg:overflow-visible lg:opacity-100 ${
            isScrolled ? 'max-h-0 opacity-0 lg:max-h-none' : 'max-h-24 opacity-100 lg:max-h-none'
          }`}
          onSubmit={onAnalyze}
        >
          <div className="relative col-span-2 flex-1 sm:col-span-1">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              value={repositoryUrl}
              onChange={(event) => onRepositoryUrlChange(event.target.value)}
              placeholder="https://github.com/facebook/react"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-10 pr-3 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-brand focus:shadow-[0_0_0_4px_rgba(192,132,252,0.14)] sm:h-11 sm:rounded-xl sm:pr-4"
            />
          </div>

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

      <ThemeSwitch isDark={isDark} onToggle={toggleTheme} className="relative hidden lg:ml-auto lg:inline-flex" />
    </div>
  </header>
  );
};

export default Navbar;
