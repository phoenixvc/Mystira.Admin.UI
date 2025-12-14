# Mystira Admin UI

Admin frontend application for the Mystira platform. A modern single-page application (SPA) for content moderation, administrative workflows, and platform management.

## 🚧 Migration Status

**This repository is currently being set up as part of a migration from `Mystira.App`.**

The Admin UI is being extracted from the `Mystira.App` monorepo into this dedicated repository to enable:

- Independent deployment and versioning
- Separate development workflows
- Modern frontend stack without .NET/Blazor dependencies
- Better separation of concerns between admin tools and main application

## Overview

This is a modern SPA frontend that connects to the `Mystira.Admin.Api` backend service. The Admin API provides a pure REST/gRPC interface (no Razor Pages UI), allowing this frontend to be built with modern web technologies.

## Architecture

```
┌─────────────────┐
│  Admin UI (SPA) │  ← This repository
│  (React/Vue/etc)│
└────────┬────────┘
         │ REST/gRPC
         ▼
┌─────────────────┐
│  Admin API      │  ← Mystira.Admin.Api repository
│  (ASP.NET Core) │
└─────────────────┘
```

## Related Repositories

- **Mystira.Admin.Api**: Backend API service (REST/gRPC endpoints)
- **Mystira.App**: Source repository where Admin UI currently exists (being migrated from)
- **Mystira.workspace**: Unified workspace containing all Mystira components

## Migration Status

**Current Phase**: Phase 3 - Admin UI Code Migration (In Progress)

See [Migration Phases Documentation](../../docs/MIGRATION_PHASES.md) for detailed status and progress tracking.

### Migration Progress

1. ✅ Repository created and registered as submodule
2. ✅ Project structure initialized (React + TypeScript + Vite)
3. ✅ API client infrastructure complete
4. ✅ Authentication flow implemented (cookie-based)
5. ✅ Core pages migrated: Dashboard, Scenarios, Media, Badges, Bundles, Character Maps
6. ✅ Master Data pages: Age Groups, Archetypes, Compass Axes, Echo Types, Fantasy Themes
7. ✅ All import pages: Scenario, Media, Bundle, Badge, Character Map
8. ✅ Reusable UI components: Pagination, SearchBar, LoadingSpinner, ErrorAlert
9. ✅ Form components: FormField, TextInput, Textarea, NumberInput
10. ✅ Toast notifications implemented (react-hot-toast)
11. ✅ Edit forms with React Hook Form + Zod validation:
    - ✅ Edit Scenario
    - ✅ Edit Badge
    - ✅ Edit Character Map
    - ✅ Edit Master Data (Age Groups, Archetypes, Compass Axes, Echo Types, Fantasy Themes)
12. ✅ Create forms with React Hook Form + Zod validation:
    - ✅ Create Scenario
    - ✅ Create Badge
    - ✅ Create Character Map
    - ✅ Create Master Data (Age Groups, Archetypes, Compass Axes, Echo Types, Fantasy Themes)
11. ⏳ Set up CI/CD pipeline
12. ⏳ Deploy and verify functionality
13. ⏳ Remove Admin UI from `Mystira.App` monorepo

## Setup

### Prerequisites

- Node.js 18+ and pnpm 8+
- Admin API running (for development: `http://localhost:5000`)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:7001`

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Development

### Project Structure

```
src/
├── api/          # API client modules (auth, scenarios, media, badges, bundles, etc.)
├── components/   # Reusable components (Pagination, SearchBar, LoadingSpinner, ErrorAlert, FormField, etc.)
├── pages/        # Page components (Dashboard, Scenarios, Media, Badges, etc.)
├── state/        # Zustand stores (auth, UI state)
├── styles/       # CSS files (Bootstrap + custom admin styles)
├── utils/        # Utility functions (toast helpers, etc.)
└── Layout.tsx    # Main layout with navigation
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm typecheck` - Type check without building

## Contributing

This repository is in active migration. Once the initial migration is complete, contribution guidelines will be added.
