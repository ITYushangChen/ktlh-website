import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const cracoPkg = require.resolve('@craco/craco/package.json');
const cracoBin = join(dirname(cracoPkg), 'dist/bin/craco.js');

const api = spawn(process.execPath, [join(root, 'scripts/dev-content-api.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

const craco = spawn(process.execPath, [cracoBin, 'start'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env },
});

const shutdown = () => {
  api.kill();
  craco.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

craco.on('exit', (code) => {
  api.kill();
  process.exit(code ?? 0);
});
