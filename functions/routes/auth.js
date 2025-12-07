/**
 * ============================================
 * ZAVO - Auth Routes
 * ============================================
 * 
 * Rutas de autenticación: login, register, verify, logout
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();

// JWT Secret (en producción usar Firebase Config)
const JWT_SECRET = process.env.JWT_SECRET || 'zavo-super-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('usuario', 'negocio').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

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
// REGISTER
// ============================================

router.post('/register', async (req, res) => {
  try {
    // Validar datos
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      });
    }

    const { email, password, name, role } = value;

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        error: 'Este email ya está registrado'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const userData = {
      email: email.toLowerCase(),
      name: name.trim(),
      role,
      password: hashedPassword,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const userRef = await db.collection('users').add(userData);
    const userId = userRef.id;

    // Generar JWT
    const token = jwt.sign(
      { userId, email: email.toLowerCase(), role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Guardar token en la base de datos
    await db.collection('tokens').doc(token).set({
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      )
    });

    // Respuesta (sin contraseña)
    const user = {
      id: userId,
      email: email.toLowerCase(),
      name: name.trim(),
      role,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user,
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// LOGIN
// ============================================

router.post('/login', async (req, res) => {
  try {
    // Validar datos
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      });
    }

    const { email, password } = value;

    // Buscar usuario
    const userQuery = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (userQuery.empty) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId, email: userData.email, role: userData.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Guardar token en la base de datos
    await db.collection('tokens').doc(token).set({
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      )
    });

    // Actualizar último login
    await db.collection('users').doc(userId).update({
      last_login: admin.firestore.FieldValue.serverTimestamp()
    });

    // Respuesta (sin contraseña)
    const user = {
      id: userId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      created_at: userData.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    res.json({
      message: 'Login exitoso',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// VERIFY TOKEN
// ============================================

router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // El middleware ya verificó el token y cargó el usuario
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      created_at: req.user.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
    };

    res.json({
      message: 'Token válido',
      user
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ============================================
// LOGOUT
// ============================================

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Eliminar token de la base de datos
    await db.collection('tokens').doc(req.token).delete();

    res.json({
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Logout error:', error);
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
    service: 'ZAVO Auth Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
