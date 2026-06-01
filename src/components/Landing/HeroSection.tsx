import { ArrowRight, BarChart, Users, BrainCircuit, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIMARY = 'var(--color-primary)';
const BG = 'var(--land-bg)';
const SURFACE = 'var(--land-surface)';
const TEXT = 'var(--land-text)';
const MUTED = 'var(--land-text-muted)';
const DIM = 'var(--land-text-dim)';
const BORDER = 'var(--land-border)';
const FONT_DISPLAY = 'var(--font-display)';
const FONT_MONO = 'var(--font-mono)';
const FONT_BODY = 'var(--font-body)';

const codeLines = [
  { indent: 0, tokens: [{ c: '#6b7a8d', t: '# AI evaluation in progress' }] },
  { indent: 0, tokens: [{ c: '#79c0ff', t: 'candidate' }, { c: '#6b7a8d', t: ' = ' }, { c: PRIMARY, t: '"Alex Chen"' }] },
  { indent: 0, tokens: [{ c: '#79c0ff', t: 'role' }, { c: '#6b7a8d', t: ' = ' }, { c: PRIMARY, t: '"Senior Engineer"' }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ c: '#ff7b72', t: 'result' }, { c: '#6b7a8d', t: ' = ai.evaluate(' }] },
  { indent: 1, tokens: [{ c: '#6b7a8d', t: 'coding_score=' }, { c: '#79c0ff', t: '94' }, { c: '#6b7a8d', t: ',' }] },
  { indent: 1, tokens: [{ c: '#6b7a8d', t: 'system_design=' }, { c: '#79c0ff', t: '87' }, { c: '#6b7a8d', t: ',' }] },
  { indent: 1, tokens: [{ c: '#6b7a8d', t: 'behavioral=' }, { c: '#79c0ff', t: '91' }] },
  { indent: 0, tokens: [{ c: '#6b7a8d', t: ')' }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [
    { c: '#6b7a8d', t: '▶ ' },
    { c: PRIMARY, t: '{ status: "HIRE", confidence: 0.95 }' }
  ]},
];

export function HeroSection() {
  return (
    <section style={{ background: BG, minHeight: 'calc(100vh - 4rem)', position: 'relative', overflow: 'hidden' }}>
      {/* Dot grid */}
      <div
        className="land-dot-grid"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '30%',
        width: '700px', height: '400px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.07) 0%, transparent 70%)',
      }} />

      <div
        className="container mx-auto px-4 md:px-8"
        style={{ position: 'relative', paddingTop: '6rem', paddingBottom: '4rem' }}
      >
        {/* Two-column hero */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              className="land-tag"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{ marginBottom: '28px', display: 'inline-flex' }}
            >
              <Sparkles size={11} />
              AI-Powered Interviews
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
                fontWeight: 800,
                lineHeight: 1.06,
                color: TEXT,
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              Hire the best<br />
              <span style={{ color: PRIMARY }}>technical talent</span>
              <br />
              with AI precision
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              style={{
                fontFamily: FONT_BODY,
                color: MUTED,
                fontSize: '1.1rem',
                lineHeight: 1.75,
                marginBottom: '40px',
                maxWidth: '500px',
              }}
              className="mx-auto lg:mx-0"
            >
              Automate your technical hiring pipeline with AI-driven coding challenges,
              system design evaluations, and behavioral assessments — all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <motion.button
                className="land-btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started <ArrowRight size={15} />
              </motion.button>
              <motion.button
                className="land-btn-ghost"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </div>

          {/* Right: terminal card */}
          <motion.div
            className="flex-1 w-full max-w-xl relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
          >
            {/* Terminal window */}
            <div
              className="land-card"
              style={{
                background: SURFACE,
                boxShadow: '0 0 80px rgba(45,212,191,0.06), 0 32px 64px rgba(0,0,0,0.55)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              {/* Title bar */}
              <div style={{
                padding: '12px 18px',
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: '11px', color: DIM }}>
                  interview_eval.py
                </span>
              </div>

              {/* Code body */}
              <div style={{ padding: '22px 24px', fontFamily: FONT_MONO, fontSize: '13px', lineHeight: 2 }}>
                {codeLines.map((line, i) => (
                  <div key={i} style={{ paddingLeft: line.indent * 20, minHeight: '1.6em' }}>
                    {line.tokens.map((tok, j) => (
                      <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge: 70% */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '-18px', right: '-16px',
                background: 'rgba(45,212,191,0.12)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(45,212,191,0.28)',
                borderRadius: '12px',
                padding: '14px 18px',
                textAlign: 'center',
                zIndex: 10,
              }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: '26px', fontWeight: 800, color: PRIMARY, lineHeight: 1 }}>70%</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: '10px', color: MUTED, marginTop: '4px' }}>faster hiring</div>
            </motion.div>

            {/* Floating badge: 25K+ */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1.2 }}
              style={{
                position: 'absolute', bottom: '-18px', left: '-16px',
                background: 'rgba(13,17,23,0.92)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${BORDER}`,
                borderRadius: '12px',
                padding: '14px 18px',
                textAlign: 'center',
                zIndex: 10,
              }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: '26px', fontWeight: 800, color: TEXT, lineHeight: 1 }}>25K+</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: '10px', color: MUTED, marginTop: '4px' }}>monthly evals</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            marginTop: '5rem',
            borderTop: `1px solid ${BORDER}`,
            borderRadius: '16px',
          }}
        >
          {[
            { value: '70%', label: 'Time Saved', sub: 'vs. traditional methods', Icon: BarChart },
            { value: '500+', label: 'Companies', sub: 'across the globe', Icon: Users },
            { value: '25K+', label: 'Evaluations', sub: 'monthly interviews', Icon: BrainCircuit },
          ].map(({ value, label, sub, Icon }, i) => (
            <motion.div
              key={i}
              whileHover={{ background: 'rgba(255,255,255,0.025)' }}
              style={{
                display: 'flex', gap: '16px', alignItems: 'center',
                padding: '28px 24px',
                borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
                cursor: 'default',
                borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : undefined,
                transition: 'background 0.2s',
              }}
            >
              <Icon size={20} style={{ color: PRIMARY, opacity: 0.7, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: '1.9rem', fontWeight: 800, color: TEXT, lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: FONT_BODY, color: 'rgba(238,242,247,0.75)', fontSize: '14px', fontWeight: 600, marginTop: '5px' }}>{label}</div>
                <div style={{ fontFamily: FONT_MONO, color: DIM, fontSize: '11px', marginTop: '2px' }}>{sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
