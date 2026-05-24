import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Boxes,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  GitBranch,
  Network,
} from 'lucide-react';
import { buildFloatingTree } from '../components/SidebarTree';

const countByType = (tree = [], type) => tree.filter((item) => item.type === type).length;
const sortedChildren = (node) => [...node.children.values()].sort((a, b) => {
  if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
  return a.name.localeCompare(b.name);
});

const structureModes = [
  { id: 'map', label: 'Tree Map', icon: Network },
  { id: 'explorer', label: 'Clickable Explorer', icon: Folder },
  { id: 'important', label: 'Important Files', icon: FileCode2 },
];

const getFileTone = (name) => {
  if (name.endsWith('.json')) return 'text-amber';
  if (name.endsWith('.md')) return 'text-emerald';
  if (name.endsWith('.css')) return 'text-pink-500';
  if (name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.ts') || name.endsWith('.tsx')) return 'text-brand';
  return 'text-slate-500';
};

const createMapLayout = (tree) => {
  const roots = buildFloatingTree(tree, 180).slice(0, 12);
  const canvasWidth = 1180;
  const root = { id: 'root', label: 'Repository Root', x: 490, y: 34, width: 200, height: 64, type: 'root' };
  const groupNodes = [];
  const childNodes = [];
  const links = [];

  roots.forEach((node, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 70 + column * 275;
    const y = 190 + row * 250;
    const groupId = `group-${node.path}`;

    groupNodes.push({
      id: groupId,
      label: node.name,
      path: node.path,
      x,
      y,
      width: 190,
      height: 70,
      type: node.type,
      count: node.children.size,
    });
    links.push({ from: root, to: { x: x + 95, y, width: 0, height: 0 }, label: node.type === 'directory' ? 'contains' : 'file' });

    sortedChildren(node)
      .slice(0, 4)
      .forEach((child, childIndex) => {
        const childX = x + (childIndex % 2) * 112;
        const childY = y + 112 + Math.floor(childIndex / 2) * 86;
        const childId = `child-${child.path}`;

        childNodes.push({
          id: childId,
          label: child.name,
          path: child.path,
          x: childX,
          y: childY,
          width: 94,
          height: 56,
          type: child.type,
        });
        links.push({
          from: { x: x + 95, y: y + 70, width: 0, height: 0 },
          to: { x: childX + 47, y: childY, width: 0, height: 0 },
          label: child.type === 'directory' ? 'opens' : 'uses',
        });
      });
  });

  const rowCount = Math.max(1, Math.ceil(roots.length / 4));
  const canvasHeight = Math.max(620, 240 + rowCount * 250);

  return { root, groupNodes, childNodes, links, canvasWidth, canvasHeight };
};

const Connector = ({ link, index }) => {
  const startX = link.from.x + (link.from.width ? link.from.width / 2 : 0);
  const startY = link.from.y + (link.from.height || 0);
  const endX = link.to.x + (link.to.width ? link.to.width / 2 : 0);
  const endY = link.to.y;
  const midY = startY + Math.max(34, (endY - startY) * 0.42);
  const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke={index % 3 === 0 ? '#64748b' : index % 3 === 1 ? '#8b5cf6' : '#d97706'}
        strokeDasharray={index % 2 === 0 ? '0' : '5 5'}
        strokeLinecap="round"
        strokeWidth="1.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ duration: 0.75, delay: index * 0.035 }}
      />
      {link.label && (
        <text x={(startX + endX) / 2 + 8} y={midY - 5} className="fill-slate-500 text-[10px] font-bold">
          {link.label}
        </text>
      )}
    </g>
  );
};

