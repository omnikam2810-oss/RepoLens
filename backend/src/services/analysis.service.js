import { detectTechnologies } from '../analyzers/techDetector.js';
import { buildAnalysisPrompt } from '../prompts/analysisPrompt.js';
import { fetchRepositorySnapshot } from './github.service.js';
import { generateRepositoryAnalysis } from './geminiService.js';

export const analyzeRepository = async ({ owner, repo, normalizedUrl, mode = 'standard' }) => {
  const snapshot = await fetchRepositorySnapshot({ owner, repo });
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
      ...technologyProfile,
    },
    prompt,
  );

  return {
    repositoryUrl: normalizedUrl,
    repository: snapshot.repository,
    tree: snapshot.tree,
    importantFiles: snapshot.importantFiles.map((file) => ({
      path: file.path,
      size: file.size,
      preview: file.content.slice(0, 1500),
    })),
    techStack: technologyProfile.techStack,
    dependencyInsights: technologyProfile.dependencyInsights,
    isLargeRepository: snapshot.isTruncated,
    analysis,
  };
};
