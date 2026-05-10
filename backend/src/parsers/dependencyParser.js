export const parsePackageJson = (content) => {
  try {
    const parsed = JSON.parse(content);
    return {
      name: parsed.name,
      scripts: parsed.scripts || {},
      dependencies: Object.keys(parsed.dependencies || {}),
      devDependencies: Object.keys(parsed.devDependencies || {}),
    };
  } catch {
    return null;
  }
};

export const parseRequirementsTxt = (content) => {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/[=<>~]/)[0].trim())
    .filter(Boolean);
};
