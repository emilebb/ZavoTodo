/**
 * ZAVO Content Constants
 * Textos centralizados para fácil iteración y consistencia
 */

export const BRAND = {
  name: 'ZAVO',
  tagline: 'Rescata comida',
  fullTagline: 'Rescata comida, salva el planeta',
  description: 'Plataforma líder en Colombia para rescatar comida deliciosa con descuentos de hasta 70%',
} as const

export const HERO = {
  badge: 'Nuevo en Colombia',
  headline: 'Rescata comida deliciosa con hasta',
  headlineHighlight: '70% de descuento',
  subheadline: 'Únete a la revolución contra el desperdicio alimentario. Encuentra packs sorpresa de tus restaurantes favoritos y ayuda a salvar el planeta.',
  ctaPrimary: 'Explorar Packs',
  ctaSecondary: 'Ver en Mapa',
} as const

export const STATS = {
  packsRescued: {
    value: '2,500+',
    label: 'Packs rescatados',
  },
  averageSavings: {
    value: '85%',
    label: 'Ahorro promedio',
  },
  partnerBusinesses: {
    value: '150+',
    label: 'Negocios aliados',
  },
  co2Saved: {
    value: '2.1 ton',
    label: 'CO₂ ahorrado',
  },
} as const

export const FEATURES = {
  tabs: {
    packs: 'Packs Sorpresa',
    business: 'Para Negocios',
    impact: 'Impacto Ambiental',
  },
  sectionTitle: 'Explora nuestras funcionalidades',
  sectionSubtitle: 'Descubre cómo ZAVO está transformando la forma de combatir el desperdicio alimentario',
} as const

export const CTA_SECTION = {
  title: '¿Listo para hacer la diferencia?',
  subtitle: 'Únete a miles de usuarios que ya están rescatando comida y salvando el planeta',
  ctaPrimary: 'Descargar App',
  ctaSecondary: 'Explorar Web',
  trustBadges: [
    'Sin costo de registro',
    'Pago seguro',
    'Soporte 24/7',
  ],
} as const

export const EMPTY_STATES = {
  orders: {
    title: 'Aún no has rescatado comida',
    description: 'Empieza explorando packs cerca de ti y únete a la revolución contra el desperdicio alimentario.',
    ctaPrimary: 'Explorar Packs',
    ctaSecondary: 'Ver Mapa',
  },
  packs: {
    title: 'No hay packs disponibles',
    description: 'Vuelve más tarde para descubrir nuevas ofertas de negocios cerca de ti.',
    cta: 'Actualizar',
  },
} as const

export const MAP_FEATURES = [
  {
    title: 'Geolocalización en tiempo real',
    description: 'Ubicación precisa GPS',
    color: 'blue',
  },
  {
    title: 'Marcadores interactivos',
    description: 'Negocios cercanos',
    color: 'emerald',
  },
  {
    title: 'Rutas y direcciones',
    description: 'Navegación optimizada',
    color: 'purple',
  },
  {
    title: 'Horarios de retiro',
    description: 'Disponibilidad real',
    color: 'amber',
  },
  {
    title: 'Calificaciones y reseñas',
    description: 'Opiniones verificadas',
    color: 'yellow',
  },
  {
    title: 'Integración Google Maps',
    description: 'Navegación externa',
    color: 'slate',
  },
] as const

export const BUSINESS_BENEFITS = [
  {
    emoji: '💰',
    title: 'Ingresos Extra',
    description: 'Monetiza tu exceso de comida en lugar de desecharlo',
  },
  {
    emoji: '🌍',
    title: 'Impacto Positivo',
    description: 'Contribuye activamente a la reducción del desperdicio',
  },
  {
    emoji: '👥',
    title: 'Nuevos Clientes',
    description: 'Atrae nuevos clientes que descubran tu negocio',
  },
] as const

export const IMPACT_METRICS = [
  {
    value: '2.1 kg',
    label: 'CO₂ ahorrado por pack',
    color: 'green',
  },
  {
    value: '1.5 L',
    label: 'Agua conservada',
    color: 'blue',
  },
  {
    value: '0.8 m²',
    label: 'Tierra preservada',
    color: 'orange',
  },
  {
    value: '1 kg',
    label: 'Comida rescatada',
    color: 'purple',
  },
] as const

export const NAV_ITEMS = {
  user: [
    { path: '/', label: 'Inicio' },
    { path: '/mapa', label: 'Mapa' },
    { path: '/perfil/pedidos', label: 'Mis Pedidos' },
  ],
  business: [
    { path: '/negocio/dashboard', label: 'Dashboard' },
    { path: '/negocio/packs', label: 'Mis Packs' },
    { path: '/negocio/pedidos', label: 'Pedidos' },
  ],
} as const

export const FOOTER = {
  links: [
    { label: 'Términos', href: '/terminos' },
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Contacto', href: '/contacto' },
  ],
  copyright: '© 2024 ZAVO. Hecho con 💚 en Colombia',
} as const
