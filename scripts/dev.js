import { spawn } from 'node:child_process';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const isPortAvailable = (port, host) =>
  new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });

const findAvailablePort = async (preferredPort, host) => {
  let port = preferredPort;

  while (!(await isPortAvailable(port, host))) {
    port += 1;
  }

  return port;
};

const backendPort = await findAvailablePort(5000);
const frontendHost = '127.0.0.1';
const frontendPort = await findAvailablePort(5173, frontendHost);

if (backendPort !== 5000) {
  console.log(`Backend port 5000 is busy. Using ${backendPort}.`);
}

if (frontendPort !== 5173) {
  console.log(`Frontend port 5173 is busy. Using ${frontendPort}.`);
}

console.log(`RepoLens frontend: http://${frontendHost}:${frontendPort}`);
console.log(`RepoLens backend:  http://127.0.0.1:${backendPort}`);

const processes = [
  {
    name: 'backend',
    command: npmCommand,
    args: ['run', 'dev'],
    cwd: path.join(rootDir, 'backend'),
    env: {
      PORT: String(backendPort),
      FRONTEND_URL: `http://${frontendHost}:${frontendPort}`,
    },
  },
  {
    name: 'frontend',
    command: npmCommand,
    args: ['run', 'dev', '--', '--host', frontendHost, '--port', String(frontendPort), '--strictPort'],
    cwd: path.join(rootDir, 'frontend'),
    env: {
      VITE_API_BASE_URL: `http://127.0.0.1:${backendPort}/api`,
    },
  },
];

const children = processes.map((processConfig) => {
  const child = spawn(processConfig.command, processConfig.args, {
    cwd: processConfig.cwd,
    env: {
      ...process.env,
      ...processConfig.env,
    },
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${processConfig.name}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${processConfig.name}] ${chunk}`);
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
      shutdown();
    }
  });

  return child;
});

const shutdown = () => {
  children.forEach((child) => {
    if (!child.killed) child.kill();
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
