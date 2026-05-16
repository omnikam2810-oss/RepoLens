import { detectTechnologies } from '../analyzers/techDetector.js';
import { buildAnalysisPrompt } from '../prompts/analysisPrompt.js';
import { ANALYSIS_CACHE_TTL_MS, MAX_FAST_IMPORTANT_FILES, MAX_IMPORTANT_FILES } from '../constants/repository.constants.js';
import { sanitizeTechStack } from '../utils/techStack.js';
import { fetchRepositorySnapshot } from './github.service.js';
import { generateRepositoryAnalysis } from './geminiService.js';

const analysisCache = new Map();
const ANALYSIS_CACHE_VERSION = 'tech-stack-v2';

const getCacheKey = ({ owner, repo, mode }) =>
  `${ANALYSIS_CACHE_VERSION}:${owner.toLowerCase()}/${repo.toLowerCase()}:${mode || 'standard'}`;

const getCachedAnalysis = (key) => {
  const cached = analysisCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > ANALYSIS_CACHE_TTL_MS) {
    analysisCache.delete(key);
    return null;
  }

  return cached.result;
};

const setCachedAnalysis = (key, result) => {
  analysisCache.set(key, { createdAt: Date.now(), result });
};

const getImportantFileLimit = (mode) => (mode === 'fast' ? MAX_FAST_IMPORTANT_FILES : MAX_IMPORTANT_FILES);

const serializeTree = (tree) => tree.map(({ path, type, size }) => ({ path, type, size }));

export const analyzeRepository = async ({ owner, repo, normalizedUrl, mode = 'fast' }) => {
  const cacheKey = getCacheKey({ owner, repo, mode });
  const cached = getCachedAnalysis(cacheKey);
  if (cached) {
    return {
      ...cached,
      repositoryUrl: normalizedUrl,
      cached: true,
    };
  }

  const snapshot = await fetchRepositorySnapshot({
    owner,
    repo,
    importantFileLimit: getImportantFileLimit(mode),
  });
  const technologyProfile = detectTechnologies({
    files: snapshot.importantFiles,
    tree: snapshot.tree,
  });

  const prompt = buildAnalysisPrompt({
    ...snapshot,
    ...technologyProfile,
    mode,
  });

  const analysis = await generateRepositoryAnalysis(
    {
      repository: snapshot.repository,
      tree: snapshot.tree,
      mode,
      ...technologyProfile,
    },
    prompt,
  );
  const sanitizedAnalysis = {
    ...analysis,
    techStack: sanitizeTechStack(
      Array.isArray(analysis.techStack) && analysis.techStack.length ? analysis.techStack : technologyProfile.techStack,
    ),
  };

  const result = {
    repositoryUrl: normalizedUrl,
    repository: snapshot.repository,
    tree: serializeTree(snapshot.tree),
    importantFiles: snapshot.importantFiles.map((file) => ({
      path: file.path,
      size: file.size,
      preview: file.content.slice(0, 1500),
    })),
    techStack: technologyProfile.techStack,
    dependencyInsights: technologyProfile.dependencyInsights,
    isLargeRepository: snapshot.isTruncated,
    analysis: sanitizedAnalysis,
  };

  setCachedAnalysis(cacheKey, result);
  return result;
};
