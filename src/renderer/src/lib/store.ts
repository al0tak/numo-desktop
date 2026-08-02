// Persistent key/value storage, backed by electron-store in the main process.
// Every call crosses IPC, so the whole API is async.
export const store = window.store
