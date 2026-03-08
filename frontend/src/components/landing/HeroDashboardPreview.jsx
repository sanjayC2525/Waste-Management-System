import { motion } from "framer-motion";

export default function HeroDashboardPreview() {
  return (
    <div className="relative">
      <img
        src="/Transperentpng1.png"
        className="rounded-2xl shadow-2xl w-full max-w-4xl mx-auto"
        alt="Dashboard Preview"
      />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-6 -left-6 bg-surface border border-border backdrop-blur-sm shadow-xl p-4 rounded-xl"
      >
        <p className="text-xs text-text.muted">Reports Today</p>
        <p className="text-xl font-bold text-text.primary">24</p>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-0 -right-6 bg-surface border border-border backdrop-blur-sm shadow-xl p-4 rounded-xl"
      >
        <p className="text-xs text-text.muted">Tasks Completed</p>
        <p className="text-xl font-bold text-status.success">18</p>
      </motion.div>
    </div>
  );
}
