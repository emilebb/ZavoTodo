# 🚀 **GUÍA COMPLETA: DEPLOY AUTOMÁTICO A FIREBASE HOSTING**

## 📋 **ARCHIVOS YA CREADOS**

✅ `.github/workflows/firebase-hosting.yml` - Workflow de GitHub Actions  
✅ `.firebaserc` - Configuración de proyecto Firebase  
✅ `firebase.json` - Configuración de hosting (ya existía)

---

## 🔧 **PASO 1: CONFIGURAR FIREBASE CONSOLE**

### **1.1 Ir a Firebase Console**
1. Ve a: https://console.firebase.google.com/project/zavowebmobil
2. Click en **"Hosting"** en el menú lateral

### **1.2 Conectar con GitHub**
1. En la página de Hosting, busca **"GitHub Integration"**
2. Click en **"Get started"** o **"Connect repository"**
3. **Autoriza Firebase** para acceder a tu GitHub
4. **Selecciona tu repositorio:** `emilebb/ZavoTodo`
5. **Configura el branch:** `main`

### **1.3 Configurar Build Settings**
```yaml
Build command: npm run build
Output directory: dist
Install command: npm ci
```

---

## 🔑 **PASO 2: CONFIGURAR SECRETS EN GITHUB**

### **2.1 Ir a tu repositorio en GitHub**
1. Ve a: https://github.com/emilebb/ZavoTodo
2. Click en **"Settings"** (pestaña del repositorio)
3. En el menú lateral: **"Secrets and variables"** → **"Actions"**

### **2.2 Agregar Firebase Service Account**
1. Click **"New repository secret"**
2. **Name:** `FIREBASE_SERVICE_ACCOUNT_ZAVOWEBMOBIL`
3. **Value:** (Ver paso 2.3 para obtener este valor)

### **2.3 Obtener Firebase Service Account Key**

**Opción A: Desde Firebase Console**
1. Ve a: https://console.firebase.google.com/project/zavowebmobil/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. **Descarga el archivo JSON**
4. **Copia TODO el contenido** del archivo JSON
5. **Pégalo** como valor del secret

**Opción B: Desde Firebase CLI**
```bash
firebase login:ci
# Copia el token que te da
```

### **2.4 Agregar Variables de Entorno**

Agrega estos secrets uno por uno:

```
VITE_GOOGLE_MAPS_API_KEY = AIzaSyBW_1wyhBqSWYqWqccWI9UPEYHoyEJJOpU
VITE_FIREBASE_API_KEY = tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN = zavowebmobil.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = zavowebmobil
VITE_FIREBASE_STORAGE_BUCKET = zavowebmobil.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = tu_sender_id
VITE_FIREBASE_APP_ID = tu_app_id
```

**Para obtener las credenciales de Firebase:**
1. Ve a: https://console.firebase.google.com/project/zavowebmobil/settings/general
2. Scroll down a **"Your apps"**
3. Click en el ícono de **configuración** de tu app web
4. Copia los valores de `firebaseConfig`

---

## 🎯 **PASO 3: ACTIVAR EL DEPLOY AUTOMÁTICO**

### **3.1 Commitear los archivos**
```bash
git add .
git commit -m "feat: Add Firebase auto-deploy with GitHub Actions

✅ Added GitHub Actions workflow
✅ Configured Firebase project settings
✅ Ready for automatic deployments"
git push origin main
```

### **3.2 Verificar que funciona**
1. Ve a tu repositorio en GitHub
2. Click en **"Actions"** (pestaña superior)
3. Deberías ver el workflow **"Deploy to Firebase Hosting on merge"** ejecutándose
4. Click en el workflow para ver el progreso

---

## 🔍 **PASO 4: PROBAR EL DEPLOY AUTOMÁTICO**

### **4.1 Hacer un cambio de prueba**
```bash
# Edita cualquier archivo, por ejemplo:
echo "<!-- Auto-deploy test -->" >> index.html
git add .
git commit -m "test: Verify auto-deploy works"
git push origin main
```

### **4.2 Verificar el deploy**
1. Ve a **GitHub Actions** y observa el workflow
2. Una vez completado, ve a: https://zavowebmobil.web.app
3. **¡Tu cambio debería estar live automáticamente!**

---

## 📊 **MONITOREO Y LOGS**

### **GitHub Actions**
- **URL:** https://github.com/emilebb/ZavoTodo/actions
- **Ver logs** de cada deploy
- **Notificaciones** por email si falla

### **Firebase Console**
- **URL:** https://console.firebase.google.com/project/zavowebmobil/hosting
- **Ver historial** de deploys
- **Rollback** a versiones anteriores si es necesario

---

## 🚨 **TROUBLESHOOTING**

### **Error: "Firebase Service Account"**
- Verifica que el secret `FIREBASE_SERVICE_ACCOUNT_ZAVOWEBMOBIL` esté configurado
- Asegúrate de que el JSON esté completo (incluye llaves `{}`)

### **Error: "Build failed"**
- Revisa que todas las variables `VITE_*` estén en GitHub Secrets
- Verifica que `npm run build` funcione localmente

### **Error: "Permission denied"**
- Ve a Firebase Console → Project Settings → Service Accounts
- Asegúrate de que el service account tenga permisos de "Firebase Hosting Admin"

### **Deploy no se ejecuta**
- Verifica que el push sea al branch `main`
- Revisa que el archivo `.github/workflows/firebase-hosting.yml` esté en el repositorio

---

## ✅ **RESULTADO FINAL**

Una vez configurado correctamente:

1. **Editas código** en tu proyecto local
2. **Haces commit + push** a GitHub
3. **GitHub Actions** se ejecuta automáticamente:
   - Instala dependencias (`npm ci`)
   - Construye el proyecto (`npm run build`)
   - Despliega a Firebase Hosting
4. **Tu sitio se actualiza** automáticamente en: https://zavowebmobil.web.app

**¡Sin comandos manuales! 🎉**

---

## 🔄 **COMANDOS DE EMERGENCIA**

Si necesitas deploy manual:
```bash
npm run build
firebase deploy --only hosting
```

Si necesitas rollback:
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID TARGET_SITE_ID
```

---

**¡Tu deploy automático está listo! Cada push a main actualizará tu sitio automáticamente.** 🚀
