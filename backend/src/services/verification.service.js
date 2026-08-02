import prisma from "../prisma.js";
import { sendVerificationEmail } from "./mail.service.js";
import crypto from "crypto";

export function hashCode(code) {
    return crypto 
        .createHash("sha256")
        .update(code)
        .digest("hex");
}

export async function createVerificationCode(email, type) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = hashCode(code);

    await prisma.verificationCode.deleteMany({
        where: {
            email,
            type,
        },
    });

    await prisma.verificationCode.create({
        data: {
            email,
            type,
            codeHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });

    await sendVerificationEmail(email, code);

    console.log(`
==============================
Verification code
Email: ${email}
Type: ${type}
Code: ${code}
==============================
`);

    return true; 
}