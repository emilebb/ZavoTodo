/**
 * ============================================
 * ZAVO - Firebase Functions Backend
 * ============================================
 * 
 * API completa para autenticación y gestión de usuarios
 * URL: https://us-central1-zavowebmobil.cloudfunctions.net/api
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Crear app Express
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

// ============================================
// CONFIGURAR RUTAS
// ============================================

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', ordersRoutes);

// Ruta de health check
app.get('/', (req, res) => {
  res.json({
    message: 'ZAVO API is running! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        register: 'POST /auth/register',
        verify: 'GET /auth/verify',
        logout: 'POST /auth/logout'
      },
      users: {
        profile: 'GET /users/profile',
        update: 'PUT /users/profile'
      }
    }
  });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Exportar la función
exports.api = functions.https.onRequest(app);

// Función para limpiar tokens expirados (ejecuta cada día)
exports.cleanupExpiredTokens = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('America/Bogota')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const expiredTokens = await db.collection('tokens')
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    expiredTokens.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleaned up ${expiredTokens.size} expired tokens`);
    return null;
  });
