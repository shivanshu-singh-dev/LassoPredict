import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Cell, ReferenceLine, Legend, ZAxis
} from 'recharts';

const pageVariants = { initial: { opacity: 0, y: 30 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -30 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.6 };

const Home = () => {
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [alpha, setAlpha] = useState(1.0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  

  const [isAnimating, setIsAnimating] = useState(false);
  const [vizStep, setVizStep] = useState(0); 
  /*
    Steps:
    0: None
    1: Data View (Scatter of data variance)
    2: Init Model (Bar chart of raw theoretical weights)
    3: Penalization Path (Line chart of weights decaying)
    4: Convergence (Final interactive stable bar chart)
  */
  
  const [animationStep, setAnimationStep] = useState(0);
  const [simulatedPath, setSimulatedPath] = useState([]);
  const [simulatedCoefficients, setSimulatedCoefficients] = useState({});
  const [mockDataVariance, setMockDataVariance] = useState([]);
  
  const animationRef = useRef(null);
  const sequenceRef = useRef(null);
  const resultsRef = useRef(null);
  const TOTAL_STEPS = 50; 

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateDataVariance = (coefs) => {

    const scatter = [];
    const featureCount = Object.keys(coefs).length;
    for(let i=0; i<40; i++) {
      scatter.push({
        x: Math.random() * 100,
        y: Math.random() * 100 + (Math.random() * 50),
        z: Math.random() * 100
      });
    }
    setMockDataVariance(scatter);
  };

  const startTrainingSequence = (results) => {
    setIsAnimating(true);
    setVizStep(1); 
    
    setTimeout(() => {
      const anchor = document.getElementById("results-anchor");
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);


    generateDataVariance(results.coefficients);

    const initialCoefs = {};
    Object.entries(results.coefficients).forEach(([feat, finalVal]) => {
      const magnitude = Math.max(Math.abs(finalVal) * (3 + Math.random() * 5), 10 + Math.random() * 20);
      initialCoefs[feat] = finalVal >= 0 ? magnitude : -magnitude;
    });
    setSimulatedCoefficients(initialCoefs);


    const generatedPath = [];
    for (let i = 0; i <= TOTAL_STEPS; i++) {
      const progress = i / TOTAL_STEPS;
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const stepData = { iteration: i };
      
      Object.entries(results.coefficients).forEach(([feat, finalVal]) => {
        const startVal = initialCoefs[feat];
        stepData[feat] = startVal + (finalVal - startVal) * easeOut;
      });
      generatedPath.push(stepData);
    }
    setSimulatedPath(generatedPath);
    setAnimationStep(0);


    sequenceRef.current = setTimeout(() => {
      setVizStep(2); 
      sequenceRef.current = setTimeout(() => {
        setVizStep(3); 

        let currentFrame = 0;
        animationRef.current = setInterval(() => {
          if (currentFrame < TOTAL_STEPS) {
            currentFrame++;
            setAnimationStep(currentFrame);
          } else {
            clearInterval(animationRef.current);
            sequenceRef.current = setTimeout(() => {
              setVizStep(4);
              setIsAnimating(false);
              
              // Start 5 second cooldown
              setCooldownRemaining(5);
              let cd = 5;
              const cdInterval = setInterval(() => {
                cd -= 1;
                setCooldownRemaining(cd);
                if (cd <= 0) clearInterval(cdInterval);
              }, 1000);

            }, 1500);
          }
        }, 220);
      }, 4000);
    }, 4000);
  }

  const handleTrain = async (e, manualAlpha = null) => {
    if (!file) { setError("Please select a file to upload."); return; }
    if (!targetColumn) { setError("Please specify the target column name."); return; }
    if (alpha <= 0) { setError("Alpha must be greater than 0."); return; }
    if (cooldownRemaining > 0) return;
    
    // File Size warning (Vercel constraint check)
    // 5MB is roughly 5 * 1024 * 1024 bytes
    const isMainTrain = manualAlpha === null;
    if (isMainTrain && file.size > 5 * 1024 * 1024) {
      if (!window.confirm("Warning: Your dataset exceeds 5MB. As this is deployed on Vercel Serverless, it might hit execution limits resulting in a timeout. Do you want to try running it anyway?")) {
        return;
      }
    }

    // Always Wipe old local storage context upon fresh train initialization so ghosts don't persist
    if (isMainTrain) {
      localStorage.removeItem('lasso_results');
      window.dispatchEvent(new Event("storage"));
    }

    setError(null);
    setFinalResults(null);
    clearTimeout(sequenceRef.current);
    clearInterval(animationRef.current);
    
    // Set 5-second min timer promise
    const enforceMinLoadingTime = new Promise(resolve => setTimeout(resolve, 5000));
    
    if (isMainTrain) {
      setIsUploading(true);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_column', targetColumn);
    formData.append('alpha', isMainTrain ? alpha : manualAlpha);

    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    const baseUrl = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const apiUrl = apiBase.startsWith('http') ? `${baseUrl}/api/train/upload` : `${baseUrl}/train/upload`;

    console.log(`[API Request] POST ${apiUrl}`);

    try {
      const responsePromise = fetch(apiUrl, { method: 'POST', body: formData });
      
      // Await both promises (the fetch and the 5-sec artificial delay) when full training begins
      let response;
      if (isMainTrain) {
        const [res] = await Promise.all([responsePromise, enforceMinLoadingTime]);
        response = res;
      } else {
        response = await responsePromise;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Server error (${response.status}): ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorMessage;
        } catch (e) {
          // If not JSON, use the status text or first few chars of body
          if (errorText.length > 0 && errorText.length < 100) errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const results = data.results;
      localStorage.setItem('lasso_results', JSON.stringify(results));
      setFinalResults(results);
      startTrainingSequence(results);
      
    } catch (err) {
      console.error(`[API Error] ${err.message}`, err);
      setError(err.message === "Unexpected end of JSON input" 
        ? "The server returned an empty response. Please verify your backend is running and the URL is correct."
        : err.message);
    } finally {
      if (isMainTrain) setIsUploading(false);
    }
  };

  const handleAlphaChange = (newAlpha) => {
    const val = Math.max(0.01, newAlpha);
    setAlpha(val);
  };


  const currentSimulatedFrame = simulatedPath[animationStep] || {};
  const currentChartData = Object.entries(finalResults?.coefficients || {}).map(([name, finalVal]) => {
    const val = vizStep === 4 ? finalVal : (currentSimulatedFrame[name] || finalVal);
    return {
      name,
      value: val,
      isFinalZero: Math.abs(finalVal) < 1e-10,
      isCurrentlyZero: Math.abs(val) < 1e-2
    };
  });

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      
      {/* 5-second immersive loading overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', 
              zIndex: 9999, display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5 + i * 0.5, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    position: 'absolute', width: `${100 - i * 20}%`, height: `${100 - i * 20}%`, 
                    border: `3px solid hsla(${(i * 45 + 200) % 360}, 80%, 60%, 0.3)`,
                    borderTopColor: i === 0 ? 'var(--primary)' : (i === 1 ? 'var(--accent)' : 'var(--error)'),
                    borderRadius: '50%',
                    willChange: 'transform'
                  }}
                />
              ))}
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 20px var(--primary)', willChange: 'transform, opacity' }}
              />
            </div>
            
            <motion.h2 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'white', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              Training Model
            </motion.h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', fontStyle: 'italic', maxWidth: '600px', textAlign: 'center', lineHeight: '1.5' }}>
              Executing gradient descent, mapping multi-dimensional feature variance, and enforcing strict L1 penalty shrinkage...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card">
        <h1 className="card-title">Lasso Regression Playground</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload your generic data, select your target variable, and let the live step-by-step visualizations walk you through how variables are selected.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Upload Dataset (CSV, Excel)</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Target Column Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Price" 
                value={targetColumn} 
                onChange={(e) => setTargetColumn(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Alpha (λ) Penalty</label>
                <input
                  type="number"
                  min="0.01"
                  max="1000"
                  step="0.1"
                  value={alpha}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    if (rawValue === '') {
                      setAlpha('');
                      return;
                    }
                    const parsed = parseFloat(rawValue);
                    if (!isNaN(parsed)) {
                      handleAlphaChange(parsed);
                    }
                  }}
                  onBlur={() => {
                    if (alpha === '' || alpha < 0.01) {
                      handleAlphaChange(0.01);
                    }
                  }}
                  style={{ width: '80px', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-solid)', background: 'var(--surface-solid)', color: 'var(--text-main)', fontWeight: 'bold', textAlign: 'right' }}
                />
              </div>
              <input 
                type="range" min="0.01" max="1000" step="0.1" 
                className="form-control" 
                style={{ padding: '0.5rem 0', cursor: 'pointer' }}
                value={alpha === '' ? 0.01 : alpha} 
                onChange={(e) => handleAlphaChange(parseFloat(e.target.value))} 
              />
              <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
                Minimum alpha is 0.01. Higher alpha forces aggressive coefficient shrinkage.
              </small>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>{error}</div>}
            
            <button className="btn btn-primary" onClick={(e) => handleTrain(e)} disabled={isUploading || isAnimating || cooldownRemaining > 0} style={{ alignSelf: 'flex-start', padding: '1.2rem 2.5rem', fontSize: '1.3rem', fontWeight: 'bold', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center' }}>
              {isUploading ? (
                <span className="pulse" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} /> Processing Iterations...
                </span>
              ) : isAnimating ? 'Mapping Visuals...' : cooldownRemaining > 0 ? `Cooldown (${cooldownRemaining}s)...` : 'Train Model'}
            </button>
          </div>
        </div>
      </div>

      <div id="results-anchor" style={{ scrollMarginTop: '40px' }} />

      <AnimatePresence mode="wait">
        {(vizStep > 0) && (
          <motion.div 
            ref={resultsRef}
            className="card"
            key="visualization-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="card-title">Live Algorithmic Progression</h2>
            
            {/* Visual Header Timeline */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}>
               {[
                 {s: 1, text: "Data Parsed"}, 
                 {s: 2, text: "Model Mapping"}, 
                 {s: 3, text: "Lasso Shrinkage Active"}, 
                 {s: 4, text: "Final State Converged"}
               ].map((step) => (
                 <div 
                   key={step.s} 
                   onClick={() => {
                     if (!isAnimating && finalResults) setVizStep(step.s);
                   }}
                   style={{ 
                     flex: 1, textAlign: 'center', padding: '0.5rem', 
                     background: vizStep >= step.s ? 'var(--primary)' : 'transparent',
                     color: vizStep >= step.s ? 'white' : 'var(--text-muted)',
                     borderRadius: '0.5rem',
                     fontWeight: vizStep >= step.s ? '600' : '500',
                     transition: 'all 0.4s ease',
                     cursor: (!isAnimating && finalResults) ? 'pointer' : 'default',
                     opacity: (!isAnimating && finalResults) ? 1 : (vizStep === step.s ? 1 : 0.6)
                   }}>
                   {step.s}. {step.text}
                 </div>
               ))}
            </div>

            {/* Stage 1: Data Pipeline (Scatter Chart) */}
            <AnimatePresence mode="wait">
              {vizStep === 1 && (
                <motion.div key="stage1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Extracting Feature Variance...</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We map out the dimensional spread of your generic columns before mathematically linking them to {targetColumn}.</p>
                  <div style={{ height: 500, background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed var(--border-solid)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis type="number" dataKey="x" name="stdev variance" hide/>
                        <YAxis type="number" dataKey="y" name="norm map" hide/>
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip 
                          cursor={{strokeDasharray: '3 3'}} 
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-solid)' }}
                          formatter={(value, name) => [value.toFixed(2), name === 'z' ? 'Magnitude' : 'Value']}
                        />
                        <Scatter name="Data Distribution" data={mockDataVariance} fill="var(--primary)" opacity={0.9} animationDuration={2500}>
                          {mockDataVariance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 35) % 360}, 80%, 65%)`} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Stage 2: Initial Weights (Large Bar Chart) */}
              {vizStep === 2 && (
                <motion.div key="stage2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <h3 style={{ color: 'var(--tertiary)', marginBottom: '1rem' }}>Initializing Hyperplane Matrices...</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>These are the raw unregularized mathematical mappings of your features BEFORE the L1 Penalty (Alpha={alpha}) crushes the weak predictors.</p>
                  <div style={{ height: 500, background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(simulatedCoefficients).map(([n,v])=>({name: n, value: v}))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2}/>
                        <Tooltip 
                          cursor={{fill: 'var(--bg-color)', opacity: 0.4}} 
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-solid)' }}
                          formatter={(value) => [value.toFixed(4), 'Initial Weight']}
                        />
                        <XAxis dataKey="name" tick={{fontSize: 11, fill: 'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}}/>
                        <Bar dataKey="value" animationDuration={1200} radius={[6, 6, 0, 0]}>
                          {Object.entries(simulatedCoefficients).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 45) % 360}, 65%, 50%)`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Stage 3: Iteration Line Chart (Decay Path) */}
              {vizStep === 3 && (
                <motion.div key="stage3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <h3 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Applying L1 Penalty: Iterative Shrinkage...</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We simulate the descent epochs. Watch the lines drop towards 0 over iterations. Features that permanently hit 0 are permanently eliminated by the Lasso algorithm.</p>
                  
                  <div style={{ display: 'flex', gap: '2rem', height: 550 }}>
                    <div style={{ flex: 2, background: 'var(--surface-solid)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={simulatedPath.slice(0, animationStep + 1)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                          <XAxis dataKey="iteration" type="number" domain={[0, TOTAL_STEPS]} axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-solid)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)' }} 
                            labelFormatter={(label) => `Iteration ${label}`}
                            formatter={(value) => value.toFixed(4)}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          {Object.keys(simulatedCoefficients).map((key, i) => {
                            const isZeroLoc = Math.abs(finalResults.coefficients[key]) < 1e-10;
                            return (
                              <Line 
                                type="monotone" 
                                key={key} 
                                dataKey={key} 
                                stroke={isZeroLoc ? 'var(--error)' : `hsl(${(i * 45) % 360}, 65%, 50%)`} 
                                strokeWidth={isZeroLoc ? 2 : 3.5} 
                                dot={false} 
                                activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                                isAnimationActive={false}
                              />
                            )
                          })}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Simultaneous side bar chart showing live drop */}
                    <div style={{ flex: 1, background: 'var(--surface-solid)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-solid)' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>Live Frame Weights</p>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart layout="vertical" data={currentChartData} margin={{top:0, right:0, left:-20, bottom:0}}>
                          <defs>
                            <linearGradient id="colorAccent" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.9}/>
                              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.6}/>
                            </linearGradient>
                          </defs>
                          <XAxis type="number" hide/>
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10}} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-sm)', fontSize: '12px', background: 'var(--surface-solid)' }}
                            formatter={(value) => value.toFixed(4)}
                          />
                          <Bar dataKey="value" isAnimationActive={false} radius={[0, 4, 4, 0]}>
                            {currentChartData.map((e, idx) => (
                              <Cell key={`cell-${idx}`} fill={Math.abs(e.value) < 1e-2 ? 'var(--text-muted)' : 'url(#colorAccent)'} style={{ transition: 'fill 0.3s ease' }} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stage 4: Convergence Insights */}
              {vizStep === 4 && finalResults && (
                <motion.div key="stage4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--accent)' }}>
                    <h3 style={{ color: 'var(--accent)', margin: 0 }}>Model Perfectly Converged (Alpha: {alpha})</h3>
                    <p style={{ margin: 0, fontWeight: '600' }}>R² Selectivity Score: {(finalResults.metrics.r2).toFixed(4)}</p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ height: '500px', background: 'var(--surface-solid)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)' }}>
                      <p style={{ textAlign: 'center', fontWeight: '500', marginBottom: '1rem' }}>Final Feature Vector Analysis</p>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={currentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} 
                            contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-solid)' }} 
                            formatter={(value) => [value.toFixed(5), 'Final Coefficient']}
                          />
                          <ReferenceLine y={0} stroke="var(--border)" />
                          <Bar dataKey="value" animationDuration={1200} radius={[6, 6, 0, 0]}>
                            {currentChartData.map((entry, index) => {
                              const isEliminated = entry.isFinalZero;
                              let fill = 'var(--accent)'; 
                              let opacity = 1;
                              if (isEliminated) { fill = 'var(--error)'; opacity = 0.5; }
                              return <Cell key={`cell-${index}`} fill={fill} fillOpacity={opacity} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div style={{ padding: '1.5rem', background: 'var(--surface-solid)', borderRadius: '1rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-sm)' }}>
                      <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-solid)' }}>Actionable Deductions</h4>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                          Out of highly dimensional mapped variables, <strong>{finalResults.selected_features.length}</strong> core predictors were mathematically retained as structurally critical.
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                          <strong>{Object.keys(finalResults.coefficients).length - finalResults.selected_features.length}</strong> ambient noise features were successfully crushed to absolute zero by the penalty force.
                        </p>
                      </div>

                      <h5 style={{ marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 600 }}>Active Variables Highlight</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        {Object.keys(finalResults.coefficients).map((f) => {
                          const isZero = Math.abs(finalResults.coefficients[f]) < 1e-10;
                          return (
                            <span key={f} style={{ 
                              background: isZero ? 'var(--bg-color)' : 'var(--accent)', 
                              color: isZero ? 'var(--text-muted)' : 'white', 
                              padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem',
                              border: isZero ? '1px dashed var(--text-muted)' : 'none',
                              textDecoration: isZero ? 'line-through' : 'none', opacity: isZero ? 0.6 : 1,
                              transition: 'all 0.3s ease'
                            }}>
                              {f}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '2rem' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Convergence Value</th>
                          <th>System Operation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(finalResults.coefficients).map(([feature, coef]) => {
                          const isZero = Math.abs(coef) < 1e-10;
                          return (
                            <tr key={feature} className={!isZero ? "highlight-row" : ""}>
                              <td style={{ fontWeight: !isZero ? '600' : '400', color: isZero ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isZero ? 'line-through' : 'none' }}>{feature}</td>
                              <td style={{ color: isZero ? 'var(--text-muted)' : 'var(--text-main)' }}>{coef.toFixed(6)}</td>
                              <td>
                                {!isZero ? (
                                  <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Retained Predictor</span>
                                ) : (
                                  <span style={{ color: 'var(--error)', fontWeight: '600', opacity: 0.8 }}>Noise Filtered (Zeroed)</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Prediction Redirect Toast */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    style={{ 
                      marginTop: '3rem',
                      background: 'var(--surface)', 
                      backdropFilter: 'blur(16px)',
                      padding: '3rem', 
                      borderRadius: '1.5rem', 
                      border: '1px solid var(--border)', 
                      textAlign: 'center', 
                      boxShadow: 'var(--shadow-glass), 0 0 40px rgba(99, 102, 241, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div 
                      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                      transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                      style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.3,
                        backgroundImage: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                        backgroundSize: '200% 200%'
                      }}
                    />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        The model is fully trained!
                      </h3>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                        Seamlessly test live data points with your new mathematically optimized structural parameters. Step into the Prediction environment.
                      </p>
                      <Link to="/predict" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                          Go to Prediction Tab
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
