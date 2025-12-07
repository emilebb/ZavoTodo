#!/bin/bash

# 🚀 ZAVO - Script de configuración automática para Firebase Auto-Deploy

echo "🚀 Configurando Firebase Auto-Deploy para ZAVO..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

# Login a Firebase (si no está logueado)
echo "🔑 Verificando autenticación con Firebase..."
firebase login --no-localhost

# Configurar proyecto Firebase
echo "⚙️ Configurando proyecto Firebase..."
firebase use zavowebmobil

# Verificar que los archivos necesarios existen
echo "📁 Verificando archivos de configuración..."

if [ ! -f ".github/workflows/firebase-hosting.yml" ]; then
    echo "❌ Falta: .github/workflows/firebase-hosting.yml"
    exit 1
fi

if [ ! -f ".firebaserc" ]; then
    echo "❌ Falta: .firebaserc"
    exit 1
fi

if [ ! -f "firebase.json" ]; then
    echo "❌ Falta: firebase.json"
    exit 1
fi

echo "✅ Todos los archivos de configuración están presentes"

# Hacer commit de los archivos
echo "📝 Commiteando archivos de configuración..."
git add .
git commit -m "feat: Setup Firebase auto-deploy with GitHub Actions

✅ Added GitHub Actions workflow for automatic deployment
✅ Configured Firebase project settings
✅ Added comprehensive setup documentation

Auto-deploy will trigger on every push to main branch"

# Push a GitHub
echo "🚀 Subiendo cambios a GitHub..."
git push origin main

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a GitHub: https://github.com/emilebb/ZavoTodo/settings/secrets/actions"
echo "2. Agrega el secret: FIREBASE_SERVICE_ACCOUNT_ZAVOWEBMOBIL"
echo "3. Agrega las variables de entorno VITE_*"
echo "4. ¡Haz un push y observa el deploy automático!"
echo ""
echo "📖 Guía completa: FIREBASE_AUTO_DEPLOY.md"
echo "🌐 Tu sitio: https://zavowebmobil.web.app"
