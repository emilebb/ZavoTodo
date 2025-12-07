/**
 * ============================================
 * ZAVO - User Routes
 * ============================================
 * 
 * Rutas para gestión de usuarios
 */

const express = require('express');
const Joi = require('joi');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = admin.firestore();
const JWT_SECRET = process.env.JWT_SECRET || 'zavo-super-secret-key-2024';

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el token existe en la base de datos
    const tokenDoc = await db.collection('tokens').doc(token).get();
    if (!tokenDoc.exists) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verificar que el usuario existe
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = { id: decoded.userId, ...userDoc.data() };
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
  address: Joi.string().max(200)
});

// ============================================
// GET PROFILE
// ============================================

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      phone: req.user.phone || null,
      address: req.user.address || null,
      created_at: req.user.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: req.user.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    res.json({
      message: 'Perfil obtenido exitosamente',
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// UPDATE PROFILE
// ============================================

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    // Validar datos
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      });
    }

    // Actualizar usuario
    const updateData = {
      ...value,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(req.user.id).update(updateData);

    // Obtener usuario actualizado
    const updatedUserDoc = await db.collection('users').doc(req.user.id).get();
    const updatedUserData = updatedUserDoc.data();

    const user = {
      id: req.user.id,
      email: updatedUserData.email,
      name: updatedUserData.name,
      role: updatedUserData.role,
      phone: updatedUserData.phone || null,
      address: updatedUserData.address || null,
      created_at: updatedUserData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: updatedUserData.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    res.json({
      message: 'Perfil actualizado exitosamente',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// DELETE ACCOUNT
// ============================================

router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    // Eliminar todos los tokens del usuario
    const userTokens = await db.collection('tokens')
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    userTokens.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Eliminar usuario
    batch.delete(db.collection('users').doc(userId));

    await batch.commit();

    res.json({
      message: 'Cuenta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ZAVO User Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
