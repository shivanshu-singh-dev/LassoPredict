import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Download from './pages/Download';
import Prediction from './pages/Prediction';
import DevelopedBy from './pages/DevelopedBy';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/download" element={<Download />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/developed-by" element={<DevelopedBy />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
