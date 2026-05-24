import { Activity, ArrowRight, Boxes, FileCode2, Folder, GitFork, GitBranch, Star } from 'lucide-react';
import { buildFloatingTree } from './SidebarTree';
import { sanitizeTechStack } from '../utils/techStack';

const sortTreeNodes = (a, b) => {
  if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
  return a.name.localeCompare(b.name);
};

const flattenPreviewTree = (nodes, depth = 0, rows = []) => {
  nodes.forEach((node) => {
    if (rows.length >= 8) return;
    rows.push({ node, depth });

    if (node.children.size > 0) {
      flattenPreviewTree([...node.children.values()].sort(sortTreeNodes).slice(0, 3), depth + 1, rows);
    }
  });

  return rows;
};

const StructurePreview = ({ tree = [] }) => {
  const rows = flattenPreviewTree(buildFloatingTree(tree, 32).slice(0, 4));

  return (
    <div className="mt-3 rounded-xl border border-line bg-slate-50/80 p-2.5">
      <div className="space-y-1.5">
        {rows.map(({ node, depth }) => {
          const isDirectory = node.type === 'directory';
          const Icon = isDirectory ? Folder : FileCode2;

          return (
            <div key={node.path} className="relative flex min-w-0 items-center gap-2 rounded-lg bg-white/80 px-2 py-1.5 text-xs shadow-sm">
              {depth > 0 && <span className="h-px w-3 shrink-0 bg-slate-300" style={{ marginLeft: `${Math.min((depth - 1) * 12, 24)}px` }} />}
              {!depth && <span className="w-0" />}
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${isDirectory ? 'bg-amber-50 text-amber' : 'bg-violet-50 text-brand'}`}>
                <Icon size={14} />
              </span>
              <span className={`truncate ${isDirectory ? 'font-extrabold text-ink' : 'font-semibold text-slate-600'}`}>{node.name}</span>
            </div>
          );
        })}
        {!rows.length && <p className="px-2 py-3 text-xs font-semibold text-slate-400">Analyze a repository to preview its tree.</p>}
      </div>
    </div>
  );
};

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

      <div className="surface-card card-glow rounded-xl p-4 sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink">Project Structure</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Compact repository tree preview</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-brand">
            <GitBranch size={18} />
          </span>
        </div>

        <StructurePreview tree={result?.tree} />

        <button
          type="button"
          onClick={onNavigateStructure}
          disabled={!result}
          className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-line"
        >
          View more
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RightInsights;
