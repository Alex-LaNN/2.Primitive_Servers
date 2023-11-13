import session from "express-session";
import FileStore from "session-file-store";

/**
 * Session configuration module in Express.
 */

// Options for session storage in the file system.
const FileStoreOptions = { logFn: function () {} }; // { to disable logging }.
const FileStores = FileStore(session);

// Session configuration.
const sessionConfig = {
  secret: "my_usual_lightweight_secret_key",
  store: new FileStores(FileStoreOptions),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
};

// Extending session data types for use in an Express application.
declare module "express-session" {
  interface SessionData {
    unicId: string;
    userIndex: number;
  }
}

export default sessionConfig;