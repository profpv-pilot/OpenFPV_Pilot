// ================================
// Page — Home
// ================================

import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '@components/layout/PageWrapper'
import SceneCanvas from '@components/three/SceneCanvas'
import DroneModel from '@components/three/DroneModel'
import ProductCard from '@components/ui/ProductCard'
import { PRODUCTS } from '@data/products'
import styles from './Home.module.css'

const FEATURED = PRODUCTS.slice(0, 3)

const STATS = [
  { value: '500+', label: 'Products' },
  { value: '12K+', label: 'Pilots' },
  { value: '4.9★', label: 'Avg Rating' },
  { value: '48h', label: 'Shipping' },
]

export default function Home() {
  return (
    <PageWrapper fullHeight>
      {/* ======= HERO ======= */}
      <section className={styles.hero}>
        {/* 3D Canvas Background */}
        <div className={styles.canvasArea}>
          <Suspense fallback={null}>
            <SceneCanvas stars animateLights height="100%" orbit autoRotate>
              <DroneModel autoRotate={false} scale={1.2} floatAmplitude={0.1} />
            </SceneCanvas>
          </Suspense>
        </div>

        {/* Grid overlay */}
        <div className={styles.grid} aria-hidden="true" />

        {/* Hero Content */}
        <div className={`container ${styles.heroContent}`} style={{ pointerEvents: 'none' }}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className={styles.eyebrow}>// Professional FPV Hardware</p>
            <h1 className={styles.headline}>
              Fly Beyond<br />
              <span className="gradient-text">Limits</span>
            </h1>
            <p className={styles.sub}>
              Premium drone components, expert-curated builds, and immersive 3D product
              exploration — all in one place.
            </p>
            <div className={styles.heroActions} style={{ pointerEvents: 'auto' }}>
              <Link to="/catalog" className={styles.primaryBtn}>
                Shop Catalog
              </Link>
              <Link to="/about" className={styles.ghostBtn}>
                Learn More →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </section>

      {/* ======= STATS ======= */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FEATURED PRODUCTS ======= */}
      <section className={`section ${styles.featuredSection}`}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={styles.sectionEyebrow}>// Top Picks</p>
            <h2 className={styles.sectionTitle}>Featured Gear</h2>
            <p className={styles.sectionSub}>
              Hand-selected by professional FPV pilots for performance and reliability.
            </p>
          </motion.div>

          <div className={styles.productGrid}>
            {FEATURED.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className={styles.catalogCta}>
            <Link to="/catalog" className={styles.primaryBtn}>
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ======= CTA BANNER ======= */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container">
          <motion.div
            className={styles.bannerInner}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.bannerTitle}>
              Ready to <span className="gradient-text">Take Flight?</span>
            </h2>
            <p className={styles.bannerSub}>
              Join 12,000+ pilots who trust OpenFPV Pilot for their builds.
            </p>
            <Link to="/catalog" className={styles.primaryBtn}>
              Explore Products
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
