import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await userService.createUser({ email, password });
        const token = user.generateJWT(user._id);
        res.status(201).json({ user, token });
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
