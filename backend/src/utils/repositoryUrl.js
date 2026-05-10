import { AppError } from './appError.js';

export const parseGitHubUrl = (repositoryUrl) => {
  if (!repositoryUrl || typeof repositoryUrl !== 'string') {
    throw new AppError('A GitHub repository URL is required.', 400);
  }

  const trimmedUrl = repositoryUrl.trim().replace(/\.git$/, '');

  try {
    const url = new URL(trimmedUrl);
    if (url.hostname !== 'github.com') {
      throw new Error('Invalid host');
    }

    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    if (!owner || !repo) {
      throw new Error('Missing owner or repository name');
    }

    return { owner, repo, normalizedUrl: `https://github.com/${owner}/${repo}` };
  } catch {
    throw new AppError('Please provide a valid public GitHub repository URL.', 400);
  }
};
