# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-02-04

### Added
- GitHub Actions CI for automated multi-platform builds
- CLAUDE.md project documentation for AI assistance

### Changed
- Upgraded to Electron 34 (from Electron 6)
- Upgraded to Vue 2.7 and TypeScript 5
- Requires Node.js 18 or higher
- Migrated from TSLint to ESLint
- Converted legacy require() calls to ES6 imports

### Fixed
- Security: Authentication bypass in role checking now returns false for unauthenticated users
- Security: Permission validation uses consistent case handling
- Security: SSL certificate path validation improved
- Bug: Missing localStorage.remove() method causing watcher crashes
- Bug: Malformed watcher notification messages (extra quotes)
- Bug: Incorrect component name in user-editor.vue
- Bug: Vue NavigationDuplicated errors on startup
- Bug: TypeScript errors in health.vue and etcd.service.ts
- Bug: Memory leaks in IPC event listeners
- Build: macOS DMG/PKG build issues resolved

### Removed
- Unused 'markdown' dependency (using 'marked' instead)
- Duplicate loadRole() method in RoleService
- Debug console.log statements

## [1.2] - 2020-06-21

### Added
- Lease management
- Creation of keys with TTL
- HTTPS connections
- SSL / TLS support
- Certificate based authentication
- Settings import / export
- Display profile settings in header


### Fixed
- Username pattern is now more relaxed
- App now works without internet connection
- Improved profile handling, added batter config management.
- List auto refresh issues (keys, leases etc) 


## [0.1.2-beta.4] - 2019-08-19
### Added
- Quick help is now available everywhere
- Keyboard shortcuts on all screens
- Test connection function (settings)
- Cluster header info section is now displayed (cluster)

### Fixed
- Reopening editor views after edit now properly clears all fields.
- Adding the same action twice is prevented (watchers)
- Show validation error automatically if its on another tab (settings) 

### Changed
- Added basic usage instructions, screenshot and new sections to README.

## [0.1.2-beta] - 2019-08-03
### Added
- The first publicly available version and the corresponding binary builds

