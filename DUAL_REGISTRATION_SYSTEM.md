# 👥 SISTEMA DE REGISTRO DUAL: USUARIO VS NEGOCIO - ZAVO

## 🎯 **RESUMEN EJECUTIVO**

Sistema completo de registro que permite a los usuarios elegir entre crear una **cuenta de Cliente** (para comprar packs) o una **cuenta de Negocio** (para vender productos y reducir desperdicio). Incluye formularios específicos, validación completa y base de datos estructurada.

## 🔄 **FLUJO COMPLETO DEL SISTEMA**

### **1. 🎯 SELECCIÓN DE TIPO**
```
Usuario abre registro → Ve 2 opciones → "Soy Cliente" o "Tengo un Negocio"
```

### **2. 📝 FORMULARIO ESPECÍFICO**
```
Cliente: Nombre, email, teléfono, fecha nacimiento, contraseña
Negocio: Admin + Negocio (nombre, NIT, dirección, categoría, etc.)
```

### **3. 🔒 VALIDACIÓN Y REGISTRO**
```
Frontend valida → Envía a API → Crea en Firebase Auth + Firestore → Retorna token
```

### **4. ✅ REDIRECCIÓN INTELIGENTE**
```
Cliente → Home principal
Negocio → Dashboard de negocio
```

## 📊 **ESTRUCTURA DE DATOS**

### **👤 Usuario (Cliente):**
```typescript
{
  id: "user_abc123",
  name: "Juan Pérez",
  email: "juan@gmail.com",
  phone: "3001234567",
  role: "user",
  dateOfBirth: "1990-05-15",
  preferences: {
    notifications: true,
    marketing: false,
    categories: ["panaderia", "cafe"]
  },
  verified: false,
  active: true,
  created_at: "2024-12-07T17:44:00Z"
}
```

### **🏪 Negocio:**
```typescript
{
  // Usuario administrador
  id: "user_def456",
  name: "María González",
  email: "maria@hamburguesasturbo.com",
  role: "business",
  
  // Perfil del negocio (colección separada)
  businessProfile: {
    id: "business_def456",
    userId: "user_def456",
    businessName: "Hamburguesas Turbo",
    email: "contacto@hamburguesasturbo.com",
    phone: "3019876543",
    address: "Calle 20 #13-45, Bogotá",
    category: "comida_rapida",
    description: "Hamburguesas artesanales...",
    nit: "123456789-0",
    legalName: "Hamburguesas Turbo SAS",
    rating: 0,
    verified: false,
    active: true,
    schedule: {
      monday: { open: "08:00", close: "18:00", isOpen: true },
      // ... resto de días
    }
  }
}
```

## 🎨 **COMPONENTE DUALREGISTER**

### **🔥 Características Principales:**

#### **✅ Selección Visual:**
- **Tarjetas interactivas** con iconos y descripciones
- **Hover effects** y transiciones suaves
- **Colores diferenciados** (azul para cliente, verde para negocio)

#### **✅ Formularios Inteligentes:**
- **Validación en tiempo real** con Joi
- **Campos condicionales** según el tipo
- **Términos específicos** para cada tipo de cuenta

#### **✅ UX Optimizada:**
- **Navegación fluida** entre pasos
- **Estados de carga** con spinners
- **Mensajes de error** claros y útiles
- **Responsive design** para móvil y desktop

### **🎯 Estados del Componente:**
```typescript
type RegistrationType = 'selection' | 'user' | 'business'

// Navegación:
selection → user/business → registro exitoso
```

## 🔌 **API ENDPOINTS**

### **👤 Registro de Usuario:**
```javascript
POST /api/auth/register/user
Body: {
  name: "Juan Pérez",
  email: "juan@gmail.com", 
  password: "123456",
  phone: "3001234567",
  dateOfBirth: "1990-05-15",
  acceptTerms: true,
  acceptMarketing: false
}

Response: {
  message: "Usuario registrado exitosamente",
  token: "jwt_token_here",
  user: { /* datos del usuario */ }
}
```

### **🏪 Registro de Negocio:**
```javascript
POST /api/auth/register/business
Body: {
  // Admin
  adminName: "María González",
  adminEmail: "maria@hamburguesasturbo.com",
  adminPassword: "123456",
  adminPhone: "3001234567",
  
  // Negocio
  businessName: "Hamburguesas Turbo",
  businessEmail: "contacto@hamburguesasturbo.com",
  businessPhone: "3019876543", 
  address: "Calle 20 #13-45, Bogotá",
  category: "comida_rapida",
  description: "Hamburguesas artesanales...",
  nit: "123456789-0",
  legalName: "Hamburguesas Turbo SAS",
  
  // Términos
  acceptTerms: true,
  acceptBusinessTerms: true
}

Response: {
  message: "Negocio registrado exitosamente",
  token: "jwt_token_here", 
  user: { /* datos del admin */ },
  business: { /* datos del negocio */ }
}
```

## 🔒 **VALIDACIONES IMPLEMENTADAS**

### **Frontend (TypeScript):**
```typescript
// Usuario
const isUserFormValid = () => {
  return userFormData.name.trim() &&
         userFormData.email.trim() &&
         userFormData.password.length >= 6 &&
         userFormData.acceptTerms
}

// Negocio  
const isBusinessFormValid = () => {
  return businessFormData.adminName.trim() &&
         businessFormData.adminEmail.trim() &&
         businessFormData.adminPassword.length >= 6 &&
         businessFormData.businessName.trim() &&
         businessFormData.businessPhone.trim() &&
         businessFormData.address.trim() &&
         businessFormData.category &&
         businessFormData.acceptTerms &&
         businessFormData.acceptBusinessTerms
}
```

