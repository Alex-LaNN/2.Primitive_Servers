import session from "express-session";
import FileStore from "session-file-store";
import { User } from "./user.js";

/*
 Модуль создания сессии.
*/

// Настройки сессии.
const FileStoreOptions = { logFn: function () {} };
const FileStoreInstance = FileStore(session);

const sessionConfig = {
  secret: "my_usual_lightweight_secret_key",
  store: new FileStoreInstance(FileStoreOptions),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
};

// Объявление модуля "express-session" с расширением интерфейса 'SessionData'.
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export default sessionConfig;
