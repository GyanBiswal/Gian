import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.cookie("token", ""); // Clear the cookie
            return res.status(401).json({ message: "Token has been blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};