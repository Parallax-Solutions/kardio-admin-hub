# Kardio Admin Hub

**Automatically organize your expenses from your email**

Admin panel and landing page for Kardio - the personal finance app for Costa Rica 🇨🇷

---

## 📋 Description

**Kardio** is a personal finance application that reads bank notification emails and validates each transaction with your account statements. Everything is automatically categorized, without manual data entry.

This repository contains:
- **Landing Page** - Marketing page with product information
- **Admin Hub** - Administrative panel to manage banks, users, parser configs, and currencies

## ✨ Key Features

- 📧 **Automatic import** - Connect your email and automatically detect bank notification emails
- 🧠 **Smart categorization** - Classify expenses with AI assistance
- 🏦 **Costa Rica banks** - Compatible with BAC, BCR, Banco Nacional, and more
- 🔄 **Subscription detection** - Automatically identify recurring payments
- ✅ **Statement validation** - Cross-reference notifications with account statements

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** + **Radix UI** - Components
- **TanStack Query** - Data fetching and cache
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** + **Zod** - Forms and validation
- **Recharts** - Charts
- **Lucide React** - Icons

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Component testing

### Tooling
- **ESLint** - Linting
- **OpenAPI TypeScript Codegen** - API client generation

## 📁 Project Structure

```
src/
├── api/
│   ├── generated/          # API client generated from OpenAPI
│   └── services/           # Thin service wrappers
├── components/
│   ├── admin/              # Admin panel components
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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Parallax-Solutions/kardio-admin-hub.git
cd kardio-admin-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview build
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
npm run generate:api # Regenerate API client from OpenAPI
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001
```

### Generate API Client

The API client is automatically generated from the backend's OpenAPI schema:

```bash
# Make sure the backend is running on localhost:3001
npm run generate:api
```

## 🧪 Testing

```bash
# Run all tests
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test
```

### Test Coverage

- `src/api/services/http.test.ts` - unwrapData helper
- `src/stores/parserConfigsStore.test.ts` - transformConfig, data normalization
- `src/hooks/useBankForm.test.ts` - Bank form state management
- `src/hooks/useUserRoleChange.test.ts` - User role change dialog

## 📐 Architecture

### Admin Pages Pattern

All admin pages follow a consistent pattern:

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

### Separation of Concerns

- **Pages** - Component composition, minimal logic
- **Hooks** - Business logic and state
- **Components** - Presentational UI
- **Stores** - Global state and data fetching
- **Services** - API client wrappers

## 🎨 Design System

The project uses a design system based on:

- **TailwindCSS** with custom configuration
- **shadcn/ui** as component base
- **CSS Variables** for theming (light/dark mode)
- **Responsive design** mobile-first

### Main Colors

- `primary` - Teal green (#0d9488)
- `accent` - Coral (#f97316)
- `success`, `warning`, `destructive`, `info` - Status colors

## 📄 License

This project is private and proprietary to Parallax Solutions.
