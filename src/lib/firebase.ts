/**
 * ============================================
 * ZAVO - Firebase Configuration
 * ============================================
 * 
 * Configuración central de Firebase con:
 * - Authentication
 * - Firestore Database
 * - Storage
 * 
 * @see https://firebase.google.com/docs/web/setup
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  Auth,
  connectAuthEmulator 
} from 'firebase/auth'
import { 
  getFirestore, 
  Firestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence
} from 'firebase/firestore'
import { 
  getStorage, 
  FirebaseStorage,
  connectStorageEmulator 
} from 'firebase/storage'

// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================

/**
 * Configuración de Firebase desde variables de entorno
 * Asegúrate de crear un archivo .env con estas variables
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// ============================================
// INICIALIZACIÓN DE FIREBASE
// ============================================

/**
 * Inicializa Firebase App (singleton)
 * Evita múltiples inicializaciones en hot reload
 */
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

// Verificar si ya existe una instancia
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Inicializar servicios
auth = getAuth(app)
db = getFirestore(app)
storage = getStorage(app)

// ============================================
// EMULADORES (Desarrollo Local)
// ============================================

/**
 * Conectar a emuladores de Firebase en desarrollo
 * Ejecutar: firebase emulators:start
 */
const USE_EMULATORS = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'

if (USE_EMULATORS && import.meta.env.DEV) {
  console.log('🔧 Conectando a emuladores de Firebase...')
  
  try {
    // Auth Emulator (puerto 9099)
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    
    // Firestore Emulator (puerto 8080)
    connectFirestoreEmulator(db, 'localhost', 8080)
    
    // Storage Emulator (puerto 9199)
    connectStorageEmulator(storage, 'localhost', 9199)
    
    console.log('✅ Emuladores conectados')
  } catch (error) {
    console.warn('⚠️ Error conectando emuladores:', error)
  }
}

// ============================================
// PERSISTENCIA OFFLINE
// ============================================

/**
 * Habilitar persistencia offline para Firestore
 * Permite que la app funcione sin conexión
 */
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Múltiples tabs abiertas
      console.warn('⚠️ Persistencia offline no disponible: múltiples tabs')
    } else if (err.code === 'unimplemented') {
      // Navegador no soporta
      console.warn('⚠️ Persistencia offline no soportada en este navegador')
    }
  })
}

// ============================================
// EXPORTS
// ============================================

export { app, auth, db, storage }

// Export default para conveniencia
export default {
  app,
  auth,
  db,
  storage,
}

// ============================================
// HELPERS DE CONFIGURACIÓN
// ============================================

/**
 * Verifica si Firebase está configurado correctamente
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your_firebase_api_key'
  )
}

/**
 * Obtiene el estado de la configuración para debugging
 */
export function getFirebaseStatus() {
  return {
    configured: isFirebaseConfigured(),
    projectId: firebaseConfig.projectId || 'No configurado',
    usingEmulators: USE_EMULATORS,
    services: {
      auth: !!auth,
      firestore: !!db,
      storage: !!storage,
    },
  }
}
