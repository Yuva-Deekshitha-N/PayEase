import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://pay-ease-kfk7cfhta-yuva-deekshitha-ns-projects.vercel.app/sitemap.xml',
  }
}