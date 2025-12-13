# Kardio Admin Hub

**Organiza tus gastos automáticamente desde tu correo**

Panel administrativo y landing page para Kardio - la app de finanzas personales para Costa Rica 🇨🇷

---

## 📋 Descripción

**Kardio** es una aplicación de finanzas personales que lee los correos de notificación de tu banco y valida cada transacción con tus estados de cuenta. Todo categorizado automáticamente, sin ingresar datos manualmente.

Este repositorio contiene:
- **Landing Page** - Página de marketing con información del producto
- **Admin Hub** - Panel administrativo para gestionar bancos, usuarios, parser configs y monedas

## ✨ Características Principales

- 📧 **Importación automática** - Conecta tu correo y detecta automáticamente los emails de notificación de tu banco
- 🧠 **Categorización inteligente** - Clasifica gastos con ayuda de IA
- 🏦 **Bancos de Costa Rica** - Compatible con BAC, BCR, Banco Nacional y más
- 🔄 **Detección de suscripciones** - Identifica pagos recurrentes automáticamente
- ✅ **Validación con estados de cuenta** - Cruza notificaciones con estados de cuenta

## 🔒 Seguridad

- **No pedimos clave del banco** - Nunca necesitamos credenciales bancarias
- **Solo lectura de correos** - Acceso únicamente a correos de notificaciones bancarias
- **Datos encriptados** - AES-256 en reposo, TLS 1.3 en tránsito

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **shadcn/ui** + **Radix UI** - Componentes
- **TanStack Query** - Data fetching y cache
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** + **Zod** - Formularios y validación
- **Recharts** - Gráficos
- **Lucide React** - Iconos

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Testing de componentes

### Tooling
- **ESLint** - Linting
- **OpenAPI TypeScript Codegen** - Generación de cliente API

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── generated/          # Cliente API generado desde OpenAPI
│   └── services/           # Thin service wrappers
├── components/
│   ├── admin/              # Componentes del panel admin
│   │   ├── banks/          # BankFormDialog, BanksTable, BankCard
│   │   ├── currencies/     # CurrenciesTab, SynonymsTab, SummaryCard
│   │   ├── parser-configs/ # Filters, Table, Card, Settings cards
│   │   └── users/          # UsersTable, UserCard, RoleChangeDialog
│   ├── auth/               # LoginForm
│   ├── landing/            # Navbar, Hero, Features, Security, etc.
│   ├── shared/             # AppLogo, BackgroundDecoration
│   └── ui/                 # shadcn/ui components
├── contexts/               # AuthContext
├── domain/                 # Domain types (Bank, User, ParserConfig, Currency)
├── hooks/                  # Custom hooks
│   ├── useBankForm.ts
│   ├── useBanksList.ts
│   ├── useUserRoleChange.ts
│   ├── useUsersList.ts
│   ├── useParserConfigEditor.ts
│   ├── useParserConfigsList.ts
│   └── useDashboardStats.ts
├── layouts/                # AdminLayout
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── Login.tsx           # Login page
│   └── admin/              # Admin pages
│       ├── Dashboard.tsx
│       ├── Banks.tsx
│       ├── Users.tsx
│       ├── ParserConfigs.tsx
│       ├── ParserConfigEditor.tsx
│       └── Currencies.tsx
├── stores/                 # Zustand stores + TanStack Query hooks
│   ├── banksStore.ts
│   ├── usersStore.ts
│   ├── parserConfigsStore.ts
│   └── currenciesStore.ts
└── test/                   # Test setup and utilities
```

## 🚀 Comenzar

### Prerrequisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Parallax-Solutions/kardio-admin-hub.git
cd kardio-admin-hub

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run build:dev    # Build de desarrollo
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run test         # Ejecutar tests en modo watch
npm run test:run     # Ejecutar tests una vez
npm run test:coverage # Ejecutar tests con coverage
npm run generate:api # Regenerar cliente API desde OpenAPI
```

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

### Generar Cliente API

El cliente API se genera automáticamente desde el schema OpenAPI del backend:

```bash
# Asegúrate de que el backend esté corriendo en localhost:3001
npm run generate:api
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test:run

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test
```

### Cobertura de Tests

- `src/api/services/http.test.ts` - unwrapData helper
- `src/stores/parserConfigsStore.test.ts` - transformConfig, data normalization
- `src/hooks/useBankForm.test.ts` - Bank form state management
- `src/hooks/useUserRoleChange.test.ts` - User role change dialog

## 📐 Arquitectura

### Patrón de Páginas Admin

Todas las páginas admin siguen un patrón consistente:

```tsx
export default function AdminPage() {
  const { data, isLoading, error, ...actions } = usePageHook();

  if (error) return <ErrorState />;

  return (
    <div>
      <PageHeader />
      <FiltersComponent />
      <TableComponent />      {/* Desktop */}
      <CardsComponent />      {/* Mobile */}
      <DialogComponent />
    </div>
  );
}
```

### Separación de Responsabilidades

- **Pages** - Composición de componentes, mínima lógica
- **Hooks** - Lógica de negocio y estado
- **Components** - UI presentacional
- **Stores** - Estado global y data fetching
- **Services** - Wrappers del cliente API

## 🎨 Design System

El proyecto usa un design system basado en:

- **TailwindCSS** con configuración personalizada
- **shadcn/ui** como base de componentes
- **CSS Variables** para theming (light/dark mode)
- **Responsive design** mobile-first

### Colores Principales

- `primary` - Verde teal (#0d9488)
- `accent` - Coral (#f97316)
- `success`, `warning`, `destructive`, `info` - Estados

## 📄 Licencia

Este proyecto es privado y propietario de Parallax Solutions.
