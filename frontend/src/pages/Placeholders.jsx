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

const PageWrapper = ({ children, title }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    <div className="card">
      <h1 className="card-title">{title}</h1>
      {children}
    </div>
  </motion.div>
);

export const Learn = () => (
  <PageWrapper title="Learn Lasso Regression">
    <p>This is a placeholder for the educational content where the algorithm visualization will be incorporated by another teammate.</p>
  </PageWrapper>
);

export const DevelopedBy = () => (
  <PageWrapper title="Developed By">
    <p>This is a placeholder for team or personal credits.</p>
  </PageWrapper>
);
