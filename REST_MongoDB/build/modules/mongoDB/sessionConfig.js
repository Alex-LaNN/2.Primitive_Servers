import session from "express-session";
import FileStore from "session-file-store";
const FileStoreOptions = { logFn: function () { } };
const FileStores = FileStore(session);
const sessionConfig = {
    secret: "my_usual_lightweight_secret_key",
    store: new FileStores(FileStoreOptions),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
};
export default sessionConfig;
