import { motion } from 'framer-motion';

const AppShell = ({ navbar, leftSidebar, children, rightSidebar, fullWidth = false }) => (
  <div className="min-h-screen">
    {navbar}
    <motion.div
      className={`mx-auto grid w-full max-w-[1540px] grid-cols-1 gap-6 px-4 py-6 lg:px-6 ${
        fullWidth ? '' : 'lg:grid-cols-[280px_minmax(0,1fr)_320px]'
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {!fullWidth && <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">{leftSidebar}</aside>}
      <main className="min-w-0">{children}</main>
      {!fullWidth && <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">{rightSidebar}</aside>}
    </motion.div>
  </div>
);

export default AppShell;
