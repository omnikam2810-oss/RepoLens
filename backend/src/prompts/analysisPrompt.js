export const buildAnalysisPrompt = ({ repository, tree, importantFiles, techStack, dependencyInsights, mode }) => {
  const compactFiles = importantFiles.map((file) => ({
    path: file.path,
    excerpt: file.content.slice(0, 3000),
  }));

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
          'Explain what this repository does and provide enterprise-grade repository intelligence. Return only valid JSON matching the requested schema.',
        responseSchema: {
          projectSummary: 'string',
          projectPurpose: 'string',
          projectType: 'string',
          techStack: ['string'],
          features: ['string'],
          folderExplanation: [{ path: 'string', explanation: 'string' }],
          importantFiles: [{ path: 'string', explanation: 'string' }],
          setupInstructions: ['string'],
          architectureOverview: 'string',
          beginnerExplanation: 'string',
          recruiterExplanation: 'string',
          suggestions: ['string'],
          securitySuggestions: ['string'],
          dependencyInsights: ['string'],
          codeQualityScore: { score: 'number from 0 to 100', rationale: 'string' },
        },
        analysisMode: mode,
        repository,
        detectedTechStack: techStack,
        dependencyInsights,
        tree,
        importantFiles: compactFiles,
      }),
    },
  ];
};
