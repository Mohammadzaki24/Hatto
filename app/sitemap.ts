import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({ select: { slug: true, updatedAt: true } })
  const categories = await db.category.findMany({ select: { slug: true, updatedAt: true } })

  const productUrls = products.map((product) => ({
    url: `https://hatto.com/products/${product.slug}`,
    lastModified: product.updatedAt,
  }))

  const categoryUrls = categories.map((category) => ({
    url: `https://hatto.com/category/${category.slug}`,
    lastModified: category.updatedAt,
  }))

  return [
    {
      url: 'https://hatto.com',
      lastModified: new Date(),
    },
    {
      url: 'https://hatto.com/about',
      lastModified: new Date(),
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
