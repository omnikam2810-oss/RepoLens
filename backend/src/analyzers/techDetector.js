import { parsePackageJson, parseRequirementsTxt } from '../parsers/dependencyParser.js';
import { sanitizeTechStack } from '../utils/techStack.js';

const dependencySignals = {
  react: 'React',
  vite: 'Vite',
  next: 'Next.js',
  express: 'Express.js',
  mongoose: 'MongoDB/Mongoose',
  tailwindcss: 'Tailwind CSS',
  typescript: 'TypeScript',
  jest: 'Jest',
  vitest: 'Vitest',
  openai: 'OpenAI API',
  '@google/genai': 'Google Gemini API',
  flask: 'Flask',
  django: 'Django',
  fastapi: 'FastAPI',
};

export const detectTechnologies = ({ files, tree }) => {
  const detected = new Set();
  const dependencyInsights = [];

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
  if (paths.some((path) => path.endsWith('.tsx') || path.endsWith('.ts'))) detected.add('TypeScript');
  if (paths.some((path) => path.endsWith('.py'))) detected.add('Python');
  if (paths.some((path) => path.endsWith('.java'))) detected.add('Java');

  return {
    techStack: sanitizeTechStack([...detected]),
    dependencyInsights,
  };
};
