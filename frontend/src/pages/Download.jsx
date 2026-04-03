import React, { useState, useEffect } from 'react';
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

const Download = () => {
  const [results, setResults] = useState(null);
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('lasso_results');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored results", e);
      }
    }
  }, []);

  const handleDownload = async () => {
    if (!results) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results, format })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Export failed');
      }
      
      // Handle file download
      const linkSource = `data:${data.export.type};base64,${data.export.data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = data.export.filename;
      downloadLink.click();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <div className="card">
        <h1 className="card-title">Download Results</h1>
        
        {!results ? (
          <p className="text-muted">No model results found. Please train a model on the Home page first.</p>
        ) : (
          <div className="fade-in-up">
            <p className="mb-4">Model metrics available. Select an export format.</p>
            
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label className="form-label">Export Format</label>
              <select className="form-control" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="json">JSON</option>
                <option value="txt">Text (.txt)</option>
                <option value="pdf">PDF Report</option>
              </select>
            </div>
            
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
            
            <button className="btn btn-primary" onClick={handleDownload} disabled={loading}>
              {loading ? 'Generating...' : 'Download Export'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Download;
