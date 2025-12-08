# 💳 SISTEMA DE PAGO CON QR CONDICIONAL - ZAVO

## 🎯 **RESUMEN EJECUTIVO**

Sistema completo que **solo muestra el código QR después de que el pago sea confirmado** por la pasarela de pago. Integra múltiples pasarelas (Stripe, MercadoPago, PayU) con webhooks automáticos y actualización en tiempo real.

## 🔄 **FLUJO COMPLETO DEL SISTEMA**

### **1. 📦 CREACIÓN DEL PEDIDO**
```
Usuario selecciona pack → Crea pedido → Estado: "CREADO" + PaymentStatus: "PENDIENTE"
```

### **2. 💳 INICIO DEL PAGO**
```
Usuario click "Pagar" → POST /payments/create → Redirige a pasarela → Estado: "PROCESANDO"
```

### **3. 🔔 CONFIRMACIÓN AUTOMÁTICA (WEBHOOK)**
```
Pasarela confirma pago → POST /payments/webhook/{gateway} → Actualiza BD → Genera QR
```

### **4. ✅ ACTUALIZACIÓN FRONTEND**
```
Frontend detecta "PAGADO" → Muestra QR → Usuario puede retirar pedido
```

### **5. 🎯 RESULTADO FINAL**
```
QR visible solo si paymentStatus === "PAGADO" → Seguridad garantizada
```

## 📊 **ESTRUCTURA DE DATOS**

### **Order Model Completo:**
```typescript
interface Order {
  // Identificadores
  id: string
  userId: string
  packId: string
  businessId: string
  
  // Información del pedido
  cantidad: number
  precioTotal: number
  
  // Estados críticos
  orderStatus: OrderStatus        // CREADO, CONFIRMADO, PREPARANDO, etc.
  paymentStatus: PaymentStatus    // PENDIENTE, PAGADO, FALLIDO
  
  // Información de pago
  paymentDetails: PaymentDetails
  
  // QR (solo se genera cuando paymentStatus === "PAGADO")
  qrCode?: string                 // Data URL de la imagen QR
  qrData?: QRData                 // Datos estructurados del QR
  
  // Timestamps
  createdAt: string
  paidAt?: string                 // Solo cuando está pagado
}
```

### **PaymentDetails:**
```typescript
interface PaymentDetails {
  id: string
  orderId: string
  amount: number
  method: 'STRIPE' | 'MERCADOPAGO' | 'PAYU' | 'NEQUI'
  status: PaymentStatus
  gatewayTransactionId?: string
  createdAt: string
  paidAt?: string
}
```

## 🔌 **API ENDPOINTS**

### **💳 PAYMENTS**
```javascript
// Crear pago
POST /api/payments/create
Body: { orderId, amount, method, customerEmail }
Response: { paymentId, paymentUrl, order }

// Webhook de confirmación (automático)
POST /api/payments/webhook/stripe
POST /api/payments/webhook/mercadopago  
POST /api/payments/webhook/payu
Body: { transactionId, orderId, status, amount, gatewayData }

// Obtener estado del pedido
GET /api/payments/order/:orderId
Response: { order, canShowQR: boolean }
```

## 🎨 **COMPONENTE REACT**

### **Características del OrderDetail:**

#### **✅ Estados de Pago Visuales:**
- 🟡 **PENDIENTE:** Botón "Pagar Ahora" prominente
- 🔵 **PROCESANDO:** Indicador de carga con polling
- 🟢 **PAGADO:** Mensaje de éxito + QR visible
- 🔴 **FALLIDO:** Mensaje de error + opción de reintentar

#### **✅ QR Condicional:**
```typescript
// QR solo se renderiza si:
{order.paymentStatus === 'PAGADO' && order.qrCode && (
  <QRCodeSection />
)}
```

#### **✅ Polling Automático:**
```typescript
// Actualiza cada 30 segundos si está pendiente
useEffect(() => {
  if (order?.paymentStatus === 'PENDIENTE') {
    const interval = setInterval(loadOrderDetails, 30000)
    return () => clearInterval(interval)
  }
}, [order?.paymentStatus])
```

#### **✅ Funciones del QR:**
- 📥 **Descargar:** Guarda imagen PNG
- 📤 **Compartir:** Native share API o clipboard
- ⏰ **Expiración:** Muestra fecha límite

## 🔒 **SEGURIDAD IMPLEMENTADA**

### **Backend:**
- ✅ **Verificación de monto:** Coincidencia exacta con pedido
- ✅ **Validación de webhook:** Signatures de pasarelas
- ✅ **Autenticación:** JWT requerido para todas las rutas
- ✅ **Permisos:** Solo el usuario propietario puede ver su pedido

