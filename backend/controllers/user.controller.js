import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
    console.log("BODY:", req.body)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        const user = await userService.createUser({ name, email, password });
        const token = user.generateJWT(user._id);
        res.status(201).json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};  

export const loginUserController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        const user = await userModel
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = user.generateJWT();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {

        console.error("Error logging in user:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const profileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutController = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        await redisClient.set(token, "blacklisted", "EX", 24 * 60 * 60);

        res.clearCookie("token");

        res.json({
            message: "User logged out successfully"
        });

    } catch (error) {
        console.error("Error logging out user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
