import { Code, Zap, FileText, BrainCircuit, MonitorPlay, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIMARY = 'var(--color-primary)';
const SECONDARY = 'var(--color-secondary)';
const BG = 'var(--land-bg)';
const SURFACE = 'var(--land-surface)';
const TEXT = 'var(--land-text)';
const MUTED = 'var(--land-text-muted)';
const DIM = 'var(--land-text-dim)';
const BORDER = 'var(--land-border)';
const FONT_DISPLAY = 'var(--font-display)';
const FONT_MONO = 'var(--font-mono)';
const FONT_BODY = 'var(--font-body)';

const assessments = [
  {
    Icon: Code,
    title: 'Coding Challenges',
    description: 'DSA problems with real-time execution in our integrated IDE. Supports 20+ languages with live output.',
    accent: PRIMARY,
    large: true,
  },
  {
    Icon: Zap,
    title: 'System Design',
    description: 'Interactive whiteboard for architectural diagrams with AI transcription and analysis.',
    accent: SECONDARY,
    large: true,
  },
  {
    Icon: FileText,
    title: 'Knowledge-Based',
    description: 'Custom questions based on candidate resume and role requirements.',
    accent: PRIMARY,
    large: false,
  },
  {
    Icon: BrainCircuit,
    title: 'Framework-Specific',
    description: 'Questions tailored to specific languages, frameworks, and tooling.',
    accent: SECONDARY,
    large: false,
  },
  {
    Icon: MonitorPlay,
    title: 'Behavioral',
    description: 'Video recording with speech-to-text and sentiment analysis.',
    accent: PRIMARY,
    large: false,
  },
  {
    Icon: BarChart,
    title: 'Detailed Reporting',
    description: 'Automated performance analysis with skill insights and hiring signals.',
    accent: SECONDARY,
    large: false,
  },
];

export function AssessmentTypesSection() {
  return (
    <section style={{ background: BG, padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="container mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '4rem' }}
        >
          <div className="land-tag" style={{ marginBottom: '20px' }}>Assessment Types</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 800,
            color: TEXT,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Comprehensive evaluation
          </h2>
          <p style={{ fontFamily: FONT_BODY, color: MUTED, fontSize: '1.1rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Evaluate candidates across every dimension that matters.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: '14px' }}
        >
          {/* Two large cards span full height in first two columns on lg */}
          {assessments.map(({ Icon, title, description, accent, large }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className={`land-card ${large ? 'lg:row-span-2' : ''}`}
              style={{
                padding: large ? '36px 32px' : '28px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'default',
              }}
            >
              {/* Icon */}
              <div style={{
                width: large ? 48 : 40,
                height: large ? 48 : 40,
                borderRadius: '11px',
                background: `rgba(var(--tw-color-accent-rgb, 45,212,191), 0.07)`,
                backgroundImage: `radial-gradient(circle at 30% 30%, ${accent}18, transparent 70%)`,
                border: `1px solid ${accent}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={large ? 22 : 18} style={{ color: accent }} />
              </div>

              {/* Text */}
              <div>
                <h3 style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: large ? '1.25rem' : '1.05rem',
                  fontWeight: 700,
                  color: TEXT,
                  marginBottom: '8px',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: FONT_BODY,
                  color: MUTED,
                  fontSize: '14px',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {description}
                </p>
              </div>

              {/* Bottom accent line for large cards */}
              {large && (
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '20px',
                  borderTop: `1px solid ${BORDER}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 0 8px ${accent}`,
                  }} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: '10px', color: DIM, letterSpacing: '0.05em' }}>
                    LIVE EVALUATION
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
