import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.6
};

const profileHover = {
  hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.1)", borderColor: "var(--primary)" }
};

const DevelopedBy = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
      <motion.h1 
        className="card-title" 
        style={{ fontSize: '2.5rem' }} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
      >
        Developed By
      </motion.h1>
      
      {/* Professor Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem', marginTop: '3rem' }}
      >
        <motion.div 
          whileHover="hover"
          variants={profileHover}
          style={{ 
            width: '200px', height: '200px', borderRadius: '50%', 
            background: 'var(--border-solid)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)', border: '4px solid var(--surface-solid)',
            transition: 'all 0.3s ease', cursor: 'pointer'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Prof. Photo</span>
        </motion.div>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>Professor Name Placeholder</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Project Guide & Mentor</p>
      </motion.div>

      {/* Team Members */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '3rem', marginBottom: '5rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div 
            whileHover="hover"
            variants={profileHover}
            style={{ 
              width: '160px', height: '160px', borderRadius: '50%', 
              background: 'var(--border-solid)', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)', border: '4px solid var(--surface-solid)',
              transition: 'all 0.3s ease', cursor: 'pointer'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Member 1</span>
          </motion.div>
          <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Teammate 1</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem' }}>Lead Developer</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div 
            whileHover="hover"
            variants={profileHover}
            style={{ 
              width: '160px', height: '160px', borderRadius: '50%', 
              background: 'var(--border-solid)', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)', border: '4px solid var(--surface-solid)',
              transition: 'all 0.3s ease', cursor: 'pointer'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Member 2</span>
          </motion.div>
          <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Teammate 2</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem' }}>Data Scientist</p>
        </motion.div>
      </div>

      {/* Team Name */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
        style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)' }}
      >
        <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '600' }}>Developed by team</span>
        <h2 style={{ margin: '0.5rem 0 0 0', color: 'var(--primary)', fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 800 }}>The King In The North</h2>
      </motion.div>

    </div>
  </motion.div>
);

export default DevelopedBy;
