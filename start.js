import path from 'path';
import { existsSync, promises as fs } from 'fs';

import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { serve } from 'esbuild';

const entry = './src/index.ts';
const outdir = path.join(process.cwd(), 'dist');
const port = process.env.PORT || 8080;

async function run() {
  if (existsSync(outdir)) {
    await fs.rm(outdir, { recursive: true });
  }

  await fs.mkdir(outdir);

  await serve(
    { servedir: outdir, port },
    {
      entryPoints: [entry],
      platform: 'browser',
      bundle: true,
      plugins: [vanillaExtractPlugin()],
      outdir,
    },
  );

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>vanilla-extract-esbuild</title>
        <link rel="stylesheet" type="text/css" href="index.css" />
        </head>
      <body>
        <script src="index.js"></script>
      </body>
      </html>
    `,
  );
  console.log(`http://localhost:${port}`);
}

run();
