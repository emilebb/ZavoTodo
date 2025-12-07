# 🔥 ZAVO - Firebase Setup Guide

## Guía completa para configurar Firebase en ZAVO

---

## 📋 Índice

1. [Crear Proyecto Firebase](#1-crear-proyecto-firebase)
2. [Configurar Variables de Entorno](#2-configurar-variables-de-entorno)
3. [Estructura de Firestore](#3-estructura-de-firestore)
4. [Desplegar Reglas de Seguridad](#4-desplegar-reglas-de-seguridad)
5. [Configurar Mapbox/Leaflet](#5-configurar-mapboxleaflet)
6. [Comandos Útiles](#6-comandos-útiles)
7. [Arquitectura del Sistema](#7-arquitectura-del-sistema)

---

## 1. Crear Proyecto Firebase

### Paso 1: Ir a Firebase Console
1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click en "Agregar proyecto"
3. Nombre: `zavo-app` (o el que prefieras)
4. Habilita Google Analytics (opcional)

### Paso 2: Agregar App Web
1. En el dashboard, click en el icono `</>`
2. Nombre: `ZAVO Web`
3. ✅ Marca "También configurar Firebase Hosting"
4. Copia la configuración que te da

### Paso 3: Habilitar Servicios

#### Authentication
1. Ve a Authentication > Sign-in method
2. Habilita:
   - ✅ Email/Password
   - ✅ Google (opcional)

#### Firestore Database
1. Ve a Firestore Database
2. Click "Crear base de datos"
3. Selecciona "Modo producción"
4. Ubicación: `us-east1` (o la más cercana)

#### Storage
1. Ve a Storage
2. Click "Comenzar"
3. Acepta las reglas por defecto

---

## 2. Configurar Variables de Entorno

### Crear archivo `.env`

```bash
cp .env.example .env
```

### Completar con tus valores:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=zavo-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=zavo-app
VITE_FIREBASE_STORAGE_BUCKET=zavo-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

# Mapa (elegir uno)
VITE_MAP_PROVIDER=leaflet  # o "mapbox"
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...  # Solo si usas Mapbox

# Tracking
VITE_LOCATION_UPDATE_INTERVAL=3000
VITE_USE_MOCK_DATA=true  # Cambiar a false en producción
```

---

## 3. Estructura de Firestore

### Colecciones principales:

```
📁 users/{userId}
├── name: string
├── email: string
├── role: "cliente" | "admin" | "repartidor"
├── phone?: string
├── avatar_url?: string
├── is_active: boolean
├── created_at: timestamp
└── updated_at?: timestamp

📁 products/{productId}
├── name: string
├── description: string
├── price: number
├── original_price?: number
├── stock: number
├── image_url: string
├── category: string
├── business_id: string
├── business_name: string
├── is_available: boolean
├── created_at: timestamp
└── total_sold: number

📁 orders/{orderId}
├── user_id: string
├── user_name: string
├── business_id: string
├── business_name: string
├── driver_id?: string
├── driver_name?: string
├── status: OrderStatus
├── subtotal: number
├── delivery_fee: number
├── total: number
├── pickup_address: string
├── pickup_coordinates: { lat, lng }
├── delivery_address: string
├── delivery_coordinates: { lat, lng }
├── created_at: timestamp
├── 📁 order_items/{itemId}
│   ├── product_id: string
│   ├── product_name: string
│   ├── quantity: number
│   ├── unit_price: number
│   └── total_price: number
└── 📁 order_locations/{locationId}
    ├── lat: number
    ├── lng: number
    ├── accuracy?: number
    ├── heading?: number
    ├── speed?: number
    └── timestamp: timestamp

📁 notifications/{notificationId}
├── user_id: string
├── type: NotificationType
├── title: string
├── message: string
├── data?: { order_id?, product_id?, url? }
├── is_read: boolean
├── read_at?: timestamp
└── created_at: timestamp
```

---

## 4. Desplegar Reglas de Seguridad

### Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Login y configurar

```bash
firebase login
firebase init
```

Selecciona:
- ✅ Firestore
- ✅ Storage
- ✅ Hosting

### Desplegar reglas

```bash
# Solo reglas
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Todo
firebase deploy
```

---

## 5. Configurar Mapbox/Leaflet

### Opción A: Leaflet (Gratuito)

No requiere configuración adicional. Usa OpenStreetMap.

```env
VITE_MAP_PROVIDER=leaflet
```

### Opción B: Mapbox (Más features)

1. Crear cuenta en [mapbox.com](https://www.mapbox.com)
2. Ir a Account > Access tokens
3. Copiar el token público

```env
VITE_MAP_PROVIDER=mapbox
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

---

## 6. Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar emuladores de Firebase
firebase emulators:start

# Build para producción
npm run build
```

### Deploy

```bash
# Deploy a Firebase Hosting
npm run build
firebase deploy --only hosting

# Deploy todo (hosting + reglas)
firebase deploy
```

### Emuladores

```bash
# Iniciar todos los emuladores
firebase emulators:start

# Con datos persistentes
firebase emulators:start --import=./emulator-data --export-on-exit

# UI de emuladores: http://localhost:4000
```

---

## 7. Arquitectura del Sistema

### Estructura de archivos creados:

```
src/
├── lib/
│   └── firebase.ts              # Configuración Firebase
├── types/
│   └── firebase.ts              # Tipos TypeScript
├── services/
│   └── firebase/
│       ├── index.ts             # Exports
│       ├── authService.ts       # Autenticación
│       ├── productService.ts    # CRUD Productos
│       ├── orderService.ts      # CRUD Pedidos + Tracking
│       └── notificationService.ts # Notificaciones
├── hooks/
│   └── firebase/
│       ├── index.ts             # Exports
│       ├── useProducts.ts       # Hook productos
│       ├── useOrders.ts         # Hook pedidos
│       ├── useOrderTracking.ts  # Hook tracking
│       └── useNotifications.ts  # Hook notificaciones
├── components/
│   └── map/
│       ├── LiveMap.tsx          # Mapa con Mapbox/Leaflet
│       └── LiveTracking.tsx     # Componente tracking completo
├── config/
│   └── realtime.ts              # Config tracking
firestore.rules                  # Reglas Firestore
firestore.indexes.json           # Índices
storage.rules                    # Reglas Storage
firebase.json                    # Config Firebase
```

### Flujo de datos:

```
Usuario → Hook (TanStack Query) → Service → Firebase
                ↓
            Componente ← Estado actualizado
```

### Tracking en tiempo real:

```
Repartidor App
     ↓
useDriverSharing() → addOrderLocation()
     ↓
Firestore (order_locations)
     ↓
onSnapshot() → useOrderTracking()
     ↓
LiveTracking Component → LiveMap
```

---

## 🚀 Uso Rápido

### 1. Tracking de pedido

```tsx
import { LiveTracking } from '@/components/map/LiveTracking'

function OrderPage({ orderId }) {
  return <LiveTracking orderId={orderId} />
}
```

### 2. Hook de productos

```tsx
import { useProducts, useCreateProduct } from '@/hooks/firebase'

function ProductList() {
  const { data, isLoading } = useProducts()
  const createProduct = useCreateProduct()
  
  // ...
}
```

### 3. Tracking del repartidor

```tsx
import { useDriverSharing } from '@/hooks/firebase'

function DriverApp({ orderId }) {
  const { isSharing, startSharing, stopSharing } = useDriverSharing(orderId)
  
  return (
    <button onClick={isSharing ? stopSharing : startSharing}>
      {isSharing ? 'Detener' : 'Iniciar'} tracking
    </button>
  )
}
```

---

## ❓ Troubleshooting

### Error: "Firebase not configured"
- Verifica que `.env` tenga todas las variables
- Reinicia el servidor de desarrollo

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de estar autenticado

### Mapa no carga
- Verifica `VITE_MAP_PROVIDER`
- Si usas Mapbox, verifica el token

---

## 📞 Soporte

¿Problemas? Revisa:
1. Console del navegador
2. Firebase Console > Logs
3. Emulador UI en `http://localhost:4000`
