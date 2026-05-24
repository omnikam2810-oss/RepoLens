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

const looksLikeTechLabel = (value) => {
  const label = String(value || '').trim();
  const normalized = normalizeTechLabel(label);

  if (!normalized) return false;
  if (/[,:;()]/.test(label)) return false;
  if (normalized.split(' ').length > 4) return false;
  return true;
};

export const sanitizeTechStack = (techStack = []) => {
  const seen = new Set();

  return techStack.filter((tech) => {
    const normalized = normalizeTechLabel(tech);
    if (!looksLikeTechLabel(tech) || packageOnlyLabels.has(normalized) || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};
