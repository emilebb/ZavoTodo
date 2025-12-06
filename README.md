# ZAVO - Rescata comida, salva el planeta 🌱

ZAVO es una aplicación web desarrollada con React + Zustand + Supabase + TanStack Query que conecta negocios con usuarios para reducir el desperdicio alimentario a través de "packs sorpresa" con descuentos.

## 🚀 Características

### Para Usuarios
- **Explorar packs sorpresa**: Encuentra comida con descuentos de hasta 70%
- **Mapa interactivo**: Visualiza negocios cercanos con packs disponibles
- **Códigos QR**: Sistema de recogida seguro con códigos QR únicos
- **Historial de pedidos**: Rastrea todos tus packs rescatados
- **Impacto ambiental**: Visualiza cuánta comida has ayudado a rescatar

### Para Negocios
- **Dashboard completo**: Estadísticas de ventas, pedidos y impacto
- **Gestión de packs**: Crear, editar y gestionar packs sorpresa
- **Gestión de pedidos**: Ver y marcar pedidos como recogidos
- **Perfil del negocio**: Administrar información y ubicación

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estado Global**: Zustand
- **Backend**: Supabase (Auth + Database + Storage)
- **Server State**: TanStack Query
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Notifications**: React Hot Toast

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## ⚙️ Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd zavo-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Copiar `.env.example` a `.env.local`
3. Agregar las credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar la base de datos

Ejecutar las siguientes consultas SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT CHECK (rol IN ('usuario', 'negocio')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de negocios
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  horario TEXT NOT NULL,
  imagen TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de packs
CREATE TABLE packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio_original DECIMAL NOT NULL,
  precio_descuento DECIMAL NOT NULL,
  porcentaje_descuento INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  hora_retiro_desde TIME NOT NULL,
  hora_retiro_hasta TIME NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
  estado TEXT CHECK (estado IN ('pendiente', 'confirmado', 'recogido', 'cancelado')) DEFAULT 'pendiente',
  qr_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view businesses" ON businesses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Business owners can manage own business" ON businesses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active packs" ON packs FOR SELECT TO authenticated USING (activo = true);
CREATE POLICY "Business owners can manage own packs" ON packs FOR ALL USING (
  business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Business owners can view orders for their packs" ON orders FOR SELECT USING (
  pack_id IN (
    SELECT p.id FROM packs p 
    JOIN businesses b ON p.business_id = b.id 
    WHERE b.user_id = auth.uid()
  )
);
```

### 5. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📱 Uso

### Registro y Login
1. Visita `/auth/role` para seleccionar tu tipo de cuenta
2. Completa el registro como Usuario o Negocio
3. Inicia sesión con tus credenciales

### Como Usuario
1. Explora packs disponibles en la página principal
2. Usa el mapa para encontrar negocios cercanos
3. Compra packs y recibe códigos QR
4. Presenta el QR en el negocio para recoger tu pack

### Como Negocio
1. Completa tu perfil de negocio
2. Crea packs sorpresa con precios y horarios
3. Gestiona pedidos entrantes
4. Marca pedidos como recogidos cuando los usuarios lleguen

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   ├── layouts/        # Layouts de páginas
│   └── navigation/     # Componentes de navegación
├── hooks/              # Custom hooks
├── lib/                # Configuración de librerías
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Páginas de autenticación
│   ├── user/           # Páginas para usuarios
│   └── business/       # Páginas para negocios
├── services/           # Servicios de API
├── store/              # Stores de Zustand
└── types/              # Definiciones de TypeScript
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar ESLint

## 🚀 Deployment

### Netlify (Recomendado)
1. Conectar el repositorio a Netlify
2. Configurar variables de entorno
3. Deploy automático en cada push

### Vercel
1. Importar proyecto en Vercel
2. Configurar variables de entorno
3. Deploy automático

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🌟 Roadmap

- [ ] Integración con Google Maps
- [ ] Notificaciones push
- [ ] Sistema de calificaciones
- [ ] Chat en tiempo real
- [ ] Aplicación móvil (React Native)
- [ ] Panel de administración
- [ ] Analytics avanzados
- [ ] Integración con pasarelas de pago

## 📞 Soporte

Para soporte, envía un email a soporte@zavo.co o crea un issue en GitHub.

---

**ZAVO** - Reduciendo el desperdicio alimentario, un pack a la vez 🌱
