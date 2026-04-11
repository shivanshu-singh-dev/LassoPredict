import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const pageVariants = { initial: { opacity: 0, y: 30 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -30 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.6 };

const Prediction = () => {
  const [modelData, setModelData] = useState(null);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Load model from local storage
    const storedModel = localStorage.getItem('lasso_results');
    if (storedModel) {
      try {
        const parsed = JSON.parse(storedModel);
        setModelData(parsed);
        // Initialize inputs
        const initialInputs = {};
        parsed.selected_features.forEach(f => {
          initialInputs[f] = '';
        });
        setInputs(initialInputs);
      } catch (err) {
        console.error("Failed to parse stored model", err);
      }
    }
  }, []);

  const handleInputChange = (e, feature) => {
    setInputs(prev => ({
      ...prev,
      [feature]: e.target.value
    }));
  };

  const handlePredict = () => {
    if (!modelData) return;

    let result = modelData.intercept || 0; // Check if intercept is returned by the API
    Object.entries(modelData.coefficients).forEach(([feature, coef]) => {
      // Only include if value is provided and valid
      const userVal = parseFloat(inputs[feature]);
      if (!isNaN(userVal)) {
        result += coef * userVal;
      }
    });

    setPrediction(result);
  };

  if (!modelData) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>No Trained Model Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Please visit the Home page and train a model first using your dataset.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="card">
        <h1 className="card-title">Live Model Prediction</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Your model was successfully trained retaining {modelData.selected_features.length} core features. 
          Enter values below to run a live prediction using the optimized structural parameters.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '600px', margin: '0 auto', background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-solid)', paddingBottom: '0.5rem' }}>Input Structurally Active Variables</h3>
          
          {modelData.selected_features.map(feature => (
            <div key={feature} className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ fontWeight: 'bold' }}>{feature}</label>
              <input 
                type="number"
                step="any"
                className="form-control"
                value={inputs[feature] || ''}
                onChange={(e) => handleInputChange(e, feature)}
                placeholder={`Value for ${feature}...`}
              />
            </div>
          ))}

          <button className="btn btn-primary" onClick={handlePredict} style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Calculate Prediction
          </button>
        </div>

        {prediction !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ 
              marginTop: '3rem', 
              padding: '2rem', 
              textAlign: 'center', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '2px solid var(--accent)', 
              borderRadius: '1rem' 
            }}
          >
            <h2 style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Predicted Result</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              {prediction.toFixed(4)}
            </div>
            {modelData.metrics && (
               <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                 Estimated R² Confidence Model: {(modelData.metrics.r2).toFixed(4)}
               </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Prediction;