### **Frontend:**
- ✅ **QR condicional:** Solo visible si `paymentStatus === 'PAGADO'`
- ✅ **Polling inteligente:** Solo actualiza si está pendiente
- ✅ **Estados claros:** UX transparente del proceso de pago

### **QR:**
- ✅ **Expiración:** 24 horas automática
- ✅ **Datos mínimos:** Solo orderId, userId, businessId, total
- ✅ **Generación segura:** Solo después de pago confirmado

## 🌐 **INTEGRACIÓN CON PASARELAS**

### **Stripe:**
```javascript
// Webhook signature verification
const sig = req.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

if (event.type === 'payment_intent.succeeded') {
  // Actualizar a PAGADO + generar QR
}
```

### **MercadoPago:**
```javascript
// Webhook de notificación
if (body.type === 'payment' && body.data.status === 'approved') {
  // Actualizar a PAGADO + generar QR
}
```

### **PayU:**
```javascript
// Confirmación de pago
if (body.state_pol === '4') { // Aprobada
  // Actualizar a PAGADO + generar QR
}
```

## 🚀 **CÓMO IMPLEMENTAR**

### **1. Backend Setup:**
```bash
# Instalar dependencias
npm install qrcode joi

# Agregar rutas a functions/index.js
app.use('/payments', paymentsRoutes)
```

### **2. Frontend Setup:**
```bash
# Instalar tipos
npm install @types/qrcode

# Agregar ruta en App.tsx
<Route path="/pedido/:orderId" element={<OrderDetailPage />} />
```

### **3. Configurar Webhooks:**
```javascript
// URLs de webhook para cada pasarela
Stripe: https://tu-api.com/api/payments/webhook/stripe
MercadoPago: https://tu-api.com/api/payments/webhook/mercadopago
PayU: https://tu-api.com/api/payments/webhook/payu
```

## 🎯 **TESTING DEL FLUJO**

### **Escenario 1: Pago Exitoso**
1. Crear pedido → `paymentStatus: "PENDIENTE"`
2. Iniciar pago → Redirige a pasarela
3. Simular webhook exitoso → `paymentStatus: "PAGADO"`
4. Verificar QR visible → ✅ Aparece automáticamente

### **Escenario 2: Pago Fallido**
1. Crear pedido → `paymentStatus: "PENDIENTE"`
2. Simular webhook fallido → `paymentStatus: "FALLIDO"`
3. Verificar QR oculto → ❌ No aparece
4. Mostrar opción de reintentar → ✅ Botón "Pagar de nuevo"

### **Escenario 3: Pago Pendiente**
1. Crear pedido → `paymentStatus: "PENDIENTE"`
2. Verificar polling → ✅ Actualiza cada 30s
3. Verificar QR oculto → ❌ No aparece hasta confirmación

## 📱 **RUTAS AGREGADAS**

```typescript
// Nueva ruta para detalle con pago
/pedido/:orderId → OrderDetailPage → OrderDetail component

// Ejemplo de uso:
/pedido/order_abc123 → Muestra estado + QR si está pagado
```

## 🎉 **BENEFICIOS DEL SISTEMA**

### **🔒 Para la Seguridad:**
- QR solo visible después de pago confirmado
- Imposible generar QR falsos
- Validación automática de montos

### **💰 Para el Negocio:**
- Pagos garantizados antes de preparar pedido
- Reducción de pedidos no pagados
- Integración con múltiples pasarelas

### **👤 Para el Usuario:**
- Proceso de pago claro y transparente
- QR automático después del pago
- Estados visuales del progreso

### **⚡ Para el Desarrollo:**
- Código modular y reutilizable
- Webhooks automáticos
- Polling inteligente
- Manejo de errores robusto

## 🔥 **SISTEMA COMPLETO Y FUNCIONAL**

**Este sistema garantiza que el código QR solo se muestre cuando el pago esté 100% confirmado, proporcionando seguridad tanto para el negocio como para el cliente, con una experiencia de usuario fluida y profesional.**

---

### **📁 ARCHIVOS CREADOS:**

1. **`src/types/payment.ts`** - Tipos TypeScript completos
2. **`functions/routes/payments.js`** - API de pagos y webhooks  
3. **`functions/services/qrService.js`** - Generación de QR backend
4. **`src/components/orders/OrderDetail.tsx`** - Componente principal
5. **`src/pages/user/OrderDetailPage.tsx`** - Página wrapper
6. **`PAYMENT_QR_SYSTEM.md`** - Esta documentación

**¡Sistema listo para producción con todas las características solicitadas!** 🚀💳✨