const MapCard = ({ node, index, compact = false }) => {
  const isDirectory = node.type === 'directory';
  const Icon = node.type === 'root' ? GitBranch : isDirectory ? Folder : FileCode2;
  const colorClass = node.type === 'root' ? 'border-violet-300 bg-white' : isDirectory ? 'border-amber-300 bg-amber-50/80' : 'border-violet-300 bg-violet-50/80';

  return (
    <motion.div
      className={`absolute rounded-lg border ${colorClass} p-3 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur`}
      style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.03, zIndex: 10 }}
      transition={{ duration: 0.35, delay: index * 0.035 }}
      title={node.path || node.label}
    >
      <div className="flex items-center gap-2">
        <span className={`grid shrink-0 place-items-center rounded-md bg-white ${compact ? 'h-7 w-7' : 'h-9 w-9'}`}>
          <Icon size={compact ? 15 : 18} className={node.type === 'root' ? 'text-brand' : isDirectory ? 'text-amber' : getFileTone(node.label)} />
        </span>
        <div className="min-w-0">
          <p className={`truncate font-extrabold text-ink ${compact ? 'text-[11px]' : 'text-sm'}`}>{node.label}</p>
          {!compact && (
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
              {node.type === 'root' ? 'entry point' : isDirectory ? `${node.count || 0} children` : 'file'}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TreeMapView = ({ tree, repositoryName }) => {
  const layout = useMemo(() => createMapLayout(tree), [tree]);

  return (
    <div className="overflow-auto rounded-xl border border-line bg-[#eee6ff] p-3 shadow-inner sm:rounded-2xl sm:p-5">
      <div
        className="relative mx-auto overflow-hidden rounded-lg border border-white/80 bg-white/45 shadow-inner"
        style={{ width: `${layout.canvasWidth}px`, height: `${layout.canvasHeight}px` }}
      >
        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute left-8 top-8 rounded-lg border border-white/80 bg-white/70 px-3 py-2 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-normal text-slate-500">Architecture Map</p>
          <p className="text-sm font-extrabold text-ink">{repositoryName || 'project'}</p>
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${layout.canvasWidth} ${layout.canvasHeight}`}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#64748b" opacity="0.65" />
            </marker>
          </defs>
          {layout.links.map((link, index) => (
            <Connector key={`${link.label}-${index}`} link={link} index={index} />
          ))}
        </svg>
        <MapCard node={{ ...layout.root, label: repositoryName || 'Repository Root' }} index={0} />
        {layout.groupNodes.map((node, index) => (
          <MapCard key={node.id} node={node} index={index + 1} />
        ))}
        {layout.childNodes.map((node, index) => (
          <MapCard key={node.id} node={node} index={index + 8} compact />
        ))}
        {!layout.groupNodes.length && (
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-lg bg-white p-5 text-sm text-slate-400">
            Analyze a repository to see its tree map.
          </p>
        )}
      </div>
    </div>
  );
};

const ExplorerNode = ({ node, expandedPaths, onToggle, depth = 0 }) => {
  const children = sortedChildren(node);
  const isDirectory = node.type === 'directory';
  const isExpanded = expandedPaths.has(node.path);
  const Icon = isDirectory ? Folder : FileCode2;

  return (
    <div>
      <button
        type="button"
        onClick={() => isDirectory && onToggle(node.path)}
        className="grid w-full grid-cols-[28px_28px_minmax(0,1fr)] items-center border-b border-slate-100 px-4 py-3 text-left transition hover:bg-violet-50"
        style={{ paddingLeft: `${16 + depth * 28}px` }}
      >
        <span className="text-slate-500">
          {isDirectory ? isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} /> : null}
        </span>
        <Icon size={19} className={isDirectory ? 'text-amber' : getFileTone(node.name)} />
        <span className={`truncate text-sm ${isDirectory ? 'font-extrabold text-ink' : 'font-semibold text-slate-600'}`}>
          {node.name}
        </span>
      </button>
      {isDirectory && isExpanded && children.map((child) => (
        <ExplorerNode key={child.path} node={child} expandedPaths={expandedPaths} onToggle={onToggle} depth={depth + 1} />
      ))}
    </div>
  );
};

const ClickableExplorerView = ({ tree, repositoryName }) => {
  const roots = useMemo(() => buildFloatingTree(tree, 260), [tree]);
  const [expandedPaths, setExpandedPaths] = useState(() => new Set(roots.slice(0, 4).map((node) => node.path)));

  const handleToggle = (path) => {
    setExpandedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className="surface-card overflow-hidden rounded-xl sm:rounded-2xl">
      <div className="flex items-center gap-2 border-b border-line bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
        <ChevronDown size={17} className="text-slate-500" />
        <Folder size={22} className="text-amber" />
        <p className="truncate font-mono text-base font-extrabold text-ink sm:text-lg">{repositoryName || 'repository'}</p>
      </div>
      <div className="max-h-[760px] overflow-auto font-mono">
        {roots.map((node) => (
          <ExplorerNode key={node.path} node={node} expandedPaths={expandedPaths} onToggle={handleToggle} />
        ))}
        {!roots.length && <p className="p-5 text-sm text-slate-400">Analyze a repository to explore folders.</p>}
      </div>
    </div>
  );
};

const ImportantFilesView = ({ importantFiles }) => (
  <div className="surface-card overflow-hidden rounded-xl sm:rounded-2xl">
    <div className="border-b border-line bg-slate-50 px-4 py-3">
      <p className="text-sm font-extrabold text-ink">Important Files</p>
      <p className="mt-1 text-xs font-medium text-slate-500">Key files selected for AI repository analysis.</p>
    </div>
    <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-2 xl:grid-cols-3">
      {importantFiles.map((file) => (
        <div key={file.path} className="rounded-lg border border-line bg-slate-50/80 p-3 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-sm sm:rounded-xl sm:p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-brand">
              <FileCode2 size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink">{file.path}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">{file.size || 0} bytes</p>
            </div>
          </div>
          {file.preview && (
            <pre className="mt-3 max-h-36 overflow-auto rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600 scrollbar-thin">
              {file.preview}
            </pre>
          )}
        </div>
      ))}
      {!importantFiles.length && <p className="text-sm text-slate-400">Analyze a repository to see important files.</p>}
    </div>
  </div>
);

const ProjectStructurePage = ({ result, onBack }) => {
  const [activeMode, setActiveMode] = useState('map');
  const repository = result?.repository;
  const tree = result?.tree || [];
  const importantFiles = result?.importantFiles || [];
  const directoryCount = countByType(tree, 'directory');
  const fileCount = countByType(tree, 'file');

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="surface-card card-glow overflow-hidden rounded-xl sm:rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-line p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-white sm:h-12 sm:w-12">
              <GitBranch size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500 sm:text-sm">Project Structure</p>
              <h1 className="mt-1 break-words text-xl font-extrabold tracking-normal text-ink sm:text-2xl md:text-3xl">
                {repository?.fullName || 'Repository tree'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A focused floating map of the repository hierarchy, grouped into folders and files for faster scanning.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-fit items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-extrabold text-ink transition hover:border-brand hover:text-brand sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 sm:gap-3 sm:p-6">
          <div className="rounded-lg border border-line bg-slate-50/80 p-3 shadow-inner sm:rounded-2xl sm:p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Boxes size={17} className="text-brand" />
              <span className="hidden sm:inline">Indexed Paths</span>
              <span className="sm:hidden">Paths</span>
            </div>
            <p className="mt-2 text-xl font-extrabold text-ink sm:text-2xl">{tree.length}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50/80 p-3 shadow-inner sm:rounded-2xl sm:p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Folder size={17} className="text-amber" />
              Folders
            </div>
            <p className="mt-2 text-xl font-extrabold text-ink sm:text-2xl">{directoryCount}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50/80 p-3 shadow-inner sm:rounded-2xl sm:p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <FileCode2 size={17} className="text-emerald" />
              Files
            </div>
            <p className="mt-2 text-xl font-extrabold text-ink sm:text-2xl">{fileCount}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="surface-card card-glow rounded-xl p-4 sm:rounded-2xl sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-ink">Floating Repository Tree</p>
            {tree.length > 220 && (
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-brand">Top 220 paths</span>
            )}
          </div>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:mb-5 sm:grid-cols-3">
            {structureModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-extrabold transition hover:-translate-y-0.5 sm:h-11 sm:gap-2 sm:rounded-xl sm:px-3 sm:text-sm ${
                    activeMode === mode.id
                      ? 'border-brand bg-violet-50 text-brand'
                      : 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
                  }`}
                >
                  <Icon size={17} />
                  {mode.label}
                </button>
              );
            })}
          </div>

          {activeMode === 'map' && <TreeMapView tree={tree} repositoryName={repository?.name} />}
          {activeMode === 'explorer' && <ClickableExplorerView tree={tree} repositoryName={repository?.name} />}
          {activeMode === 'important' && <ImportantFilesView importantFiles={importantFiles} />}
        </div>
      </section>
    </div>
  );
};

export default ProjectStructurePage;
