import session from "express-session";
import FileStore from "session-file-store";
import { User } from "../models/user.js";

/*
 Session creation module.
*/

// Session settings.
const FileStoreOptions = { logFn: function () {} };
export const FileStoreInstance = FileStore(session);

const sessionConfig = {
  secret: "my_usual_lightweight_secret_key",
  store: new FileStoreInstance(FileStoreOptions),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
};

// Declaration of the 'express-session' module with the 'SessionData' interface extension.
declare module "express-session" {
  interface SessionData {
    user: User;
    unicId: string;
  }
}

export default sessionConfig;
