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
  hover: { scale: 1.5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", borderColor: "var(--primary)", zIndex: 10 }
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
            transition: 'all 0.3s ease', cursor: 'pointer', overflow: 'hidden'
          }}
        >
          <img src="/images/prof.jpeg" alt="Prof. Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>Professor Name</h3>
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
              transition: 'all 0.3s ease', cursor: 'pointer', overflow: 'hidden'
            }}
          >
            <img src="/images/shivanshu.jpeg" alt="Shivanshu Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)', zIndex: 1 }}>Shivanshu</h4>
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
              transition: 'all 0.3s ease', cursor: 'pointer', overflow: 'hidden'
            }}
          >
            <img src="/images/anshika.jpeg" alt="Anshika Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)', zIndex: 1 }}>Anshika</h4>
        </motion.div>
      </div>

      {/* Team Name */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
        style={{
          padding: '3rem 2rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: '1.5rem', border: '1px solid #4338ca', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          color: 'white', position: 'relative', overflow: 'hidden'
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div style={{ position: 'absolute', top: '5%', right: '-5%', opacity: 0.1, zIndex: 0 }}>
          <svg width="250" height="250" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,90 20,50 35,20 40,40 50,45 60,40 65,20 80,50" />
            <polygon points="20,50 40,65 50,90 60,65 80,50" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            <svg style={{ width: '80px', height: '80px', marginBottom: '1rem', color: '#c7d2fe', display: 'inline-block' }} viewBox="0 0 100 100">
              <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                <polygon points="50,90 20,50 35,20 40,40 50,45 60,40 65,20 80,50" fill="currentColor" fillOpacity="0.15" />
                <polyline points="20,50 40,65 50,90 60,65 80,50" />
                <polyline points="35,20 45,35 50,45" />
                <polyline points="65,20 55,35 50,45" />
                <line x1="50" y1="45" x2="50" y2="90" />
                <circle cx="38" cy="53" r="2.5" fill="currentColor" />
                <circle cx="62" cy="53" r="2.5" fill="currentColor" />
              </g>
            </svg>
          </motion.div>
          <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '5px', fontWeight: 'bold', color: '#a5b4fc', marginBottom: '0.8rem' }}>Developed by team</div>
          <h2 style={{ margin: 0, color: '#ffffff', fontStyle: 'italic', fontSize: '3.2rem', fontWeight: 900, textShadow: '0 4px 15px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>The King In The North</h2>
        </div>
      </motion.div>

    </div>
  </motion.div>
);

export default DevelopedBy;
