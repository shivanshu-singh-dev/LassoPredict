import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, Sparkles, ArrowRight, Zap, Target } from 'lucide-react';

const pageVariants = { initial: { opacity: 0, y: 30 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -30 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.6 };

const Prediction = () => {
  const [modelData, setModelData] = useState(null);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [inputError, setInputError] = useState(false);

  const loadModel = () => {
    const storedModel = localStorage.getItem('lasso_results');
    if (storedModel) {
      try {
        const parsed = JSON.parse(storedModel);
        if (!parsed.selected_features || !Array.isArray(parsed.selected_features)) {
          // Fallback if data structure is old or malformed
          localStorage.removeItem('lasso_results');
          setModelData(null);
          return;
        }

        setModelData(parsed);
        const initialInputs = {};
        parsed.selected_features.forEach(f => {
          initialInputs[f] = '';
        });
        setInputs(initialInputs);
        setPrediction(null);
      } catch (err) {
        console.error("Failed to parse stored model", err);
        localStorage.removeItem('lasso_results');
        setModelData(null);
      }
    } else {
      setModelData(null);
    }
  };

  useEffect(() => {
    loadModel();
    // Listen for storage events (e.g. if cleared in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'lasso_results') loadModel();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (e, feature) => {
    setInputError(false); // remove error state on user typing
    setInputs(prev => ({
      ...prev,
      [feature]: e.target.value
    }));
  };

  const handlePredict = () => {
    if (!modelData) return;

    // Validate that all inputs have a valid number
    const isAnyEmptyOrNaN = modelData.selected_features.some(feature => {
      const val = inputs[feature];
      return val === '' || val === null || val === undefined || isNaN(parseFloat(val));
    });

    if (isAnyEmptyOrNaN) {
      setInputError(true);
      return;
    }

    setInputError(false);
    setIsCalculating(true);
    setPrediction(null);

    setTimeout(() => {
      let result = modelData.intercept || 0;
      Object.entries(modelData.coefficients).forEach(([feature, coef]) => {
        const userVal = parseFloat(inputs[feature]);
        if (!isNaN(userVal)) {
          result += coef * userVal;
        }
      });
      setPrediction(result);
      setIsCalculating(false);
    }, 600);
  };

  if (!modelData) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card" style={{ textAlign: 'center', padding: '6rem 2rem', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', zIndex: 0 }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', zIndex: 0 }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ width: '100px', height: '100px', background: 'var(--surface-solid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)', marginBottom: '2rem' }}
          >
            <BrainCircuit size={48} color="var(--primary)" />
          </motion.div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>Model Not Synced</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}>
            Our engine is eager to predict, but it needs a trained neural mapping first. Head over to the Home page, upload your dataset, and train a powerful Lasso model.
          </p>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '3rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              Train Model <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--tertiary))' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
          <Target size={36} color="var(--primary)" />
          <h1 className="card-title" style={{ marginBottom: 0 }}>Live Model Prediction</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>
          Your bespoke model successfully retained <strong>{modelData.selected_features.length}</strong> core features.
          Enter your specific instance values below to calculate the real-time target projection using the optimized hyper-parameters.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ background: 'var(--surface)', backdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-solid)', paddingBottom: '1rem' }}>
                 <div>
                   <h3 style={{ margin: 0, color: 'var(--text-main)', fontWeight: '700', fontSize: '1.25rem' }}>Structural Features</h3>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Input values for active predictors</p>
                 </div>
                 <Sparkles size={20} color="var(--primary)" />
              </div>

            {/* Made grid 2-columns (auto-fit logic ensures it flows optimally if odd/even count) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <AnimatePresence>
                {modelData.selected_features.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="form-group"
                    style={{ margin: 0 }}
                  >
                    <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {feature}
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={inputs[feature] || ''}
                      onChange={(e) => handleInputChange(e, feature)}
                      placeholder={`0.0`}
                      style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.5)',
                        border: inputError && (inputs[feature] === '' || isNaN(parseFloat(inputs[feature]))) ? '2px solid var(--error)' : '1px solid var(--border-solid)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: 'none'
                      }}
                      onFocus={(e) => {
                        if (!inputError) {
                          e.target.style.borderColor = 'var(--primary)';
                          e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                          e.target.style.background = '#fff';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-solid)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

              {inputError && (
                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity:1, y:0}} style={{color: 'var(--error)', marginTop: '2rem', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  Validation Error: Please fill all active feature fields.
                </motion.div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict} 
                  disabled={isCalculating}
                  style={{ width: '100%', maxWidth: '300px', marginTop: '2.5rem', padding: '1rem', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', border: 'none', color: 'white', borderRadius: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  {isCalculating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}>
                      <BrainCircuit size={22} />
                    </motion.div>
                  ) : (
                    <><Zap size={20} /> Calculate Prediction</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Results Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ padding: '2.5rem', background: prediction !== null ? 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)' : 'var(--surface)', backdropFilter: 'blur(16px)', border: prediction !== null ? '1px solid var(--accent)' : '1px dashed var(--border-solid)', borderRadius: '1.5rem', boxShadow: prediction !== null ? '0 15px 35px rgba(16, 185, 129, 0.1), var(--shadow-glass)' : 'var(--shadow-glass)', transition: 'all 0.5s ease', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
            >
              {prediction !== null && (
                <motion.div 
                   animate={{ opacity: [0.3, 0.5, 0.3] }} 
                   transition={{ duration: 4, repeat: Infinity }}
                   style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)' }}
                />
              )}
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '700', marginBottom: '1.5rem' }}>Resulting Projection</h4>
                
                {prediction === null ? (
                  <div style={{ padding: '2rem 0' }}>
                    <Target size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Ready to process inputs...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={prediction}
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-2px', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--text-main), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {(prediction).toFixed(4)}
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '700' }}>
                        <Zap size={14} /> Calculated Successfully
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {modelData.metrics && (
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                 style={{ padding: '1.5rem', background: 'var(--surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-glass)' }}
              >
                 <div>
                   <h4 style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Model Confidence</h4>
                   <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>{(modelData.metrics.r2 * 100).toFixed(1)}% <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500'}}>R²</span></div>
                 </div>
                 <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <svg style={{ transform: 'rotate(-90deg)' }} width="60" height="60">
                      <circle cx="30" cy="30" r="26" stroke="var(--border-solid)" strokeWidth="4" fill="transparent" />
                      <circle cx="30" cy="30" r="26" stroke="var(--primary)" strokeWidth="4" fill="transparent" strokeDasharray="163.36" strokeDashoffset={163.36 - (163.36 * modelData.metrics.r2)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Target size={16} color="var(--primary)" />
                    </div>
                 </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Prediction;
