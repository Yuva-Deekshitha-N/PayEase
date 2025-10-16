import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://pay-ease-9zmcbr56a-yuva-deekshitha-ns-projects.vercel.app/sitemap.xml',
  }
}