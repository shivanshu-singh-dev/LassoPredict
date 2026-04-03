import React, { useState } from 'react';
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

const Home = () => {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [alpha, setAlpha] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTrain = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!targetColumn) {
      setError("Please specify the target column name.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn);
    formData.append('alpha', alpha);

    try {
      const response = await fetch('http://localhost:8000/api/train/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Training failed");
      }
      
      setResults(data.results);
      localStorage.setItem('lasso_results', JSON.stringify(data.results));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      
      <div className="card">
        <h1 className="card-title">Train Lasso Model</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Upload Dataset (CSV, Excel, JSON, TXT)</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Target Column</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Sales, Price" 
                value={targetColumn} 
                onChange={(e) => setTargetColumn(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Alpha (Regularization Strength)</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={alpha} 
                onChange={(e) => setAlpha(parseFloat(e.target.value))} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              For M x N manual entry, functionality is implemented in the backend. 
              Upload via file is active.
            </p>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>{error}</div>}
            
            <button className="btn btn-primary" onClick={handleTrain} disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? (
                <span className="pulse">Training Model...</span>
              ) : 'Train Model'}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <motion.div 
          className="card fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="card-title">Training Results</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Key Metrics</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mean Squared Error (MSE):</span>
                <span style={{ fontWeight: '600' }}>{results.metrics.mse.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>R² Score:</span>
                <span style={{ fontWeight: '600' }}>{results.metrics.r2.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Intercept:</span>
                <span style={{ fontWeight: '600' }}>{results.intercept.toFixed(4)}</span>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Feature Selection</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {results.selected_features.length} features selected out of {Object.keys(results.coefficients).length} total features.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {results.selected_features.slice(0, 10).map((f) => (
                  <span key={f} style={{ background: 'var(--accent)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                    {f}
                  </span>
                ))}
                {results.selected_features.length > 10 && (
                  <span style={{ background: 'var(--border)', color: 'var(--text-main)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                    +{results.selected_features.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Coefficients</h3>
          <div className="table-container" style={{ maxHeight: '400px' }}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Coefficient Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.coefficients).map(([feature, coef]) => {
                  const isZero = Math.abs(coef) < 1e-10;
                  return (
                    <tr key={feature} className={!isZero ? "highlight-row" : ""}>
                      <td style={{ fontWeight: !isZero ? '600' : '400' }}>{feature}</td>
                      <td>{coef.toFixed(6)}</td>
                      <td>
                        {!isZero ? (
                          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Selected (Non-zero)</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Dropped (Zero)</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
    </motion.div>
  );
};

export default Home;
