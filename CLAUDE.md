# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ETCD Manager is a cross-platform desktop GUI client for ETCD v3 clusters, built with Electron + Vue.js 2 + TypeScript. It supports Windows, macOS, and Linux.

## Build Commands

```bash
# Install dependencies
yarn install

# Rebuild gRPC native extension for Electron (required after install)
npm rebuild --target=ELECTRON_VERSION --runtime=electron --dist-url=https://atom.io/download/electron
# Get ELECTRON_VERSION with: yarn list electron

# Development
yarn electron:serve      # Start Electron dev build with hot reload

# Production builds
yarn electron:build              # Build for current platform
yarn electron:build:linux        # Linux (AppImage, snap, tar.gz)
yarn electron:build:mac          # macOS (DMG)
yarn electron:build:win          # Windows (NSIS installer)

# Linting
yarn lint                # Run TSLint on TypeScript files

# Testing
yarn test                # Run Mocha/Spectron e2e tests (test/spec/)
```

## Architecture

### Technology Stack
- **Desktop**: Electron 6
- **Frontend**: Vue.js 2.6 with Vuetify 1.5 (Material Design)
- **State**: Vuex for global state management
- **ETCD Client**: etcd3 library with gRPC

### Source Structure

```
src/
├── main.ts              # Vue app entry point
├── background.ts        # Electron main process
├── router.ts            # Vue Router with route guards
├── store.ts             # Vuex store (connection state, profiles, watchers)
├── components/          # Vue single-file components (.vue)
├── services/            # Business logic classes wrapping etcd3 client
│   ├── etcd.service.ts  # Base ETCD client wrapper
│   ├── key.service.ts   # Key-value operations
│   ├── user.service.ts  # User management
│   ├── role.service.ts  # RBAC operations
│   ├── lease.service.ts # Lease management
│   ├── watcher.service.ts # Key change watchers
│   ├── auth.service.ts  # Authentication
│   └── config.service.ts # Profile/config persistence
├── lib/                 # Shared utilities and base classes
│   ├── crud.class.ts    # Base CRUD operations
│   ├── editor.class.ts  # Editor component base
│   ├── dialog.class.ts  # Dialog component base
│   └── validators.ts    # Form validation rules
├── guards/              # Vue Router navigation guards
└── i18n/                # Translations (en.ts, hu.ts)
```

### Service Layer Pattern
Services extend `EtcdService` which wraps the `etcd3` client. Each domain has its own service (KeyService, UserService, RoleService, etc.) that handles operations for that domain.

### State Management
The Vuex store in `store.ts` holds:
- ETCD connection instance (`connection: EtcdService`)
- Profile configuration (hosts, port, SSL, auth)
- Active watcher listeners (`listeners: Map`)
- UI state (loading, messages)

### Route Protection
Routes like `/keys`, `/users`, `/roles`, `/cluster`, `/watchers` are protected by `isConfiguredGuard` which ensures ETCD connection is configured before access.

## Code Style

- **TypeScript**: Strict mode enabled
- **Linter**: TSLint with AirBnB config
- **Formatting**: Prettier (4-space indent, single quotes, trailing commas)
- **Max line length**: 140 characters

## Testing

Tests use Mocha + Chai + Spectron for e2e testing of the Electron app.

```
test/
├── spec/                # Test files
├── pageobjects/         # Spectron page objects
└── shared/              # Shared utilities
```

**UI Test Selectors**: All testable UI elements must have `data-test` attributes with the naming convention: `componentName-operation-elementType` (e.g., `data-test="config.settings-actions-submit.v-btn"`).

## Key Configuration Files

- `vue.config.js` - Vue CLI config with Electron Builder settings
- `tsconfig.json` - TypeScript compiler options (strict mode, ESNext target)
- `tslint.json` - Linting rules (AirBnB-based)
- `.huskyrc.js` - Pre-commit/pre-push hooks run `yarn lint`

## Internationalization

Translation files are in `src/i18n/`. To add a new language, create a new file following the pattern in `en.ts`.
