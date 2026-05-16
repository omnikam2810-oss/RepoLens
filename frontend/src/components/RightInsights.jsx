import { Activity, Boxes, GitFork, ListTree, Star } from 'lucide-react';
import { sanitizeTechStack } from '../utils/techStack';

const RightInsights = ({ result, onNavigateStructure }) => {
  const repository = result?.repository;
  const analysis = result?.analysis;
  const techStack = sanitizeTechStack(analysis?.techStack?.length ? analysis.techStack : result?.techStack || []);

  return (
    <div className="h-full space-y-4 overflow-auto scrollbar-thin sm:space-y-5">
      <div className="surface-card card-glow rounded-xl p-4 sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-ink">Repository Stats</p>
          <Activity size={17} className="text-brand" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4">
          <div className="rounded-lg border border-line bg-slate-50/80 p-2.5 text-center sm:rounded-xl sm:p-3">
            <Star className="mx-auto text-amber" size={17} />
            <p className="mt-1 text-sm font-extrabold">{repository?.stars ?? '-'}</p>
            <p className="text-[11px] text-slate-500">Stars</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50/80 p-2.5 text-center sm:rounded-xl sm:p-3">
            <GitFork className="mx-auto text-brand" size={17} />
            <p className="mt-1 text-sm font-extrabold">{repository?.forks ?? '-'}</p>
            <p className="text-[11px] text-slate-500">Forks</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50/80 p-2.5 text-center sm:rounded-xl sm:p-3">
            <Boxes className="mx-auto text-emerald" size={17} />
            <p className="mt-1 text-sm font-extrabold">{result?.tree?.length ?? '-'}</p>
            <p className="text-[11px] text-slate-500">Files</p>
          </div>
        </div>
      </div>

      <div className="surface-card card-glow rounded-xl p-4 sm:rounded-2xl sm:p-5">
        <p className="text-sm font-extrabold text-ink">Tech Stack</p>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-brand">
              {tech}
            </span>
          ))}
          {!result && <span className="text-sm text-slate-400">No analysis yet.</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={onNavigateStructure}
        disabled={!result}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-white p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_22px_52px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:border-line sm:rounded-2xl sm:p-5"
      >
        <span>
          <span className="block text-sm font-extrabold text-ink">Project Structure</span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">Click here to open repository tree views</span>
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-violet-50 text-brand">
          <ListTree size={19} />
        </span>
      </button>
    </div>
  );
};

export default RightInsights;
