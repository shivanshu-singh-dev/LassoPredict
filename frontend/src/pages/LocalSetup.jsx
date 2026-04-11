import React from 'react';
import { motion } from 'framer-motion';
import { Database, Terminal, GitBranch, Play, CheckCircle } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 30 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -30 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.6 };

const LocalSetup = () => {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #10b981, #3b82f6, #6366f1)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
          <Database size={36} color="var(--accent)" />
          <h1 className="card-title" style={{ marginBottom: 0 }}>Install Locally for Unlimited Processing</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '800px', lineHeight: '1.6' }}>
          As a web demonstration deployed via Serverless architecture, this live application strictly caps dataset uploads at ~5MB to restrict execution timeout. To leverage <strong>LassoPredict</strong> to its full academic horsepower on multi-gigabyte datasets, follow these rapid instructions to clone and deploy the engine locally onto your machine.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <motion.div 
               whileHover={{ scale: 1.02 }}
               style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'var(--primary)', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>1</span>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Clone the Repository</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Clone the open source engine directly from the official repository via your terminal.</p>
              <div style={{ background: '#0f172a', borderRadius: '0.8rem', padding: '1.2rem', position: 'relative' }}>
                <GitBranch size={20} color="#64748b" style={{ position: 'absolute', top: '1.2rem', right: '1.2rem' }} />
                <code style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>$ git clone https://github.com/shivanshu-singh-dev/LassoPredict.git</code>
                <code style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'block' }}>$ cd LassoPredict</code>
              </div>
            </motion.div>

            <motion.div 
               whileHover={{ scale: 1.02 }}
               style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'var(--accent)', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>2</span>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Boot the Python Backend</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Initialize the FastAPI mathematical engine, install dependencies, and run the API server.</p>
              <div style={{ background: '#0f172a', borderRadius: '0.8rem', padding: '1.2rem', position: 'relative' }}>
                <Terminal size={20} color="#64748b" style={{ position: 'absolute', top: '1.2rem', right: '1.2rem' }} />
                <code style={{ color: '#10b981', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>$ cd api</code>
                <code style={{ color: '#10b981', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>$ pip install -r requirements.txt</code>
                <code style={{ color: '#10b981', fontSize: '0.9rem', display: 'block' }}>$ uvicorn index:app --reload</code>
              </div>
            </motion.div>

          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <motion.div 
               whileHover={{ scale: 1.02 }}
               style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)', flex: '1' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'var(--tertiary)', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>3</span>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Launch Frontend Client</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>In a separate terminal instance, boot the React Vite interactive User Interface.</p>
              <div style={{ background: '#0f172a', borderRadius: '0.8rem', padding: '1.2rem', position: 'relative', marginBottom: '1.5rem' }}>
                <Play size={20} color="#64748b" style={{ position: 'absolute', top: '1.2rem', right: '1.2rem' }} />
                <code style={{ color: '#a855f7', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>$ cd frontend</code>
                <code style={{ color: '#a855f7', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>$ npm install</code>
                <code style={{ color: '#a855f7', fontSize: '0.9rem', display: 'block' }}>$ npm run dev</code>
              </div>
            </motion.div>

            <div style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.1) 100%)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <CheckCircle size={48} color="var(--accent)" />
               <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Hardware Unchained</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Once deployed to your local host (usually <code style={{background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px'}}>localhost:5173</code>), there are absolutely zero computational limiters. You are restricted solely by your machine's raw RAM. 
                  </p>
               </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default LocalSetup;
