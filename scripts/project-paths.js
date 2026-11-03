import path from 'node:path';

export function resolveProjectPath(rootDir, relativePath) {
  const resolvedPath = path.resolve(rootDir, relativePath);
  const relative = path.relative(rootDir, resolvedPath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return null;
  }
  return resolvedPath;
}
