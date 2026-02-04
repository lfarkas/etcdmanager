# What's New in ETCD Manager 1.3.0

## Major Updates

- **Modernized Tech Stack**: Upgraded to Electron 34, Vue 2.7, and TypeScript 5
- **Node.js 18+ Support**: Now requires Node.js 18 or higher
- **GitHub Actions CI**: Automated multi-platform builds for Linux, macOS, and Windows

## Security Fixes

- Fixed authentication bypass vulnerability in role checking
- Improved permission validation with consistent case handling
- Enhanced SSL certificate path validation

## Bug Fixes

- Fixed missing localStorage remove method causing watcher crashes
- Fixed malformed watcher notification messages
- Fixed incorrect component naming in user editor
- Fixed Vue NavigationDuplicated errors
- Fixed TypeScript errors in health checks and ETCD service
- Fixed memory leaks in IPC listeners
- Improved error handling throughout the application

## Code Quality Improvements

- Removed debug logging statements
- Converted legacy require() to ES6 imports
- Removed duplicate methods and unused dependencies
- Optimized batch operations for role management
- Updated ESLint configuration (migrated from TSLint)

## Build System

- Fixed macOS DMG/PKG build issues
- Added clean script for build artifacts
- Silenced Sass deprecation warnings
- Improved Electron Builder configuration

## Previous Version (1.2.0)

- HTTPS client certificate authentication
- Secure connections (SSL/TLS support)
- Create keys with TTL
- Key list live updates
- Import/export settings
- Profile info in app header
- Lease management
