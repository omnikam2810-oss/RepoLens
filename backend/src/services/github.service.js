import { env } from '../config/env.js';
import {
  MAX_FILE_CHARS,
  MAX_IMPORTANT_FILES,
  MAX_TREE_ITEMS,
} from '../constants/repository.constants.js';
import { isIgnoredPath, isImportantPath, sortImportantFiles } from '../helpers/fileFilters.js';
import { AppError } from '../utils/appError.js';

const parseGitHubError = async (response) => {
  try {
    const data = await response.json();
    return data.message || JSON.stringify(data);
  } catch {
    return response.text();
  }
};

const getGitHubErrorMessage = (response, githubMessage) => {
  if (response.status === 401) {
    return 'GitHub authentication failed. Check the backend GITHUB_TOKEN value or leave it empty for public-only access.';
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining === '0' || githubMessage.toLowerCase().includes('rate limit')) {
      return 'GitHub API rate limit exceeded. Add a valid GITHUB_TOKEN in backend/.env or wait for the rate limit to reset.';
    }
    return 'GitHub refused this request. Check repository access permissions or your GitHub token scope.';
  }

  if (response.status === 404) {
    return 'Repository not found, private, renamed, or unavailable. Use a valid public GitHub repository URL.';
  }

  if (response.status === 409) {
    return 'GitHub could not provide repository contents. The repository may be empty or unavailable.';
  }

  if (response.status === 422) {
    return 'GitHub could not process this repository request. Check the repository URL and default branch.';
  }

  return 'GitHub API request failed. Please try again later.';
};

const githubRequest = async (path) => {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'RepoLens',
      ...(env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : {}),
    },
  });

  if (!response.ok) {
    const githubMessage = await parseGitHubError(response);
    throw new AppError(getGitHubErrorMessage(response, githubMessage), response.status, githubMessage);
  }

  return response.json();
};

const decodeBase64 = (value) => Buffer.from(value || '', 'base64').toString('utf8');

const fetchFileContent = async ({ owner, repo, path }) => {
  const data = await githubRequest(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`);
  if (!data.content) return '';
  return decodeBase64(data.content).slice(0, MAX_FILE_CHARS);
};

export const fetchRepositorySnapshot = async ({ owner, repo }) => {
  const repository = await githubRequest(`/repos/${owner}/${repo}`);
  const branch = repository.default_branch;
  const treeResponse = await githubRequest(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);

  const filteredTree = (treeResponse.tree || [])
    .filter((item) => item.path && !isIgnoredPath(item.path))
    .slice(0, MAX_TREE_ITEMS)
    .map((item) => ({
      path: item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      size: item.size || 0,
    }));

  const importantCandidates = sortImportantFiles(
    filteredTree.filter((item) => item.type === 'file' && isImportantPath(item.path)),
  ).slice(0, MAX_IMPORTANT_FILES);

  const importantFiles = [];
  for (const file of importantCandidates) {
    try {
      const content = await fetchFileContent({ owner, repo, path: file.path });
      importantFiles.push({ path: file.path, size: file.size, content });
    } catch {
      importantFiles.push({ path: file.path, size: file.size, content: '' });
    }
  }

  return {
    repository: {
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      url: repository.html_url,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      openIssues: repository.open_issues_count,
      language: repository.language,
      defaultBranch: repository.default_branch,
      license: repository.license?.name || 'Not specified',
      updatedAt: repository.updated_at,
    },
    tree: filteredTree,
    importantFiles,
    isTruncated: Boolean(treeResponse.truncated),
  };
};
