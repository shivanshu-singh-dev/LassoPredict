import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const DevelopedBy = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    <div className="card">
      <h1 className="card-title">Developed By</h1>
      <p>This is a placeholder. Team profiles and credits will be listed here.</p>
    </div>
  </motion.div>
);

export default DevelopedBy;
