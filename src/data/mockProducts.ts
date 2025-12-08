/**
 * ============================================
 * ZAVO - Mock Products Data
 * ============================================
 * 
 * Datos de ejemplo para los diferentes tipos
 * de productos de ZAVO
 */

import { Product, MysteryBag, RegularProduct, DailyDeal, ExpiringSoon, SeasonalPack } from '../types/products'

// ============================================
// MYSTERY BAGS - Bolsas Sorpresa
// ============================================

export const mysteryBags: MysteryBag[] = [
  {
    id: 'mb-001',
    businessId: 'biz-001',
    businessName: 'Panadería El Buen Pan',
    businessLogo: '/logos/panaderia.png',
    name: 'Bolsa Sorpresa de Panadería',
    description: 'Deliciosos panes, pasteles y productos de panadería del día. ¡Nunca sabes qué encontrarás!',
    type: 'mystery_bag',
    category: 'panaderia',
    status: 'active',
    originalPrice: 25000,
    discountPrice: 9900,
    discountPercentage: 60,
    quantity: 10,
    quantitySold: 7,
    images: ['/images/mystery-bakery.jpg'],
    location: {
      address: 'Calle 85 #15-20, Bogotá',
      lat: 4.6682,
      lng: -74.0816,
      distance: 1.2
    },
    pickupWindow: {
      start: '17:00',
      end: '20:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['panadería', 'sorpresa', 'pan fresco'],
    rating: 4.8,
    reviewCount: 156,
    mysteryDetails: {
      estimatedItems: 5,
      estimatedValue: 25000,
      surpriseLevel: 'high',
      possibleContents: ['Pan artesanal', 'Croissants', 'Pasteles', 'Galletas']
    }
  },
  {
    id: 'mb-002',
    businessId: 'biz-002',
    businessName: 'Restaurante La Cazuela',
    businessLogo: '/logos/cazuela.png',
    name: 'Bolsa Sorpresa Almuerzo',
    description: 'Platos del día preparados con ingredientes frescos. Comida casera colombiana.',
    type: 'mystery_bag',
    category: 'restaurante',
    status: 'active',
    originalPrice: 35000,
    discountPrice: 15000,
    discountPercentage: 57,
    quantity: 8,
    quantitySold: 5,
    images: ['/images/mystery-restaurant.jpg'],
    location: {
      address: 'Carrera 7 #45-12, Bogotá',
      lat: 4.6497,
      lng: -74.0628,
      distance: 0.8
    },
    pickupWindow: {
      start: '14:00',
      end: '16:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['almuerzo', 'comida colombiana', 'casero'],
    rating: 4.6,
    reviewCount: 89,
    mysteryDetails: {
      estimatedItems: 2,
      estimatedValue: 35000,
      surpriseLevel: 'medium',
      possibleContents: ['Bandeja paisa', 'Ajiaco', 'Sancocho', 'Arroz con pollo']
    }
  }
]

// ============================================
// REGULAR PRODUCTS - Productos Normales
// ============================================

export const regularProducts: RegularProduct[] = [
  {
    id: 'rp-001',
    businessId: 'biz-003',
    businessName: 'Supermercado Fresh',
    name: 'Yogurt Griego Natural 1L',
    description: 'Yogurt griego natural sin azúcar añadida. Perfecto para desayunos saludables.',
    type: 'regular',
    category: 'lacteos',
    status: 'active',
    originalPrice: 18000,
    discountPrice: 12000,
    discountPercentage: 33,
    quantity: 20,
    quantitySold: 8,
    images: ['/images/yogurt.jpg'],
    location: {
      address: 'Av. 68 #22-15, Bogotá',
      lat: 4.6351,
      lng: -74.0936,
      distance: 2.1
    },
    pickupWindow: {
      start: '08:00',
      end: '21:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['lácteos', 'saludable', 'proteína'],
    isVegetarian: true,
    isGlutenFree: true,
    rating: 4.5,
    reviewCount: 42,
    productDetails: {
      brand: 'Alpina',
      weight: '1L',
      unit: 'unidad',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'rp-002',
    businessId: 'biz-004',
    businessName: 'Frutería Don José',
    name: 'Canasta de Frutas Mixtas 2kg',
    description: 'Selección de frutas frescas de temporada: manzanas, peras, bananos y naranjas.',
    type: 'regular',
    category: 'frutas_verduras',
    status: 'active',
    originalPrice: 28000,
    discountPrice: 18000,
    discountPercentage: 36,
    quantity: 15,
    quantitySold: 3,
    images: ['/images/fruits.jpg'],
    location: {
      address: 'Plaza de Mercado Paloquemao',
      lat: 4.6234,
      lng: -74.0876,
      distance: 3.5
    },
    pickupWindow: {
      start: '06:00',
      end: '14:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['frutas', 'fresco', 'vitaminas'],
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    rating: 4.9,
    reviewCount: 234,
    productDetails: {
      weight: '2kg',
      unit: 'canasta'
    }
  }
]

// ============================================
// DAILY DEALS - Ofertas del Día
// ============================================

export const dailyDeals: DailyDeal[] = [
  {
    id: 'dd-001',
    businessId: 'biz-005',
    businessName: 'Café Aroma',
    name: '☕ Combo Café + Croissant',
    description: '¡Solo hoy! Café americano grande + croissant de mantequilla recién horneado.',
    type: 'daily_deal',
    category: 'cafe',
    status: 'active',
    originalPrice: 15000,
    discountPrice: 7500,
    discountPercentage: 50,
    quantity: 30,
    quantitySold: 22,
    images: ['/images/coffee-combo.jpg'],
    location: {
      address: 'Centro Comercial Andino, Local 234',
      lat: 4.6669,
      lng: -74.0525,
      distance: 1.8
    },
    pickupWindow: {
      start: '07:00',
      end: '11:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['café', 'desayuno', 'oferta flash'],
    rating: 4.7,
    reviewCount: 567,
    dealDetails: {
      dealStartTime: '07:00',
      dealEndTime: '11:00',
      isFlashSale: true,
      countdown: 3600,
      originalStock: 30,
      urgencyLevel: 'high'
    }
  },
  {
    id: 'dd-002',
    businessId: 'biz-006',
    businessName: 'Pizzería Napoli',
    name: '🍕 2x1 en Pizzas Medianas',
    description: 'Lleva 2 pizzas medianas por el precio de 1. Válido solo hoy hasta las 9pm.',
    type: 'daily_deal',
    category: 'restaurante',
    status: 'active',
    originalPrice: 45000,
    discountPrice: 22500,
    discountPercentage: 50,
    quantity: 50,
    quantitySold: 35,
    images: ['/images/pizza-deal.jpg'],
    location: {
      address: 'Zona T, Calle 82 #12-15',
      lat: 4.6712,
      lng: -74.0489,
      distance: 2.3
    },
    pickupWindow: {
      start: '12:00',
      end: '21:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['pizza', '2x1', 'cena'],
    rating: 4.4,
    reviewCount: 892,
    dealDetails: {
      dealStartTime: '12:00',
      dealEndTime: '21:00',
      isFlashSale: false,
      originalStock: 50,
      urgencyLevel: 'medium'
    }
  }
]

// ============================================
// EXPIRING SOON - Próximos a Vencer
// ============================================

export const expiringSoon: ExpiringSoon[] = [
  {
    id: 'es-001',
    businessId: 'biz-003',
    businessName: 'Supermercado Fresh',
    name: 'Pack de Sushi (12 piezas)',
    description: 'Sushi fresco preparado hoy. Incluye: 4 California, 4 Philadelphia, 4 Sake.',
    type: 'expiring_soon',
    category: 'comida_preparada',
    status: 'active',
    originalPrice: 42000,
    discountPrice: 21000,
    discountPercentage: 50,
    quantity: 8,
    quantitySold: 5,
    images: ['/images/sushi.jpg'],
    location: {
      address: 'Av. 68 #22-15, Bogotá',
      lat: 4.6351,
      lng: -74.0936,
      distance: 2.1
    },
    pickupWindow: {
      start: '18:00',
      end: '21:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    tags: ['sushi', 'japonés', 'fresco'],
    rating: 4.6,
    reviewCount: 78,
    expiringDetails: {
      expirationDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      daysUntilExpiry: 0,
      freshness: 'consume_soon',
      qualityGuarantee: true
    }
  },
  {
    id: 'es-002',
    businessId: 'biz-007',
    businessName: 'Pastelería Dulce Hogar',
    name: 'Torta de Chocolate (porción)',
    description: 'Deliciosa torta de chocolate belga con ganache. Preparada ayer, ¡aún deliciosa!',
    type: 'expiring_soon',
    category: 'postres',
    status: 'active',
    originalPrice: 12000,
    discountPrice: 5000,
    discountPercentage: 58,
    quantity: 12,
    quantitySold: 9,
    images: ['/images/chocolate-cake.jpg'],
    location: {
      address: 'Calle 93 #11-28, Bogotá',
      lat: 4.6789,
      lng: -74.0456,
      distance: 1.5
    },
    pickupWindow: {
      start: '14:00',
      end: '19:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    tags: ['postre', 'chocolate', 'torta'],
    isVegetarian: true,
    rating: 4.9,
    reviewCount: 312,
    expiringDetails: {
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      daysUntilExpiry: 1,
      freshness: 'good',
      qualityGuarantee: true
    }
  }
]

// ============================================
// SEASONAL PACKS - Paquetes de Temporada
// ============================================

export const seasonalPacks: SeasonalPack[] = [
  {
    id: 'sp-001',
    businessId: 'biz-001',
    businessName: 'Panadería El Buen Pan',
    name: '🎄 Pack Navideño Especial',
    description: 'Celebra la Navidad con nuestra selección especial: buñuelos, natilla, pan de Pascua y más.',
    type: 'seasonal',
    category: 'panaderia',
    status: 'active',
    originalPrice: 65000,
    discountPrice: 45000,
    discountPercentage: 31,
    quantity: 25,
    quantitySold: 12,
    images: ['/images/christmas-pack.jpg'],
    location: {
      address: 'Calle 85 #15-20, Bogotá',
      lat: 4.6682,
      lng: -74.0816,
      distance: 1.2
    },
    pickupWindow: {
      start: '10:00',
      end: '20:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['navidad', 'tradicional', 'familia'],
    rating: 4.9,
    reviewCount: 45,
    seasonalDetails: {
      season: 'navidad',
      theme: 'Navidad Colombiana',
      availableFrom: '2024-12-01',
      availableUntil: '2024-12-31',
      isLimitedEdition: true,
      includedItems: ['Buñuelos x12', 'Natilla 500g', 'Pan de Pascua', 'Hojuelas x6']
    }
  },
  {
    id: 'sp-002',
    businessId: 'biz-008',
    businessName: 'Heladería Polar',
    name: '☀️ Pack Verano Refrescante',
    description: 'Combate el calor con nuestro pack de helados artesanales. 6 sabores diferentes.',
    type: 'seasonal',
    category: 'postres',
    status: 'active',
    originalPrice: 48000,
    discountPrice: 32000,
    discountPercentage: 33,
    quantity: 40,
    quantitySold: 18,
    images: ['/images/summer-ice-cream.jpg'],
    location: {
      address: 'Parque de la 93, Bogotá',
      lat: 4.6765,
      lng: -74.0478,
      distance: 2.0
    },
    pickupWindow: {
      start: '11:00',
      end: '21:00'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['verano', 'helado', 'refrescante'],
    isVegetarian: true,
    rating: 4.7,
    reviewCount: 189,
    seasonalDetails: {
      season: 'verano',
      theme: 'Verano Tropical',
      availableFrom: '2024-12-01',
      availableUntil: '2025-03-31',
      isLimitedEdition: false,
      includedItems: ['Helado Mango', 'Helado Maracuyá', 'Helado Coco', 'Helado Fresa', 'Helado Chocolate', 'Helado Vainilla']
    }
  }
]

// ============================================
// ALL PRODUCTS COMBINED
// ============================================

export const allMockProducts: Product[] = [
  ...mysteryBags,
  ...regularProducts,
  ...dailyDeals,
  ...expiringSoon,
  ...seasonalPacks
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getProductsByType = (type: string): Product[] => {
  return allMockProducts.filter(p => p.type === type)
}

export const getProductsByCategory = (category: string): Product[] => {
  return allMockProducts.filter(p => p.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return allMockProducts.filter(p => p.rating && p.rating >= 4.7).slice(0, 4)
}

export const getNearbyProducts = (maxDistance: number = 2): Product[] => {
  return allMockProducts.filter(p => p.location.distance && p.location.distance <= maxDistance)
}

export const getUrgentProducts = (): Product[] => {
  return allMockProducts.filter(p => {
    const remaining = p.quantity - p.quantitySold
    return remaining <= 5 || p.type === 'expiring_soon' || p.type === 'daily_deal'
  })
}
