import userModel from "../models/user.model.js";

export const createUser = async ({ name, email, password }) => {

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashPassword = await userModel.hashPassword(password);

    // Create user
    const user = await userModel.create({
        name,
        email,
        password: hashPassword
    });

    return user;
};