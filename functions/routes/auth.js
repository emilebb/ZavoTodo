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

/**
 * POST /register/user
 * Registrar nuevo usuario (cliente)
 */
router.post('/register/user', async (req, res) => {
  try {
    const userSchema = Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().optional(),
      dateOfBirth: Joi.string().optional(),
      acceptTerms: Joi.boolean().valid(true).required(),
      acceptMarketing: Joi.boolean().optional()
    })

    const { error, value } = userSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      })
    }

    const { name, email, password, phone, dateOfBirth, acceptMarketing } = value

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .get()

    if (!existingUser.empty) {
      return res.status(409).json({ error: 'El usuario ya existe' })
    }

    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone
    })

    // Crear documento de usuario en Firestore
    const userData = {
      id: userRecord.uid,
      name,
      email,
      phone: phone || null,
      role: 'user',
      dateOfBirth: dateOfBirth || null,
      preferences: {
        notifications: true,
        marketing: acceptMarketing || false,
        categories: []
      },
      verified: false,
      active: true,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    await db.collection('users').doc(userRecord.uid).set(userData)

    // Generar token JWT
    const token = jwt.sign(
      { uid: userRecord.uid, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Guardar token en Firestore
    await db.collection('tokens').doc(userRecord.uid).set({
      token,
      userId: userRecord.uid,
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ),
      created_at: admin.firestore.FieldValue.serverTimestamp()
    })

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error en registro de usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

/**
 * POST /register/business
 * Registrar nuevo negocio
 */
router.post('/register/business', async (req, res) => {
  try {
    const businessSchema = Joi.object({
      // Datos del administrador
      adminName: Joi.string().min(2).max(100).required(),
      adminEmail: Joi.string().email().required(),
      adminPassword: Joi.string().min(6).required(),
      adminPhone: Joi.string().optional(),
      
      // Datos del negocio
      businessName: Joi.string().min(2).max(200).required(),
      businessEmail: Joi.string().email().optional(),
      businessPhone: Joi.string().required(),
      address: Joi.string().min(10).max(500).required(),
      category: Joi.string().required(),
      description: Joi.string().max(1000).optional(),
      
      // Información legal
      nit: Joi.string().optional(),
      legalName: Joi.string().optional(),
      
      // Términos
      acceptTerms: Joi.boolean().valid(true).required(),
      acceptBusinessTerms: Joi.boolean().valid(true).required()
    })

    const { error, value } = businessSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details[0].message
      })
    }

    const {
      adminName,
      adminEmail,
      adminPassword,
      adminPhone,
      businessName,
      businessEmail,
      businessPhone,
      address,
      category,
      description,
      nit,
      legalName
    } = value

    // Verificar si el email ya existe
    const existingUser = await db.collection('users')
      .where('email', '==', adminEmail)
      .get()

    if (!existingUser.empty) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    // Verificar si el negocio ya existe
    const existingBusiness = await db.collection('businesses')
      .where('businessName', '==', businessName)
      .get()

    if (!existingBusiness.empty) {
      return res.status(409).json({ error: 'Ya existe un negocio con ese nombre' })
    }

    // Crear usuario administrador en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: adminName,
      phoneNumber: adminPhone
    })

    // Crear documento de usuario administrador
    const userData = {
      id: userRecord.uid,
      name: adminName,
      email: adminEmail,
      phone: adminPhone || null,
      role: 'business',
      verified: false,
      active: true,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    await db.collection('users').doc(userRecord.uid).set(userData)

    // Crear documento del negocio
    const businessId = 'business_' + userRecord.uid
    const businessData = {
      id: businessId,
      userId: userRecord.uid,
      businessName,
      email: businessEmail || adminEmail,
      phone: businessPhone,
      address,
      category,
      description: description || '',
      nit: nit || null,
      legalName: legalName || businessName,
      lat: null, // Se puede agregar después con geocoding
      lng: null,
      logo: null,
      coverImage: null,
      rating: 0,
      verified: false,
      active: true,
      schedule: {
        monday: { open: '08:00', close: '18:00', isOpen: true },
        tuesday: { open: '08:00', close: '18:00', isOpen: true },
        wednesday: { open: '08:00', close: '18:00', isOpen: true },
        thursday: { open: '08:00', close: '18:00', isOpen: true },
        friday: { open: '08:00', close: '18:00', isOpen: true },
        saturday: { open: '08:00', close: '16:00', isOpen: true },
        sunday: { open: '10:00', close: '14:00', isOpen: false }
      },
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    }

    await db.collection('businesses').doc(businessId).set(businessData)

    // Generar token JWT
    const token = jwt.sign(
      { 
        uid: userRecord.uid, 
        email: adminEmail, 
        role: 'business',
        businessId: businessId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Guardar token en Firestore
    await db.collection('tokens').doc(userRecord.uid).set({
      token,
      userId: userRecord.uid,
      businessId: businessId,
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ),
      created_at: admin.firestore.FieldValue.serverTimestamp()
    })

    res.status(201).json({
      message: 'Negocio registrado exitosamente',
      token,
      user: {
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      business: {
        ...businessData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error en registro de negocio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

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
