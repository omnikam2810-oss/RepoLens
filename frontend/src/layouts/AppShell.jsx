import { motion } from 'framer-motion';

const AppShell = ({ navbar, leftSidebar, children, rightSidebar, fullWidth = false }) => (
  <div className="min-h-screen">
    {navbar}
    <motion.div
      className={`mx-auto grid w-full max-w-[1540px] grid-cols-1 gap-4 px-3 py-4 sm:px-4 sm:py-5 lg:gap-6 lg:px-6 lg:py-6 ${
        fullWidth ? '' : 'lg:grid-cols-[280px_minmax(0,1fr)_320px]'
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {!fullWidth && <aside className="order-2 lg:order-none lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">{leftSidebar}</aside>}
      <main className="order-1 min-w-0 lg:order-none">{children}</main>
      {!fullWidth && <aside className="order-3 lg:order-none lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">{rightSidebar}</aside>}
    </motion.div>
  </div>
);

export default AppShell;
