import { db } from "@/lib/db"

export default async function AboutPage() {
  const settings = await db.siteSettings.findFirst()

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl text-black dark:text-white">
          About HATTO
        </h1>
        
        {settings?.aboutContent ? (
          <div 
            className="prose prose-neutral dark:prose-invert max-w-none prose-lg text-black/80 dark:text-white/80"
            dangerouslySetInnerHTML={{ __html: settings.aboutContent }}
          />
        ) : (
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg text-black/80 dark:text-white/80">
            <p>Welcome to HATTO.</p>
          </div>
        )}
      </div>
    </div>
  )
}
