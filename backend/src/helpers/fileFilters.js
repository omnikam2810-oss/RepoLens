import {
  IGNORED_DIRECTORIES,
  IMPORTANT_DIRECTORIES,
  IMPORTANT_FILE_NAMES,
} from '../constants/repository.constants.js';

export const isIgnoredPath = (path) => {
  const segments = path.split('/');
  return segments.some((segment) => IGNORED_DIRECTORIES.has(segment));
};

export const isImportantPath = (path) => {
  const filename = path.split('/').pop();
  return (
    IMPORTANT_FILE_NAMES.has(filename) ||
    IMPORTANT_DIRECTORIES.some((directory) => path.startsWith(directory) || path.includes(`/${directory}`))
  );
};

export const sortImportantFiles = (files) => {
  return [...files].sort((a, b) => {
    const aName = a.path.split('/').pop();
    const bName = b.path.split('/').pop();
    const aRootImportant = IMPORTANT_FILE_NAMES.has(aName) ? 0 : 1;
    const bRootImportant = IMPORTANT_FILE_NAMES.has(bName) ? 0 : 1;
    return aRootImportant - bRootImportant || a.path.localeCompare(b.path);
  });
};
