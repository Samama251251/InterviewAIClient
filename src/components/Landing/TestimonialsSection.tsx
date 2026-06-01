import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIMARY = 'var(--color-primary)';
const BG = '#0d1117';
const TEXT = 'var(--land-text)';
const MUTED = 'var(--land-text-muted)';
const DIM = 'var(--land-text-dim)';
const BORDER = 'var(--land-border)';
const FONT_DISPLAY = 'var(--font-display)';
const FONT_MONO = 'var(--font-mono)';
const FONT_BODY = 'var(--font-body)';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'TechCorp',
    avatar: 'https://picsum.photos/200/200?random=1',
    quote: 'This platform has cut our hiring time in half while improving the quality of our technical hires. The automated question generation is spot on.',
  },
  {
    name: 'Michael Chen',
    role: 'HR Director',
    company: 'DataWave',
    avatar: 'https://picsum.photos/200/200?random=2',
    quote: "The behavioral assessment module gives us insights we couldn't get from traditional interviews. It's like having an expert interviewer on staff 24/7.",
    featured: true,
  },
  {
    name: 'Jessica Lee',
    role: 'Engineering Manager',
    company: 'BuildFast',
    avatar: 'https://picsum.photos/200/200?random=3',
    quote: 'Our candidates love the fairness and consistency of the platform. The system design whiteboard is exceptional for evaluating senior engineers.',
  },
];

export function TestimonialsSection() {
  return (
    <section style={{ background: BG, padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Top border glow */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.18), transparent)',
      }} />
      {/* Bottom border glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.1), transparent)',
      }} />

      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '4rem' }}
        >
          <div className="land-tag" style={{ marginBottom: '20px' }}>Testimonials</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            fontWeight: 800,
            color: TEXT,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}>
            Trusted by hiring teams
          </h2>
          <p style={{ fontFamily: FONT_BODY, color: MUTED, fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
            See what engineering leaders say about InterviewAI.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px', alignItems: 'start' }}>
          {testimonials.map(({ name, role, company, avatar, quote, featured }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="land-card"
              style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                cursor: 'default',
                marginTop: i === 1 ? '0' : '20px',
                ...(featured ? {
                  borderColor: 'rgba(45,212,191,0.22)',
                  boxShadow: '0 0 40px rgba(45,212,191,0.07)',
                } : {}),
              }}
            >
              {/* Quote icon */}
              <Quote size={22} style={{ color: PRIMARY, opacity: 0.6 }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0,1,2,3,4].map(s => (
                  <Star key={s} size={13} style={{ color: PRIMARY, fill: 'var(--color-primary)' }} />
                ))}
              </div>

              {/* Quote text */}
              <p style={{
                fontFamily: FONT_BODY,
                color: TEXT,
                fontSize: '15px',
                lineHeight: 1.8,
                margin: 0,
                fontStyle: 'italic',
                opacity: 0.88,
              }}>
                "{quote}"
              </p>

              {/* Divider */}
              <div style={{ height: '1px', background: BORDER }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={avatar}
                  alt={name}
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    border: `1px solid ${BORDER}`,
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '14px', color: TEXT }}>{name}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: '11px', color: DIM, marginTop: '2px' }}>
                    {role} · {company}
                  </div>
                </div>
                {featured && (
                  <div style={{
                    marginLeft: 'auto',
                    fontFamily: FONT_MONO,
                    fontSize: '9px',
                    color: PRIMARY,
                    background: 'rgba(45,212,191,0.08)',
                    border: '1px solid rgba(45,212,191,0.2)',
                    borderRadius: '100px',
                    padding: '3px 9px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    Featured
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
