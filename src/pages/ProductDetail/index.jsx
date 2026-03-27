// ================================
// Page — Product Detail
// ================================

import { Suspense } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '@components/layout/PageWrapper'
import SceneCanvas from '@components/three/SceneCanvas'
import DroneModel from '@components/three/DroneModel'
import { getProductById } from '@data/products'
import { formatPrice } from '@lib/utils'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)

  if (!product) {
    return (
      <PageWrapper>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
          <Link to="/catalog" className={styles.backBtn}>← Back to Catalog</Link>
        </div>
      </PageWrapper>
    )
  }

  const { name, category, price, originalPrice, rating, reviews, badge, inStock,
    description, specs, features, modelPath } = product

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  return (
    <PageWrapper>
      <div className={styles.page}>
        {/* Breadcrumb */}
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/catalog">Catalog</Link>
            <span aria-hidden="true"> / </span>
            <span>{name}</span>
          </nav>
        </div>

        {/* Main */}
        <div className="container">
          <div className={styles.layout}>
            {/* 3D Viewer */}
            <motion.div
              className={styles.viewer}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Suspense fallback={<div className={styles.viewerLoading}>Loading 3D Model…</div>}>
                <SceneCanvas orbit stars={false} height="500px" animateLights autoRotate>
                  <DroneModel modelPath={modelPath} autoRotate={false} scale={1.2} />
                </SceneCanvas>
              </Suspense>
              <p className={styles.viewerHint}>🖱 Drag to rotate · Scroll to zoom</p>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className={styles.info}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {badge && <span className={styles.badge}>{badge}</span>}
              <p className={styles.category}>{category.replace(/-/g, ' ')}</p>
              <h1 className={styles.name}>{name}</h1>

              {/* Rating */}
              <div className={styles.ratingRow}>
                {[1,2,3,4,5].map((n) => (
                  <span key={n} className={`${styles.star} ${n <= Math.round(rating) ? styles.filled : ''}`}>★</span>
                ))}
                <span className={styles.ratingVal}>{rating.toFixed(1)}</span>
                <span className={styles.reviewCount}>({reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(price)}</span>
                {originalPrice && <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>}
                {discount && <span className={styles.discount}>-{discount}%</span>}
              </div>

              {/* Stock */}
              <p className={`${styles.stock} ${inStock ? styles.inStock : styles.outOfStock}`}>
                {inStock ? '✓ In Stock — Ships within 48 hours' : '✗ Out of Stock'}
              </p>

              <p className={styles.description}>{description}</p>

              {/* Features */}
              <ul className={styles.features}>
                {features.map((f) => (
                  <li key={f}>
                    <span className={styles.featureIcon}>→</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={styles.ctas}>
                <button
                  className={styles.addToCart}
                  disabled={!inStock}
                  aria-label={`Add ${name} to cart`}
                >
                  {inStock ? 'Add to Cart' : 'Notify Me'}
                </button>
                <button className={styles.wishlist} aria-label="Add to wishlist">♡</button>
              </div>
            </motion.div>
          </div>

          {/* Specs Table */}
          <motion.section
            className={styles.specSection}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.specTitle}>Specifications</h2>
            <div className={styles.specTable}>
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className={styles.specRow}>
                  <span className={styles.specKey}>{key}</span>
                  <span className={styles.specVal}>{val}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <Link to="/catalog" className={styles.backLink}>← Back to Catalog</Link>
        </div>
      </div>
    </PageWrapper>
  )
}
