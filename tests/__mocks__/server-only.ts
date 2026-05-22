// Shim for the "server-only" package so that modules guarded by it can be
// imported from a Node test environment. The real package throws when bundled
// for the browser; in tests we just no-op.
export {};
