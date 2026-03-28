// ================================
// Component — Builder
// ================================

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import PageWrapper from '@components/layout/PageWrapper'
import styles from './Builder.module.css'

const PRESETS = {
  cinewhoop: {
    frameSize: '2.5 inch',
    frameType: 'Cinewhoop (Ducted)',
    frameMaterial: 'Injection Molded Plastic',
    cameraType: 'Walksnail Avatar HD',
    cameraBrand: 'Caddx',
    motorBrand: 'EMAX',
    motorSpeed: '14000KV',
    propSize: '2.5 inch',
    propMaterial: 'Polycarbonate',
    stackSize: '25.5x25.5mm (AIO)',
    batteryCell: '4S',
    radioProtocol: 'ExpressLRS (ELRS) 2.4GHz',
    rangeBooster: 'None',
    goggles: 'Walksnail Avatar Goggles X'
  },
  freestyle: {
    frameSize: '5 inch',
    frameType: 'Freestyle X',
    frameMaterial: 'Carbon Fiber',
    cameraType: 'DJI O3 Air Unit',
    cameraBrand: 'DJI',
    motorBrand: 'XING',
    motorSpeed: '1800KV',
    propSize: '5.1 inch',
    propMaterial: 'Polycarbonate',
    stackSize: '30.5x30.5mm',
    batteryCell: '6S',
    radioProtocol: 'ExpressLRS (ELRS) 868/915MHz',
    rangeBooster: '1W Micro TX Module',
    goggles: 'DJI Goggles 2 / Integra'
  }
}