### **Backend (Joi):**
```javascript
// Esquema Usuario
const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.string().optional(),
  acceptTerms: Joi.boolean().valid(true).required(),
  acceptMarketing: Joi.boolean().optional()
})

// Esquema Negocio
const businessSchema = Joi.object({
  adminName: Joi.string().min(2).max(100).required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(6).required(),
  businessName: Joi.string().min(2).max(200).required(),
  businessPhone: Joi.string().required(),
  address: Joi.string().min(10).max(500).required(),
  category: Joi.string().required(),
  acceptTerms: Joi.boolean().valid(true).required(),
  acceptBusinessTerms: Joi.boolean().valid(true).required()
  // ... más campos
})
```

## 🏪 **CATEGORÍAS DE NEGOCIO**

```typescript
const businessCategories = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'panaderia', label: 'Panadería' },
  { value: 'cafe', label: 'Café' },
  { value: 'comida_rapida', label: 'Comida Rápida' },
  { value: 'supermercado', label: 'Supermercado' },
  { value: 'reposteria', label: 'Repostería' },
  { value: 'heladeria', label: 'Heladería' },
  { value: 'pizzeria', label: 'Pizzería' },
  { value: 'otro', label: 'Otro' }
]
```

## 🔐 **SEGURIDAD Y AUTENTICACIÓN**

### **Firebase Auth Integration:**
- ✅ **Creación automática** en Firebase Auth
- ✅ **Verificación de email** único
- ✅ **Encriptación de contraseñas** automática
- ✅ **JWT tokens** con expiración de 7 días

### **Firestore Collections:**
```javascript
// Colecciones creadas automáticamente
users/          // Todos los usuarios (clientes y admins de negocio)
businesses/     // Perfiles de negocios
tokens/         // Tokens JWT activos
```

## 🎯 **REDIRECCIÓN INTELIGENTE**

```typescript
// Después del registro exitoso
if (userType === 'user') {
  navigate('/', { replace: true })           // Home principal
} else if (userType === 'business') {
  navigate('/negocio/dashboard', { replace: true })  // Dashboard negocio
}
```

## 🚀 **CÓMO IMPLEMENTAR**

### **1. Frontend Setup:**
```bash
# Instalar dependencias
npm install react-hot-toast

# Agregar ruta en App.tsx
<Route path="/registro" element={<RegisterPage />} />
```

### **2. Backend Setup:**
```bash
# Ya está integrado en functions/routes/auth.js
# Endpoints disponibles:
# POST /auth/register/user
# POST /auth/register/business
```

### **3. Uso del Componente:**
```typescript
import RegisterPage from './pages/auth/RegisterPage'

// O usar el componente directamente:
import DualRegister from './components/auth/DualRegister'

<DualRegister
  onRegisterUser={handleUserRegister}
  onRegisterBusiness={handleBusinessRegister}
  loading={loading}
/>
```

## 🎨 **DISEÑO Y UX**

### **🎯 Principios de Diseño:**
- **Claridad visual** en la selección de tipo
- **Formularios progresivos** sin abrumar al usuario
- **Feedback inmediato** en validaciones
- **Colores consistentes** con la marca ZAVO

### **📱 Responsive Design:**
- **Mobile-first** approach
- **Grid adaptativo** para formularios de negocio
- **Botones táctiles** optimizados
- **Tipografía escalable**

### **✨ Microinteracciones:**
- **Hover effects** en tarjetas de selección
- **Transiciones suaves** entre pasos
- **Loading states** durante registro
- **Toast notifications** para feedback

## 🎉 **BENEFICIOS DEL SISTEMA**

### **👤 Para Usuarios:**
- **Proceso simple** y directo
- **Campos mínimos** necesarios
- **Registro rápido** en menos de 2 minutos

### **🏪 Para Negocios:**
- **Información completa** desde el inicio
- **Categorización automática** para mejor descubrimiento
- **Perfil profesional** listo para usar

### **⚡ Para el Desarrollo:**
- **Código reutilizable** y modular
- **Validación robusta** frontend y backend
- **Escalable** para agregar más tipos de cuenta
- **Mantenible** con TypeScript

## 🔥 **SISTEMA COMPLETO Y FUNCIONAL**

**Este sistema de registro dual proporciona una experiencia de onboarding profesional que diferencia claramente entre clientes y negocios, con formularios optimizados para cada tipo de usuario y una base de datos bien estructurada para escalar.**

---

### **📁 ARCHIVOS CREADOS:**

1. **`src/types/index.ts`** - Tipos actualizados para registro dual
2. **`src/components/auth/DualRegister.tsx`** - Componente principal
3. **`src/pages/auth/RegisterPage.tsx`** - Página con integración
4. **`functions/routes/auth.js`** - Endpoints backend actualizados
5. **`DUAL_REGISTRATION_SYSTEM.md`** - Esta documentación

### **🎯 RUTAS DISPONIBLES:**
- `/registro` → Página de registro dual
- `POST /auth/register/user` → API registro usuario
- `POST /auth/register/business` → API registro negocio

**¡Sistema listo para que usuarios y negocios se registren de forma diferenciada y profesional!** 🚀👥✨
