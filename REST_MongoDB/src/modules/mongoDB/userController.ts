import { Request, Response } from "express";
import mongoose from "mongoose";
import { models } from "../models/item.js";
import bcrypt from "bcryptjs";

/**
 * A module responsible for the operation of the application with a list of all users in the database.
 */

// Getting the 'User' value from the import.
const { User } = models;

// Processing a request to register a new user.
export const register = async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Checking for the presence of the required 'login' and 'password' fields.
    if (!login || !pass) {
      return res.status(400).json({ error: "Login and password are required" });
    }

    // Checking whether a user with the same login exists in the database.
    const user = await User.findOne({ login });

    if (user) {
      // If a user with the same login already exists => error '400'.
      return res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    }

    // User password encryption.
    const encryptedPassword = await bcrypt.hash(req.body.pass, 10);

    // Registration of a new user => entry into the database.
    await registerUser(login, encryptedPassword);

    res.json({ ok: true });
  } catch (error) {
    // Error processing.
    console.error("Error while handling 'register':", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Processing a request for user authentication (login).
export const login = async (req: Request, res: Response) => {
  try {
    const { login, pass } = req.body;

    // Search for a user with the specified login in the database.
    const user = await User.findOne({ login });

    if (user && (await bcrypt.compare(pass, String(user.pass)))) {
      // If the user is found => authentication is performed.
      req.session.user = user;

      res.send({ ok: true });
    } else {
      // If the user is not found => error '401' (Unauthorized).
      res.status(401).json({ ok: false });
    }
  } catch (error) {
    // Error processing.
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

// Getting the 'id' value of the current user.
export async function getId(req: Request, res: Response) {
  // Getting the current user from the session.
  const currentUser = req.session.user;
  const login = currentUser?.login;

  // Search for a user with the specified login in the database.
  const user = await User.findOne({ login });
  const userId = user?._id;
  return userId;
}

// Function for registering a new user.
async function registerUser(login: string, pass: string) {
  try {
    // Creating a new user.
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      login,
      pass,
      todos: [],
    });

    // Saving user to 'MongoDB'.
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    // Error processing.
    throw new Error(`Failed to register user: ${error}`);
  }
}