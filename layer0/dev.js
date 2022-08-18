const { buildSync } = require('esbuild')
const { createDevServer } = require('@layer0/core/dev')

const appDir = process.cwd()

module.exports = function () {
  buildSync({
    entryPoints: [`${appDir}/sw/service-worker.js`],
    outfile: `${appDir}/dist/service-worker.js`,
    minify: true,
    bundle: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
      'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
    },
  })
  return createDevServer({
    label: '[Astro SSR]',
    command: (port) => `npx astro dev -- --port ${port}`,
    ready: [/listening on/i],
  })
}
