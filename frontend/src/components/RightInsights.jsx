import { Activity, Boxes, FileCode2, Folder, GitBranch, GitFork, Star } from 'lucide-react';
import { buildFloatingTree } from './SidebarTree';
import { sanitizeTechStack } from '../utils/techStack';

const sortTreeNodes = (a, b) => {
  if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
  return a.name.localeCompare(b.name);
};

const createPreviewNodes = (tree = [], repositoryName = 'root') => {
  const roots = buildFloatingTree(tree, 32).slice(0, 3);
  const root = {
    id: 'root',
    name: repositoryName || 'root',
    type: 'root',
    x: 64,
    y: 14,
    width: 150,
    height: 50,
  };
  const childPositions = [
    { x: 16, y: 108 },
    { x: 126, y: 108 },
    { x: 72, y: 174 },
  ];

  return {
    root,
    children: roots.map((node, index) => ({
      id: node.path,
      name: node.name,
      type: node.type,
      count: node.children.size,
      ...childPositions[index],
      width: index === 2 ? 136 : 132,
      height: 50,
    })),
  };
};

const MiniMapCard = ({ node, compact = false }) => {
  const isDirectory = node.type === 'directory';
  const Icon = node.type === 'root' ? GitBranch : isDirectory ? Folder : FileCode2;

  return (
    <div
      className={`absolute flex items-center gap-2 rounded-lg border bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.14)] ${
        node.type === 'root' ? 'border-violet-300 px-3 py-2' : isDirectory ? 'border-amber-200 px-2.5 py-2' : 'border-violet-200 px-2.5 py-2'
      }`}
      style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
    >
      <span className={`grid shrink-0 place-items-center rounded-md bg-white ${compact ? 'h-7 w-7' : 'h-8 w-8'}`}>
        <Icon size={compact ? 15 : 16} className={node.type === 'root' ? 'text-brand' : isDirectory ? 'text-amber' : 'text-slate-500'} />
      </span>
      <span className="min-w-0">
        <span className={`block truncate font-extrabold text-ink ${compact ? 'text-[11px]' : 'text-xs'}`}>{node.name}</span>
        {isDirectory && <span className="block truncate text-[10px] font-bold text-slate-500">{node.count} children</span>}
        {node.type === 'root' && <span className="block text-[10px] font-bold text-slate-500">entry point</span>}
      </span>
    </div>
  );
};

const StructurePreview = ({ tree = [], repositoryName, disabled = false, onClick }) => {
  const preview = createPreviewNodes(tree, repositoryName);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Open project structure"
      title="Open project structure"
      className="surface-card card-glow block w-full overflow-hidden rounded-xl p-0 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_22px_52px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:border-line sm:rounded-2xl"
    >
      <div className="relative h-60 bg-[#eee6ff] bg-[linear-gradient(rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.12)_1px,transparent_1px)] bg-[size:24px_24px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 240" aria-hidden="true">
          {preview.children.map((child, index) => {
            const startX = preview.root.x + preview.root.width / 2;
            const startY = preview.root.y + preview.root.height;
            const endX = child.x + child.width / 2;
            const endY = child.y;
            const midY = startY + (endY - startY) * 0.55;
            const color = index === 0 ? '#9b7cff' : index === 1 ? '#d97706' : '#64748b';

            return (
              <path
                key={child.id}
                d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth="1.6"
                opacity="0.58"
              />
            );
          })}
        </svg>
        <MiniMapCard node={preview.root} />
        {preview.children.map((node, index) => (
          <MiniMapCard key={node.id} node={node} compact={index !== 0} />
        ))}
        {!preview.children.length && (
          <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-lg bg-white/85 p-3 text-center text-xs font-semibold text-slate-400">
            Analyze a repository to preview its tree.
          </p>
        )}
      </div>
    </button>
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

      <StructurePreview tree={result?.tree} repositoryName={repository?.name} disabled={!result} onClick={onNavigateStructure} />
    </div>
  );
};

export default RightInsights;
