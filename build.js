import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/content.ts'],
  bundle: true,
  outdir: 'dist',
  target: 'es2020',
  format: 'iife',
  platform: 'browser',
  minify: true,
}).catch(() => process.exit(1)); 