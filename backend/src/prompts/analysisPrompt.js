import {
  MAX_FAST_PROMPT_FILE_CHARS,
  MAX_FAST_PROMPT_TREE_ITEMS,
  MAX_PROMPT_FILE_CHARS,
  MAX_PROMPT_TREE_ITEMS,
} from '../constants/repository.constants.js';

const rankTreeItem = (item) => {
  if (item.type === 'directory') return 0;
  if (/readme|package\.json|requirements\.txt|pyproject\.toml|dockerfile/i.test(item.path)) return 1;
  if (/\.(js|jsx|ts|tsx|py|java|go|rs|php|rb)$/i.test(item.path)) return 2;
  return 3;
};

export const buildAnalysisPrompt = ({ repository, tree, importantFiles, techStack, dependencyInsights, mode }) => {
  const isFastMode = mode === 'fast';
  const maxFileChars = isFastMode ? MAX_FAST_PROMPT_FILE_CHARS : MAX_PROMPT_FILE_CHARS;
  const maxTreeItems = isFastMode ? MAX_FAST_PROMPT_TREE_ITEMS : MAX_PROMPT_TREE_ITEMS;
  const compactFiles = importantFiles.map((file) => ({
    path: file.path,
    excerpt: file.content.slice(0, maxFileChars),
  }));

  const compactTree = [...tree]
    .sort((a, b) => rankTreeItem(a) - rankTreeItem(b) || a.path.localeCompare(b.path))
    .slice(0, maxTreeItems)
    .map(({ path, type, size }) => ({ path, type, size }));

  return [
    {
      role: 'system',
      content:
        'You are RepoLens, an expert software architect and technical educator. Analyze GitHub repositories and return accurate, concise, structured JSON only.',
    },
    {
      role: 'user',
      content: JSON.stringify({
        instruction:
          'Explain what this repository does. Return concise valid JSON matching the schema. In techStack, include only primary languages, runtimes, frameworks, databases, build tools, cloud platforms, and major AI/API platforms. Do not include utility packages such as Helmet, CORS, Morgan, dotenv, Axios, ESLint, Prettier, Nodemon, UUID, or Zod. Keep arrays short: features 5 max, folderExplanation 6 max, importantFiles 6 max, setupInstructions 5 max, suggestions 5 max, securitySuggestions 4 max, dependencyInsights 5 max.',
        analysisMode: mode,
        repository,
        detectedTechStack: techStack,
        dependencyInsights,
        tree: compactTree,
        treeNote:
          tree.length > compactTree.length
            ? `Prompt includes ${compactTree.length} high-signal tree items out of ${tree.length} fetched items.`
            : undefined,
        importantFiles: compactFiles,
      }),
    },
  ];
};
