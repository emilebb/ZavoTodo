# 🔥 ZAVO - Backend API con Firebase Functions

## 🎯 **TU API ESTÁ LIVE EN:**

### **URL Base:**
```
https://us-central1-zavowebmobil.cloudfunctions.net/api
```

### **Endpoints Disponibles:**

#### **🔐 Autenticación:**
- **POST** `/auth/register` - Crear cuenta
- **POST** `/auth/login` - Iniciar sesión  
- **GET** `/auth/verify` - Verificar token
- **POST** `/auth/logout` - Cerrar sesión
- **GET** `/auth/health` - Health check

#### **👤 Usuarios:**
- **GET** `/users/profile` - Obtener perfil
- **PUT** `/users/profile` - Actualizar perfil
- **DELETE** `/users/account` - Eliminar cuenta
- **GET** `/users/health` - Health check

---

## 🧪 **TESTING DE LA API**

### **1. Health Check:**
```bash
curl https://us-central1-zavowebmobil.cloudfunctions.net/api
```

### **2. Registro de Usuario:**
```bash
curl -X POST https://us-central1-zavowebmobil.cloudfunctions.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Usuario Test",
    "role": "usuario"
  }'
```

### **3. Login:**
```bash
curl -X POST https://us-central1-zavowebmobil.cloudfunctions.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "123456"
  }'
```

### **4. Verificar Token:**
```bash
curl -X GET https://us-central1-zavowebmobil.cloudfunctions.net/api/auth/verify \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔧 **CONFIGURACIÓN DEL FRONTEND**

### **Variables de Entorno:**

#### **Desarrollo (.env.local):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_REAL_API=false
```

#### **Producción (.env.production):**
```env
VITE_API_URL=https://us-central1-zavowebmobil.cloudfunctions.net/api
VITE_USE_REAL_API=true
```

### **AuthStore Configurado:**
- ✅ **Desarrollo:** Usa mock server
- ✅ **Producción:** Usa Firebase Functions
- ✅ **Automático:** Detecta entorno

---

## 🗄️ **BASE DE DATOS (FIRESTORE)**

### **Colecciones Creadas:**

#### **`users`:**
```json
{
  "id": "auto-generated",
  "email": "usuario@example.com",
  "name": "Nombre Usuario",
  "role": "usuario|negocio", 
  "password": "hashed_password",
  "phone": "optional",
  "address": "optional",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "last_login": "timestamp"
}
```

#### **`tokens`:**
```json
{
  "token": "jwt_token_string",
  "userId": "user_id_reference",
  "createdAt": "timestamp",
  "expiresAt": "timestamp"
}
```

---

## 🔐 **SEGURIDAD IMPLEMENTADA**

### **✅ Características:**
- **JWT Tokens** con expiración de 7 días
- **Contraseñas hasheadas** con bcrypt (12 rounds)
- **Validación** con Joi schemas
- **CORS** configurado para Firebase Hosting
- **Token blacklist** en Firestore
- **Cleanup automático** de tokens expirados

### **✅ Middleware de Autenticación:**
- Verifica JWT token
- Valida existencia en base de datos
- Carga datos del usuario
- Manejo de errores robusto

---

## 🚀 **COMANDOS DE DESPLIEGUE**

### **Solo Functions:**
```bash
firebase deploy --only functions
```

### **Solo Hosting:**
```bash
npm run deploy
```

### **Todo (Functions + Hosting):**
```bash
npm run deploy:full
```

### **Desarrollo Local:**
```bash
# Emuladores de Firebase
firebase emulators:start

# Functions locales
npm run functions:serve
```

---

## 📊 **MONITOREO**

### **Firebase Console:**
- **Functions:** https://console.firebase.google.com/project/zavowebmobil/functions
- **Firestore:** https://console.firebase.google.com/project/zavowebmobil/firestore
- **Logs:** https://console.firebase.google.com/project/zavowebmobil/functions/logs

### **Comandos útiles:**
```bash
# Ver logs en tiempo real
firebase functions:log

# Ver logs específicos
firebase functions:log --only api

# Ver métricas
firebase functions:log --lines 100
```

---

## 🔄 **FUNCIONES AUTOMÁTICAS**

### **Cleanup de Tokens:**
- **Función:** `cleanupExpiredTokens`
- **Frecuencia:** Diaria (00:00 Colombia)
- **Acción:** Elimina tokens expirados automáticamente

---

## 🛠️ **ESTRUCTURA DEL CÓDIGO**

```
functions/
├── index.js              # Función principal
├── package.json          # Dependencias
├── routes/
│   ├── auth.js           # Rutas de autenticación
│   └── users.js          # Rutas de usuarios
└── .gitignore
```

### **Tecnologías Usadas:**
- **Firebase Functions** (Node.js 20)
- **Express.js** para routing
- **Firebase Admin SDK** para Firestore
- **bcryptjs** para hash de contraseñas
- **jsonwebtoken** para JWT
- **Joi** para validación
- **CORS** para cross-origin

---

## 🎯 **RESULTADO FINAL**

### **✅ Backend Completo:**
- 🔐 **Autenticación JWT** robusta
- 👤 **Gestión de usuarios** completa
- 🗄️ **Base de datos** Firestore
- 🛡️ **Seguridad** implementada
- 🚀 **Desplegado** en producción
- 📊 **Monitoreo** incluido

### **✅ Frontend Integrado:**
- 🔄 **Auto-detección** de entorno
- 🧪 **Mock server** para desarrollo
- 🌐 **API real** para producción
- 🔐 **AuthGuard** para protección
- 💾 **Token management** automático

### **🌐 URLs Finales:**
- **Frontend:** https://zavowebmobil.web.app
- **Backend:** https://us-central1-zavowebmobil.cloudfunctions.net/api

**¡Tu aplicación ZAVO está 100% funcional con backend real en producción!** 🎉
