const packageOnlyLabels = new Set([
  'axios',
  'bcrypt',
  'body parser',
  'chalk',
  'commander',
  'concurrently',
  'cookie parser',
  'cross origin resource sharing',
  'cors',
  'date fns',
  'dotenv',
  'eslint',
  'express middleware',
  'framer motion',
  'helmet',
  'json web token',
  'jsonwebtoken',
  'lodash',
  'lucide react',
  'moment',
  'morgan',
  'nodemon',
  'prettier',
  'uuid',
  'zod',
]);

const normalizeTechLabel = (value) =>
  String(value || '')
    .trim()
    .replace(/\.js$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

export const sanitizeTechStack = (techStack = []) => {
  const seen = new Set();

  return techStack.filter((tech) => {
    const normalized = normalizeTechLabel(tech);
    if (!normalized || packageOnlyLabels.has(normalized) || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};
