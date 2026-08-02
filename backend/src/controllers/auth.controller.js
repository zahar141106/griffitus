import * as authService from "../services/auth.service.js";
import prisma from "../prisma.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { hashCode } from "../services/verification.service.js"

export async function register(req, res) {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json(result);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}
export async function login(req, res) {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}
import { createVerificationCode } from "../services/verification.service.js";

export async function requestRegister(req, res) {
    try {
        const { email } = req.body;

        await createVerificationCode(email, "register");

        res.json({
            message: "Verification code sent"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

export async function confirmRegister(req, res) {
    try {
        const {
            email,
            code,
            password
        } = req.body;

        const verification =
            await prisma.verificationCode.findFirst({
                where: {
                    email,
                    type: "register"
                }
            });

        if (!verification) {
            return res.status(400).json({
                error: "Verification code not found"
            });
        }

        if (verification.expiresAt < new Date()) {
            await prisma.verificationCode.delete({
                where: {
                    id: verification.id
                }
            });

            return res.status(400).json({
                error: "Code expired"
            });
        }

        const isValid =
            hashCode(code) === verification.codeHash;

        if (!isValid) {
            return res.status(400).json({
                error: "Invalid code"
            });
        }

        const exists =
            await prisma.user.findUnique({
                where: {
                    email
                }
            });

        if (exists) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const passwordHash =
            await bcrypt.hash(password, 10);

        const user =
            await prisma.user.create({
                data: {
                    email,
                    passwordHash
                }
            });

        await prisma.verificationCode.delete({
            where: {
                id: verification.id
            }
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

