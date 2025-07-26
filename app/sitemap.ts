import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date().toISOString()

  // Static pages
  const routes = [
    '',
    '/tokens',
    '/defi', 
    '/blog',
    '/stats',
  ]

  const staticPages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return staticPages
} 