import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const AppShell = ({ navbar, leftSidebar, children, rightSidebar, fullWidth = false }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {navbar}

      {!fullWidth && (
        <>
          {isMobileNavOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close report sections"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
                onClick={() => setIsMobileNavOpen(false)}
              />
              <motion.aside
                className="absolute left-3 top-[92px] h-[min(76vh,620px)] w-[min(82vw,320px)]"
                initial={{ opacity: 0, x: -18, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClickCapture={(event) => {
                  if (event.target.closest('button')) {
                    setIsMobileNavOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Close report sections"
                  title="Close"
                  className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand"
                >
                  <X size={16} />
                </button>
                {leftSidebar}
              </motion.aside>
            </div>
          )}
        </>
      )}

      <motion.div
        className={`mx-auto grid w-full max-w-[1540px] grid-cols-1 gap-4 px-3 py-4 sm:px-4 sm:py-5 lg:gap-6 lg:px-6 lg:py-6 ${
          fullWidth ? '' : 'lg:grid-cols-[280px_minmax(0,1fr)_320px]'
        }`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {!fullWidth && <aside className="hidden lg:order-none lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)]">{leftSidebar}</aside>}
        <main className="order-1 min-w-0 lg:order-none">
          {!fullWidth && (
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open report sections"
              title="Report sections"
              className="mb-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:text-brand lg:hidden"
            >
              <Menu size={17} />
              Report Sections
            </button>
          )}
          {children}
        </main>
        {!fullWidth && <aside className="order-3 lg:order-none lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">{rightSidebar}</aside>}
      </motion.div>
    </div>
  );
};

export default AppShell;
