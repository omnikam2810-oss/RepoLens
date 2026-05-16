import {
  BookOpen,
  Download,
  FileCode2,
  Gauge,
  GitBranch,
  Layers3,
  Lightbulb,
  ListChecks,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { exportReport } from '../utils/exportReport';

const MAX_TREE_NODES = 90;

const createTreeNode = ({ name, path, type }) => ({
  name,
  path,
  type,
  children: new Map(),
});

export const buildFloatingTree = (items = [], maxNodes = MAX_TREE_NODES) => {
  const root = createTreeNode({ name: 'root', path: '', type: 'directory' });

  items.slice(0, maxNodes).forEach((item) => {
    const segments = item.path.split('/').filter(Boolean);
    let currentNode = root;

    segments.forEach((segment, index) => {
      const nodePath = segments.slice(0, index + 1).join('/');
      const isLeaf = index === segments.length - 1;
      const type = isLeaf ? item.type : 'directory';

      if (!currentNode.children.has(segment)) {
        currentNode.children.set(segment, createTreeNode({ name: segment, path: nodePath, type }));
      }

      currentNode = currentNode.children.get(segment);
    });
  });

  return [...root.children.values()].sort(sortTreeNodes);
};

const sortTreeNodes = (a, b) => {
  if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
  return a.name.localeCompare(b.name);
};

const TreeNode = ({ node, depth = 0, spacious = false }) => {
  const children = [...node.children.values()].sort(sortTreeNodes);
  const isDirectory = node.type === 'directory';
  const Icon = isDirectory ? Folder : FileCode2;
  const indent = spacious ? 22 : 18;
  const maxIndent = spacious ? 168 : 72;

  return (
    <div className="relative">
      <div
        className={`group relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white text-xs shadow-[0_8px_22px_rgba(23,32,51,0.06)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_14px_28px_rgba(124,58,237,0.12)] ${
          spacious ? 'px-3.5 py-3' : 'px-2.5 py-2'
        }`}
        style={{ marginLeft: depth ? `${Math.min(depth * indent, maxIndent)}px` : 0 }}
        title={node.path}
      >
        {depth > 0 && <span className="absolute -left-3 top-1/2 h-px w-3 bg-slate-200" />}
        <span
          className={`grid shrink-0 place-items-center rounded-md ${spacious ? 'h-9 w-9' : 'h-7 w-7'} ${
            isDirectory ? 'bg-amber-50 text-amber' : 'bg-violet-50 text-brand'
          }`}
        >
          <Icon size={spacious ? 18 : 15} />
        </span>
        <span className={`min-w-0 flex-1 truncate font-bold text-slate-700 ${spacious ? 'text-sm' : ''}`}>{node.name}</span>
        {isDirectory && children.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-500">
            {children.length}
          </span>
        )}
      </div>

      {children.length > 0 && (
        <div className={`relative ${spacious ? 'mt-3 space-y-3' : 'mt-2 space-y-2'}`}>
          <span
            className="absolute bottom-4 top-0 w-px bg-slate-200"
            style={{ left: `${Math.min(depth * indent + 11, maxIndent + 11)}px` }}
          />
          {children.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} spacious={spacious} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FloatingRepositoryTree = ({ tree = [], maxNodes = MAX_TREE_NODES, spacious = false }) => {
  const floatingTree = buildFloatingTree(tree, maxNodes);

  return (
    <div className={`rounded-lg border border-slate-100 bg-slate-50/80 ${spacious ? 'p-3 sm:p-4' : 'p-2'}`}>
      <div className={spacious ? 'space-y-3' : 'space-y-2'}>
        {floatingTree.map((node) => (
          <TreeNode key={node.path} node={node} spacious={spacious} />
        ))}
        {!floatingTree.length && <p className="px-2 py-3 text-xs text-slate-400">No repository loaded yet.</p>}
      </div>
    </div>
  );
};

const reportSections = [
  { id: 'project-summary', label: 'Project Summary', icon: BookOpen },
  { id: 'architecture-overview', label: 'Architecture Overview', icon: Layers3 },
  { id: 'setup-instructions', label: 'Setup Instructions', icon: Rocket },
  { id: 'feature-breakdown', label: 'Feature Breakdown', icon: ListChecks },
  { id: 'folder-explanation', label: 'Folder Explanation', icon: GitBranch },
  { id: 'important-files', label: 'Important Files', icon: FileCode2 },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'security-suggestions', label: 'Security Suggestions', icon: ShieldCheck },
  { id: 'quality-score', label: 'Quality Score', icon: Gauge },
  { id: 'beginner-mode', label: 'Beginner Mode', icon: Lightbulb },
];

const scrollToSection = (sectionId) => {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const SidebarTree = ({ tree = [], importantFiles = [], result }) => {
  return (
    <div className="surface-card card-glow h-full overflow-hidden rounded-xl sm:rounded-2xl">
      <div className="border-b border-line bg-white/80 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-white shadow-sm">
              <GitBranch size={17} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink">Report Sections</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Jump through the analysis</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportReport(result)}
            disabled={!result}
            aria-label="Export report as text"
            title="Export report as text"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-xs font-extrabold text-slate-600 transition hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
      <div className="scrollbar-thin max-h-[calc(100%-68px)] overflow-auto p-2.5 sm:max-h-[calc(100%-73px)] sm:p-3">
        <div>
          <div className="space-y-2">
            {reportSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  disabled={!result}
                  className="flex w-full items-center gap-2 rounded-lg border border-line bg-slate-50/80 px-3 py-2.5 text-left text-xs font-extrabold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:text-brand disabled:cursor-not-allowed disabled:opacity-45 sm:rounded-xl sm:py-3"
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
            {!result && (
              <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-400">
                Analyze a repository to enable report navigation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTree;
