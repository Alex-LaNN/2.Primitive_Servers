import { Request, Response } from "express";
import * as app from "./dataController.js";
import bcrypt from "bcryptjs";

/*
 User logic module.
*/

// Processing a request to register a new user.
export const register = async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Checking for the presence of the required login and password fields.
    if (!login || !pass) {
      return res
        .status(400)
        .json({ error: "Login and password are required!" });
    }

    // Loading all users from the database.
    const users = await app.loadUsersFromDb();

    // Encryption of the password entered by the user.
    const encryptedPassword = await bcrypt.hash(req.body.pass, 10);

    // Checking whether a user with the same login exists in the database.
    const existingUser = users.find((user: any) => user.login === login);
    if (existingUser) {
      // If a user with the same login already exists => error '400'.
      return res
        .status(400)
        .json({ error: "A user with this login already exists!" });
    }

    // Registration of a new user (recording to a file for storage).
    await app.registerUser(login, encryptedPassword);

    res.json({ ok: true });
  } catch (error) {
    // Handling errors during registration.
    console.error("Error while handling 'register':", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Processing a request for user authentication (login).
export const login = async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Search for a user with the specified 'login' in the 'dbItems.json' file.
    const user = await app.findUserInDb(login);

    if (user && (await bcrypt.compare(pass, String(user.pass)))) {
      // If the user is found => authentication is performed.
      req.session.regenerate((error) => {
        if (error) {
          // Handling an error during session regeneration, if it occurs.
          console.log(`22 Error during session regeneration: ${error}`);
          return;
        }
        // If the user is found, save information about him in the session.
        req.session.user = user;
        // Saving the session to storage.
        req.session.save(() => {
          res.json({ ok: true });
        });
      });
    } else {
      // If the user is not found => error '401' (Unauthorized).
      res.status(401).json({ ok: false });
    }
  } catch (error) {
    console.error("Error while handling 'login':", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Processing a request to log out a user.
export const logout = (req: Request, res: Response) => {
  // Deleting a user session.
  req.session.destroy(() => {
    res.json({ ok: true });
  });
};

