import crypto from "crypto";

//configuration for generating  10 random digits
export default function generateId() {
    const id = crypto.randomInt(0, 10**10);
    return id.toString().padStart(10, '0');
}