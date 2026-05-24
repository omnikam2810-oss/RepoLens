import { parsePackageJson, parseRequirementsTxt } from '../parsers/dependencyParser.js';
import { sanitizeTechStack } from '../utils/techStack.js';

const dependencySignals = {
  '@angular/core': 'Angular',
  '@apollo/client': 'Apollo GraphQL',
  react: 'React',
  'react-dom': 'React',
  'react-native': 'React Native',
  '@nestjs/core': 'NestJS',
  vite: 'Vite',
  next: 'Next.js',
  'next-auth': 'Next.js',
  express: 'Express.js',
  koa: 'Koa',
  fastify: 'Fastify',
  mongoose: 'MongoDB',
  mongodb: 'MongoDB',
  tailwindcss: 'Tailwind CSS',
  '@tailwindcss/vite': 'Tailwind CSS',
  typescript: 'TypeScript',
  jest: 'Jest',
  vitest: 'Vitest',
  prisma: 'Prisma',
  sequelize: 'Sequelize',
  pg: 'PostgreSQL',
  mysql2: 'MySQL',
  redis: 'Redis',
  ioredis: 'Redis',
  graphql: 'GraphQL',
  firebase: 'Firebase',
  '@supabase/supabase-js': 'Supabase',
  openai: 'OpenAI API',
  '@google/genai': 'Google Gemini API',
  '@google/generative-ai': 'Google Gemini API',
  vue: 'Vue.js',
  '@vitejs/plugin-vue': 'Vue.js',
  svelte: 'Svelte',
  flask: 'Flask',
  django: 'Django',
  fastapi: 'FastAPI',
  sqlalchemy: 'SQLAlchemy',
  psycopg2: 'PostgreSQL',
  pymongo: 'MongoDB',
};

const languageSignals = {
  JavaScript: 'JavaScript',
  TypeScript: 'TypeScript',
  Python: 'Python',
  Java: 'Java',
  Go: 'Go',
  Rust: 'Rust',
  PHP: 'PHP',
  Ruby: 'Ruby',
};

export const detectTechnologies = ({ files, tree, repository }) => {
  const detected = new Set();
  const dependencyInsights = [];

  const primaryLanguage = languageSignals[repository?.language];
  if (primaryLanguage) detected.add(primaryLanguage);

  for (const file of files) {
    const name = file.path.split('/').pop();

    if (name === 'package.json') {
      detected.add('Node.js');
      const parsed = parsePackageJson(file.content);
      if (parsed) {
        const dependencies = [...parsed.dependencies, ...parsed.devDependencies];
        dependencies.forEach((dependency) => {
          const signal = dependencySignals[dependency.toLowerCase()];
          if (signal) detected.add(signal);
        });
        dependencyInsights.push({
          file: file.path,
          packageName: parsed.name,
          scripts: parsed.scripts,
          dependencies: parsed.dependencies.slice(0, 20),
        });
      }
    }

    if (name === 'requirements.txt') {
      detected.add('Python');
      const dependencies = parseRequirementsTxt(file.content);
      dependencies.forEach((dependency) => {
        const signal = dependencySignals[dependency.toLowerCase()];
        if (signal) detected.add(signal);
      });
      dependencyInsights.push({ file: file.path, dependencies: dependencies.slice(0, 20) });
    }

    if (name === 'Dockerfile') detected.add('Docker');
    if (name === 'pom.xml') detected.add('Java/Maven');
  }

  const paths = tree.map((item) => item.path);
  if (paths.some((path) => path.endsWith('package.json'))) detected.add('Node.js');
  if (paths.some((path) => path.endsWith('.tsx') || path.endsWith('.ts'))) detected.add('TypeScript');
  if (paths.some((path) => path.endsWith('.jsx') || path.endsWith('.js'))) detected.add('JavaScript');
  if (paths.some((path) => path.endsWith('.py'))) detected.add('Python');
  if (paths.some((path) => path.endsWith('.java'))) detected.add('Java');
  if (paths.some((path) => /(^|\/)tailwind\.config\.(js|ts|cjs|mjs)$/.test(path))) detected.add('Tailwind CSS');
  if (paths.some((path) => /(^|\/)vite\.config\.(js|ts|mjs)$/.test(path))) detected.add('Vite');
  if (paths.some((path) => /(^|\/)next\.config\.(js|mjs|ts)$/.test(path))) detected.add('Next.js');
  if (paths.some((path) => /(^|\/)docker-compose\.ya?ml$/.test(path))) detected.add('Docker');

  return {
    techStack: sanitizeTechStack([...detected]),
    dependencyInsights,
  };
};
