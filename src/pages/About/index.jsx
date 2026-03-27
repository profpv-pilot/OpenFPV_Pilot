// ================================
// Page — About
// ================================

import { motion } from 'framer-motion'
import PageWrapper from '@components/layout/PageWrapper'
import { APP_NAME, APP_DESCRIPTION } from '@config/constants'
import styles from './About.module.css'

const TEAM = [
  { name: 'Aiden Flux', role: 'Lead Pilot & Founder', glph: '◎' },
  { name: 'Maya Cruz', role: 'Hardware Engineer', glph: '◈' },
  { name: 'Sam Vector', role: 'CX & Community', glph: '✦' },
]

const VALUES = [
  { icon: '⚡', title: 'Performance First', desc: 'Every product is tested by professional pilots in real-world conditions.' },
  { icon: '🔩', title: 'Engineering Depth', desc: 'We go deep on specs so you can make the right build decisions.' },
  { icon: '🌍', title: 'Community Driven', desc: 'Our catalog is shaped by feedback from 12,000+ pilots worldwide.' },
]

export default function About() {
  return (
    <PageWrapper>
      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className={styles.eyebrow}>// About Us</p>
              <h1 className={styles.title}>Built for Pilots,<br />by <span className="gradient-text">Pilots</span></h1>
              <p className={styles.sub}>{APP_DESCRIPTION}</p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className={`section ${styles.valuesSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.valuesGrid}>
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  className={styles.valueCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className={styles.valueIcon}>{v.icon}</span>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className={`section ${styles.teamSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>The Team</h2>
            <div className={styles.teamGrid}>
              {TEAM.map((m, i) => (
                <motion.div
                  key={m.name}
                  className={styles.teamCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className={styles.avatar}>{m.glph}</div>
                  <h3 className={styles.memberName}>{m.name}</h3>
                  <p className={styles.memberRole}>{m.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
