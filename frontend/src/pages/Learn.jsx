import React from 'react';
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

const Section = ({ title, children }) => (
  <section style={{ marginBottom: '3rem' }}>
    <h2 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.75rem', fontWeight: '700' }}>{title}</h2>
    <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.8' }}>
      {children}
    </div>
  </section>
);

const Learn = () => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    <div className="card" style={{ padding: '4rem' }}>
      <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>The Intuition Behind Lasso Regression</h1>
      
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem', textAlign: 'center', fontStyle: 'italic' }}>
          When working with modern datasets, we often collect everything we can. Dozens, hundreds, or even thousands of variables. But what happens when most of that data is just noise? 
        </p>

        <Section title="Why do we need something beyond standard regression?">
          <p style={{ marginBottom: '1rem' }}>
            Imagine trying to predict house prices. You gather logical data like square footage and neighborhood, but you also include the number of clouds in the sky that day and the owner's favorite color. 
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Standard linear regression tries its best to fit <em>every single variable</em> to the target, resulting in wildly convoluted models that overfit the training data and fail horribly out in the real world. That’s where Lasso comes to the rescue.
          </p>
          <p>
            Lasso is designed to simplify things. It looks at your noisy variables and, rather than letting them slightly affect the outcome, aggressively forces them to prove their worth or get thrown out entirely.
          </p>
        </Section>

        <Section title="The Magic Constraint: L1 Regularization">
          <p style={{ marginBottom: '1rem' }}>
            Lasso Regression works identically to normal regression, but with one critical rule change: it hates large coefficients. 
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Alongside trying to minimize prediction errors, the algorithm is hit with a strict mathematical budget, scientifically termed an <strong>L1 penalty</strong>. Since there's a heavy mathematical fine applied based on the absolute value of the weights, the algorithm is forced into a corner. To afford keeping the powerful predictors (like square footage), it has to literally pay the cost by zeroing-out the useless ones (like the cloudy sky).
          </p>
          <div style={{ background: 'var(--bg-color)', borderLeft: '4px solid var(--accent)', padding: '1.5rem', borderRadius: '0.5rem 1rem 1rem 0.5rem' }}>
            <strong>The Result? Automatic Feature Selection.</strong> Variables that get mathematically dropped to exactly <code style={{ color: 'var(--error)' }}>0.00</code> are officially pruned from the formula.
          </div>
        </Section>

        <Section title="Tuning the Dial: The Alpha Parameter (α)">
          <p style={{ marginBottom: '2rem' }}>
            You control exactly how harsh this penalty is using the <strong>Alpha</strong> parameter. Think of Alpha as the strictness of a bouncer at a club.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.3rem' }}>Low Alpha (Relaxed)</h4>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>The bouncer lets mostly everyone in. The model behaves almost exactly like standard linear regression with very minor shrinkage. You keep almost all your features.</p>
            </div>
            <div style={{ background: 'var(--surface-solid)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-solid)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '1.3rem' }}>High Alpha (Strict)</h4>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>The bouncer is absolutely ruthless. Coefficients rapidly collapse under the pressure. Unless a variable is undeniably critical, it gets zeroed out, leaving you with an ultra-simplified equation.</p>
            </div>
          </div>
        </Section>

        <Section title="Putting it all Together">
          <p style={{ marginBottom: '1rem' }}>
            Ultimately, Lasso isn’t just about lowering prediction errors. It’s fundamentally a high-level tool meant to bring <strong>explainability</strong> back into your science. 
          </p>
          <p>
            By crushing unnecessary noise coefficients safely into the void, you don't just stop overfitting—you walk away with a clean, readable, and deeply insightful understanding of what truly drives your target matrix. It highlights truth by removing everything else.
          </p>
        </Section>

        {/* Video Embed */}
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-solid)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--primary)', fontSize: '2rem' }}>Visual Deep Dive Overview</h3>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Looking to dive deeper into the mathematics behind the L1 penalty? Check out this excellent tutorial breakdown.</p>
          <div style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden', 
            maxWidth: '100%', 
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '8px solid white'
          }}>
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '0.5rem' }}
              src="https://www.youtube.com/embed/NGf0voTMlcs" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </div>

      </div>
    </div>
  </motion.div>
);

export default Learn;
