export const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.github',
  '.next',
  '.nuxt',
  '.turbo',
  '.vercel',
  'coverage',
  'dist',
  'build',
  'node_modules',
  'vendor',
  'target',
  'out',
  '__pycache__',
]);

export const IMPORTANT_FILE_NAMES = new Set([
  'README.md',
  'readme.md',
  'package.json',
  'requirements.txt',
  'pyproject.toml',
  'Pipfile',
  'pom.xml',
  'build.gradle',
  'Dockerfile',
  'docker-compose.yml',
  'tsconfig.json',
  'vite.config.js',
  'next.config.js',
  'tailwind.config.js',
  'main.js',
  'main.jsx',
  'main.ts',
  'main.tsx',
  'index.js',
  'index.jsx',
  'index.ts',
  'index.tsx',
  'server.js',
  'app.js',
]);

export const IMPORTANT_DIRECTORIES = [
  'src/',
  'app/',
  'pages/',
  'routes/',
  'controllers/',
  'models/',
  'config/',
  'services/',
  'components/',
  'lib/',
  'api/',
];

export const MAX_TREE_ITEMS = 240;
export const MAX_IMPORTANT_FILES = 18;
export const MAX_FILE_CHARS = 8000;
