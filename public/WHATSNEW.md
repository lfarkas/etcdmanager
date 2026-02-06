# What's New in ETCD Manager 1.3.2

## Lease Management Improvements

- **Hex Lease IDs**: Lease IDs are now displayed in hexadecimal format, matching etcd CLI and documentation conventions
- Fixed countdown timer bugs (double-assignment, going negative)
- Fixed crash when viewing leases with no attached keys
- Fixed TTL type mismatch causing display errors
- Eliminated duplicate API call when opening lease details
- Replaced moment.js with simple math for time display
- Fixed loading spinner getting stuck on fetch errors

## Code Quality

- Fixed all 156 ESLint warnings across the codebase
- Migrated all @ts-ignore directives to @ts-expect-error
- Removed unused error classes and dead code

## Previous Version (1.3.0)

- Modernized tech stack: Electron 34, Vue 2.7, TypeScript 5
- GitHub Actions CI for automated multi-platform builds
- Security fixes for auth bypass, permission validation, SSL paths
- Fixed watcher crashes, memory leaks, and navigation errors
