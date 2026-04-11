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
        setModelData(parsed);
        const initialInputs = {};
        parsed.selected_features.forEach(f => {
          initialInputs[f] = '';
        });
        setInputs(initialInputs);
        setPrediction(null);
      } catch (err) {
        console.error("Failed to parse stored model", err);
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'var(--surface-solid)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-solid)', paddingBottom: '1rem' }}>
               <h3 style={{ margin: 0, color: 'var(--primary)', fontWeight: 'bold' }}>Structurally Active Variables</h3>
               <Sparkles size={20} color="var(--tertiary)" />
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
                    <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
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
                        padding: '1rem', 
                        borderRadius: '0.8rem', 
                        background: 'var(--bg-color)', 
                        border: inputError && (inputs[feature] === '' || isNaN(parseFloat(inputs[feature]))) ? '2px solid var(--error)' : '1px solid var(--border-solid)', 
                        transition: 'all 0.2s', 
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' 
                      }}
                      onFocus={(e) => {
                        if (!inputError) e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'
                      }}
                      onBlur={(e) => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {inputError && (
              <motion.div initial={{opacity: 0, y: -10}} animate={{opacity:1, y:0}} style={{color: 'var(--error)', marginTop: '1.5rem', textAlign: 'center', fontWeight: 'bold'}}>
                All structural inputs must be filled with valid numbers before applying the projection.
              </motion.div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict} 
                disabled={isCalculating}
                style={{ width: '100%', maxWidth: '400px', marginTop: '2.5rem', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', border: 'none', color: 'white', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {isCalculating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <BrainCircuit size={24} />
                  </motion.div>
                ) : (
                  <><Zap size={24} /> Run Neural Projection</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', background: prediction !== null ? 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.15) 100%)' : 'var(--bg-color)', border: prediction !== null ? '2px solid var(--accent)' : '2px dashed var(--border-solid)', borderRadius: '1.5rem', transition: 'all 0.5s ease', position: 'relative', overflow: 'hidden' }}
            >
              {prediction !== null && (
                <motion.div 
                   animate={{ opacity: [0.3, 0.6, 0.3] }} 
                   transition={{ duration: 4, repeat: Infinity }}
                   style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)' }}
                />
              )}
              
              {prediction === null ? (
                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                  <Target size={64} style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Awaiting Inputs</h3>
                  <p>Provide values and calculate prediction.</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={prediction}
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{ textAlign: 'center', zIndex: 1 }}
                  >
                    <h2 style={{ color: 'var(--accent)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Optimal Projection</h2>
                    <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--text-main)', background: 'linear-gradient(90deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', dropShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                      {(prediction).toFixed(4)}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>

            {modelData.metrics && (
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                 style={{ padding: '1.5rem', background: 'var(--surface-solid)', border: '1px solid var(--border-solid)', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                 <div>
                   <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model Confidence (R²)</h4>
                   <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.2rem' }}>{(modelData.metrics.r2).toFixed(4)}</div>
                 </div>
                 <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `conic-gradient(var(--accent) ${modelData.metrics.r2 * 100}%, var(--bg-color) 0)` }} />
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Prediction;