export default function Builder() {
  const [activeStep, setActiveStep] = useState(0)

  // Builder State
  const [config, setConfig] = useState({
    preset: null,
    frameSize: '5 inch',
    frameType: 'Freestyle X',
    frameMaterial: 'Carbon Fiber',
    cameraType: 'Analog',
    cameraBrand: 'Caddx',
    motorBrand: 'XING',
    motorSpeed: '1800KV',
    propSize: '5.1 inch',
    propMaterial: 'Polycarbonate',
    stackSize: '30x30mm',
    batteryCell: '6S',
    radioProtocol: 'ELRS 2.4GHz',
    rangeBooster: 'None',
    goggles: 'Analog Diversity',
  })

  const handleSelect = (key, val) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: val }
      // Auto-update prop size and stack size based on frame size change
      if (key === 'frameSize') {
        next.propSize = val
        if (val === '1.6 inch' || val === '2 inch' || val === '2.5 inch') {
          next.stackSize = '16x16mm (Whoop)'
          next.batteryCell = '2S'
          next.motorSpeed = '14000KV'
        } else if (val === '3 inch' || val === '3.5 inch') {
          next.stackSize = '20x20mm'
          next.batteryCell = '4S'
          next.motorSpeed = '4000KV'
        } else if (val === '5 inch' || val === '5.1 inch') {
          next.stackSize = '30.5x30.5mm'
          next.batteryCell = '6S'
          next.motorSpeed = '1800KV'
        } else if (val === '7 inch' || val === '10 inch') {
          next.stackSize = '30.5x30.5mm'
          next.batteryCell = '6S'
          next.motorSpeed = '1300KV'
        }
      }
      return next
    })
  }

  // Dynamic Options Definitions
  const OPTIONS = {
    frameSize: ['1.6 inch', '2 inch', '2.5 inch', '3 inch', '3.5 inch', '5 inch', '5.1 inch', '7 inch', '10 inch', '15 inch'],
    frameType: ['Freestyle X', 'Deadcat', 'Cinewhoop (Ducted)', 'Racing X', 'Long Range X'],
    frameMaterial: ['Carbon Fiber', 'Injection Molded Plastic'],
    cameraType: ['Analog', 'DJI O3 Air Unit', 'Walksnail Avatar HD', 'HDZero'],
    cameraBrand: ['Caddx', 'RunCam', 'Foxeer', 'DJI'],
    motorBrand: ['XING', 'T-Motor', 'RCINPOWER', 'EMAX', 'BrotherHobby'],
    motorSpeed: ['1300KV', '1500KV', '1800KV', '1960KV', '2400KV', '2750KV', '4000KV', '14000KV'],
    propSize: ['1.6 inch', '2 inch', '2.5 inch', '3 inch', '3.5 inch', '5 inch', '5.1 inch', '7 inch', '10 inch'],
    propMaterial: ['Polycarbonate', 'Carbon Composite', 'Glass Fiber Nylon'],
    stackSize: ['16x16mm (Whoop)', '20x20mm', '25.5x25.5mm (AIO)', '30.5x30.5mm'],
    batteryCell: ['1S', '2S', '3S', '4S', '6S', '8S'],
    radioProtocol: ['ExpressLRS (ELRS) 2.4GHz', 'ExpressLRS (ELRS) 900MHz', 'TBS Crossfire', 'TBS Tracer', 'FrSky'],
    rangeBooster: ['None', '1W Micro TX Module', '2W Full Size TX Module'],
    goggles: ['Analog Diversity', 'DJI Goggles 2 / Integra', 'Walksnail Avatar Goggles X', 'HDZero Goggles'],
  }

  const steps = [
    { title: 'Frame Base', fields: ['frameSize', 'frameType', 'frameMaterial'] },
    { title: 'Motors & Props', fields: ['motorBrand', 'motorSpeed', 'propSize', 'propMaterial'] },
    { title: 'Video System', fields: ['cameraType', 'cameraBrand', 'goggles'] },
    { title: 'Electronics', fields: ['stackSize', 'batteryCell'] },
    { title: 'Control Link', fields: ['radioProtocol', 'rangeBooster'] },
  ]

  const calculateTotal = () => {
    let base = 150 // FC+ESC+RadioRX
    // Add Frame Cost
    if (config.frameSize.includes('7') || config.frameSize.includes('10')) base += 80
    else if (config.frameSize.includes('5')) base += 50
    else base += 35
    // Add Video Cost
    if (config.cameraType === 'DJI O3 Air Unit') base += 229
    else if (config.cameraType === 'Walksnail Avatar HD') base += 140
    else if (config.cameraType === 'HDZero') base += 120
    else base += 40
    // Add Motors Cost
    base += 80 
    // Add Battery Target Cost
    if (config.batteryCell === '6S') base += 35
    else if (config.batteryCell === '4S') base += 25
    else base += 10

    return base
  }

  const calculateThrust = () => {
    if (config.frameSize.includes('10') || config.frameSize.includes('7')) return '~3.5kg - 5kg (Cinematic Lift)'
    if (config.frameSize.includes('5')) return '~2kg - 3kg (Aggressive Freestyle)'
    if (config.frameSize.includes('3')) return '~800g (Park Flyer)'
    return '~150g (Indoor/Micro)'
  }

  const invoiceRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!invoiceRef.current) return
    setIsExporting(true)

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
      
      // Watermark
      pdf.setTextColor(150, 150, 150)
      pdf.setFontSize(10)
      pdf.text('Generated by OpenFPV_Pilot — Free Open-Source Learning Platform', 10, pdf.internal.pageSize.getHeight() - 10)

      pdf.save(`OpenFPV_Quote_${config.frameSize.replace(' ', '')}_${config.cameraType.replace(' ', '')}.pdf`)
    } catch (err) {
      console.error('PDF Export failed', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <PageWrapper fullHeight>
      <div className={styles.layout}>
        {/* LEFT: Configurator Controls */}
        <div className={styles.configurator}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>// Setup Wizard</p>
            <h1 className={styles.title}>FPV Quote <span className="gradient-text">Builder</span></h1>
            <p className={styles.sub}>Design your custom drone from scratch and export a complete parts list.</p>
          </header>

          {/* PRESETS SECTION */}
          <div className={styles.presetSection}>
            <p className={styles.presetTitle}>Quick Start Presets:</p>
            <div className={styles.presetGrid}>
              <button 
                className={styles.presetBtn}
                onClick={() => setConfig({ ...PRESETS.cinewhoop, preset: 'cinewhoop' })}
              >
                🚁 Beginner Cinewhoop (Indoor/Park)
              </button>
              <button 
                className={styles.presetBtn}
                onClick={() => setConfig({ ...PRESETS.freestyle, preset: 'freestyle' })}
              >
                ⚡ 5" Bando Freestyle (Aggressive)
              </button>
            </div>
          </div>

          <div className={styles.progressTracker}>
            {steps.map((s, i) => (
              <button
                key={i}
                className={`${styles.stepDot} ${activeStep === i ? styles.activeDot : ''}`}
                onClick={() => setActiveStep(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className={styles.stepContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={styles.stepTitle}>{steps[activeStep].title}</h2>
                {/* Temporary placeholder for options */}
                <div className={styles.optionsGrid}>
                  {steps[activeStep].fields.map((field) => (
                    <div key={field} className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>{field}</label>
                      <select 
                        className={styles.fieldSelect} 
                        value={config[field]} 
                        onChange={(e) => handleSelect(field, e.target.value)}
                      >
                        <option value={config[field]}>{config[field]}</option>
                        {OPTIONS[field]?.filter(opt => opt !== config[field]).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.navButtons}>
            <button 
              className={styles.ghostBtn} 
              disabled={activeStep === 0} 
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            >
              ← Back
            </button>
            <button 
              className={styles.primaryBtn} 
              disabled={activeStep === steps.length - 1} 
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* RIGHT: Live Invoice / PDF Preview */}
        <aside className={styles.invoicePanel}>
          <div className={styles.invoiceInner} ref={invoiceRef}>
            <h3 className={styles.invoiceTitle}>Build Specification</h3>
            
            <ul className={styles.invoiceList}>
              {Object.entries(config)
                .filter(([k, v]) => k !== 'preset' && v !== null)
                .map(([key, val]) => (
                  <li key={key} className={styles.invoiceRow}>
                    <span className={styles.invoiceKey}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className={styles.invoiceVal}>{val}</span>
                  </li>
              ))}
            </ul>

            <div className={styles.performanceBox}>
              <p className={styles.perfLabel}>Est. Thrust Output</p>
              <p className={styles.perfVal}>{calculateThrust()}</p>
            </div>

            <div className={styles.invoiceTotal}>
              <span>Est. Total Cost</span>
              <span className="gradient-text">${calculateTotal()}</span>
            </div>

            <button 
              className={styles.exportBtn} 
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? 'Generating PDF...' : '⬇ Export to PDF'}
            </button>
          </div>
        </aside>
      </div>
    </PageWrapper>
  )
}
