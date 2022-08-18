import { Router } from '@layer0/core/router'
import { isProductionBuild } from '@layer0/core/environment'

const ONE_DAY_CACHE = ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 24 * 60 * 60,
    },
  })
}

const router = new Router()

// Regex to catch multiple hostnames
// Any deployment will have a L0 permalink
// Don't allow Google bot to crawl it, read more on:
// https://docs.layer0.co/guides/cookbook#blocking-search-engine-crawlers
router.noIndexPermalink()

// Serve the old Layer0 predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__layer0__/:path*', 301)
})

// Service Worker
router.match('/service-worker.js', ({ serveStatic }) => {
  serveStatic('dist/service-worker.js')
})

if (isProductionBuild()) {
  // Cache the home page for a day on the edge
  router.match('/', ONE_DAY_CACHE)
  // Cache all static assets generated by astro build
  router.static('dist/client')
}

router.fallback(({ renderWithApp }) => {
  renderWithApp()
})

export default router
