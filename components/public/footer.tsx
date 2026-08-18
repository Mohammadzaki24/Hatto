export function Footer({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="mt-auto border-t border-black/5 dark:border-white/10 bg-[#F5F0E8] dark:bg-[#141210] py-8">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-charcoal)]/70 dark:text-white/50">
          © {new Date().getFullYear()} HATTO. All rights reserved.
        </p>
        <p className="text-xs text-[var(--color-charcoal)]/50 dark:text-white/40 max-w-md text-center md:text-right">
          {disclaimer}
        </p>
      </div>
    </footer>
  )
}
