# 🚀 ZAVO - Guía de Despliegue

## 📋 Requisitos Previos

1. **Firebase CLI instalado:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Autenticado en Firebase:**
   ```bash
   firebase login
   ```

3. **Proyecto Firebase creado** en [Firebase Console](https://console.firebase.google.com)

## 🔧 Configuración

### 1. Variables de Entorno

Actualiza `.env.production` con tus credenciales:

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 2. Inicializar Firebase (si no está hecho)

```bash
firebase init
```

Selecciona:
- ✅ Firestore
- ✅ Hosting
- ✅ Storage

## 🚀 Comandos de Despliegue

### Despliegue Completo
```bash
npm run deploy
```

### Solo Hosting
```bash
npm run deploy:hosting
```

### Emuladores Locales
```bash
npm run firebase:emulators
```

## 📁 Estructura de Archivos

```
zavo/
├── firebase.json          # Configuración Firebase
├── firestore.rules        # Reglas Firestore
├── firestore.indexes.json # Índices Firestore
├── storage.rules          # Reglas Storage
├── .env.production        # Variables producción
└── dist/                  # Build de producción
```

## 🔍 Verificación Post-Despliegue

1. **Hosting URL:** https://tu-proyecto.web.app
2. **Verificar Google Maps** funciona
3. **Verificar Firebase Auth** funciona
4. **Verificar Firestore** conecta correctamente

## 🛠️ Troubleshooting

### Error: "Google Maps API Key"
- Verifica que la API key esté en `.env.production`
- Configura dominios permitidos en Google Cloud Console

### Error: "Firebase not initialized"
- Ejecuta `firebase login`
- Verifica `firebase.json` existe

### Error: "Build failed"
- Ejecuta `npm run build` para ver errores
- Verifica todas las dependencias están instaladas

## 📊 Monitoreo

- **Firebase Console:** https://console.firebase.google.com
- **Google Cloud Console:** https://console.cloud.google.com
- **Analytics:** Firebase Analytics dashboard

## 🔄 CI/CD (Opcional)

Para automatizar despliegues, configura GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: tu-proyecto-id
```
