import { analyzeRepository } from '../services/analysis.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseGitHubUrl } from '../utils/repositoryUrl.js';

export const analyzeRepositoryController = asyncHandler(async (req, res) => {
  const { repositoryUrl, mode } = req.body;
  const parsed = parseGitHubUrl(repositoryUrl);
  const result = await analyzeRepository({ ...parsed, mode });

  res.status(200).json({
    success: true,
    data: result,
  });
});
