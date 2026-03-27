// ================================
// OpenFPV Pilot — Product Catalog Data
// ================================

export const PRODUCTS = [
  {
    id: 'hx5-frame',
    name: 'HX5 Carbon Frame',
    category: 'frames',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 142,
    badge: 'Best Seller',
    inStock: true,
    modelPath: '/models/frame_hx5.glb', // placeholder path
    thumbnail: '/textures/frame_hx5_thumb.jpg',
    images: [],
    specs: {
      'Wheelbase': '215mm',
      'Weight': '98g',
      'Material': '3K Toray Carbon',
      'Motor Mount': '16x16 / 20x20',
      'Top Plate': '2mm',
      'Bottom Plate': '4mm',
    },
    description:
      'The HX5 is our flagship 5-inch freestyle frame — ultra-stiff, ultra-light, built for maximum impact resistance. Designed by professional FPV pilots for aggressive flying.',
    features: [
      '360° motor protection',
      'Unibody bottom plate',
      'GoPro + naked cam compatible',
      'TPU mount included',
    ],
  },
  {
    id: 'nexus-2507-motor',
    name: 'Nexus 2507 Motor',
    category: 'motors',
    price: 24.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 318,
    badge: 'New',
    inStock: true,
    modelPath: '/models/motor_nexus.glb',
    thumbnail: '/textures/motor_nexus_thumb.jpg',
    images: [],
    specs: {
      'Stator': '25x7mm',
      'KV (3S)': '2450KV',
      'KV (4S)': '1900KV',
      'Weight': '30.2g',
      'Shaft': '3mm',
      'Mounting': 'M3 x 16x16',
    },
    description:
      'Precision-wound for maximum thrust-to-weight ratio. The Nexus 2507 delivers crisp response and cool running temps even during sustained full-throttle bursts.',
    features: [
      'N52H magnets',
      'Multistranded wire leads',
      'Anti-loosening nut included',
      'IPX4 moisture resistant',
    ],
  },
  {
    id: 'fc-alpha-f7',
    name: 'Alpha F7 Flight Controller',
    category: 'flight-controllers',
    price: 64.99,
    originalPrice: 79.99,
    rating: 4.7,
    reviews: 87,
    badge: 'Sale',
    inStock: true,
    modelPath: '/models/fc_alpha.glb',
    thumbnail: '/textures/fc_alpha_thumb.jpg',
    images: [],
    specs: {
      'MCU': 'STM32F745',
      'Gyro': 'ICM-42688P',
      'Barometer': 'BMP388',
      'OSD': 'AT7456E',
      'Blackbox': '16MB Flash',
      'Stack': '30.5x30.5mm',
    },
    description:
      'The Alpha F7 is our flagship flight controller featuring the latest ICM-42688P gyro for silky-smooth filtering and precise flight characteristics in any conditions.',
    features: [
      'Betaflight / iNav compatible',
      'Integrated OSD',
      'USB-C connector',
      '8x motor outputs',
    ],
  },
  {
    id: 'raptor-cam',
    name: 'Raptor FPV Camera',
    category: 'cameras',
    price: 44.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 203,
    badge: null,
    inStock: true,
    modelPath: '/models/camera_raptor.glb',
    thumbnail: '/textures/cam_raptor_thumb.jpg',
    images: [],
    specs: {
      'Sensor': '1/2" CMOS',
      'Resolution': '1200TVL',
      'FOV': '165°',
      'Latency': '<2ms',
      'Voltage': '3.3–36V',
      'Weight': '18g',
    },
    description:
      'The Raptor delivers crystal-clear, ultra-low-latency FPV imagery with exceptional dynamic range for flying in high-contrast lighting conditions.',
    features: [
      'Wide dynamic range',
      'OSD support',
      'Micro / Nano form factor',
      'Night mode capable',
    ],
  },
  {
    id: 'helix-goggles-v2',
    name: 'Helix FPV Goggles V2',
    category: 'goggles',
    price: 279.99,
    originalPrice: 329.99,
    rating: 4.9,
    reviews: 521,
    badge: 'Top Rated',
    inStock: false,
    modelPath: '/models/goggles_helix.glb',
    thumbnail: '/textures/goggles_helix_thumb.jpg',
    images: [],
    specs: {
      'Display': 'Dual 1080p OLED',
      'FOV': '46°',
      'Latency': '<18ms',
      'DVR': '1080p 60fps',
      'Battery': '2S–6S',
      'Weight': '320g',
    },
    description:
      'The Helix V2 goggles deliver an immersive flying experience with dual OLED panels, built-in DVR, and a modular receiver bay compatible with all major video systems.',
    features: [
      'Dual OLED displays',
      'Head tracking (optional)',
      'Built-in DVR',
      'HDMI input',
    ],
  },
  {
    id: 'storm-5045-props',
    name: 'Storm 5045 Propellers',
    category: 'props',
    price: 9.99,
    originalPrice: null,
    rating: 4.5,
    reviews: 412,
    badge: null,
    inStock: true,
    modelPath: '/models/props_storm.glb',
    thumbnail: '/textures/props_storm_thumb.jpg',
    images: [],
    specs: {
      'Size': '5 inch',
      'Pitch': '4.5',
      'Blades': 'Tri-blade',
      'Hub': 'T-mount',
      'Weight': '4.8g each',
      'Material': 'PC + Glass Fiber',
    },
    description:
      'Engineered for freestyle pilots who demand maximum efficiency and durability. The Storm 5045 provides excellent punch-out performance and smooth throttle response.',
    features: [
      'CNC balanced',
      'Impact resistant',
      'Multi-pack (8 props)',
      'Works with 2207–2306 motors',
    ],
  },
]

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id)

export const getProductsByCategory = (category) => {
  if (category === 'all') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === category)
}
