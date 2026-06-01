import { CalendarCheck, BrainCircuit, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIMARY = 'var(--color-primary)';
const BG = '#0d1117';
const SURFACE = 'var(--land-surface-2)';
const TEXT = 'var(--land-text)';
const MUTED = 'var(--land-text-muted)';
const DIM = 'var(--land-text-dim)';
const BORDER = 'var(--land-border)';
const FONT_DISPLAY = 'var(--font-display)';
const FONT_MONO = 'var(--font-mono)';
const FONT_BODY = 'var(--font-body)';

const features = [
  {
    num: '01',
    Icon: CalendarCheck,
    title: 'Company Portal',
    description: 'Centralized dashboard for managing job descriptions, candidates, and interviews. Set custom assessment criteria, define scoring rubrics, and track every candidate through your pipeline.',
    detail: 'dashboard / pipeline / criteria',
  },
  {
    num: '02',
    Icon: BrainCircuit,
    title: 'AI-Powered Questions',
    description: 'Automatically generate tailored questions based on job descriptions, candidate resumes, and specific skill requirements. Every interview feels made-to-order.',
    detail: 'generation / personalization / scoring',
  },
  {
    num: '03',
    Icon: ShieldCheck,
    title: 'Secure Assessment',
    description: 'Video proctoring, identity verification, and anti-plagiarism measures ensure every evaluation is fair, consistent, and tamper-resistant.',
    detail: 'proctoring / verification / integrity',
  },
];

export function FeaturesSection() {
  return (
    <section style={{ background: BG, padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle top border glow */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.2), transparent)',
      }} />

      <div className="container mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '5rem' }}
        >
          <div className="land-tag" style={{ marginBottom: '20px' }}>Core Features</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 800,
            color: TEXT,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Built for technical teams
          </h2>
          <p style={{ fontFamily: FONT_BODY, color: MUTED, fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Every feature crafted to reduce hiring friction and surface the right candidates.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {features.map(({ num, Icon, title, description, detail }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ background: 'rgba(255,255,255,0.022)' }}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '32px',
                alignItems: 'center',
                padding: '36px 32px',
                borderRadius: '14px',
                border: `1px solid ${BORDER}`,
                marginBottom: '12px',
                cursor: 'default',
                transition: 'border-color 0.25s, background 0.25s',
              }}
              className="flex-col sm:grid"
            >
              {/* Number */}
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: '13px',
                fontWeight: 500,
                color: PRIMARY,
                opacity: 0.8,
                letterSpacing: '0.06em',
              }}>
                {num}
              </div>

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '9px',
                    background: 'rgba(45,212,191,0.08)',
                    border: '1px solid rgba(45,212,191,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} style={{ color: PRIMARY }} />
                  </div>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: TEXT,
                    margin: 0,
                  }}>
                    {title}
                  </h3>
                </div>
                <p style={{
                  fontFamily: FONT_BODY,
                  color: MUTED,
                  fontSize: '15px',
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: '560px',
                }}>
                  {description}
                </p>
              </div>

              {/* Detail tag */}
              <div
                className="hidden md:block"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: '10px',
                  color: DIM,
                  textAlign: 'right',
                  lineHeight: 1.9,
                  letterSpacing: '0.04em',
                }}
              >
                {detail.split(' / ').map((d, j) => (
                  <div key={j}>{d}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom divider glow */}
        <div style={{
          marginTop: '4rem',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.15), transparent)',
        }} />
      </div>
    </section>
  );
}
