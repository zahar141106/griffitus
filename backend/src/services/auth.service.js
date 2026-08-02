import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateToken } from "../utils/jwt.js"
import { createVerificationCode, hashCode } from "./verification.service.js";

export async function register(data) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Заполните все поля");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Некорректный email");
    }

    if (password.length < 8) {
        throw new Error("Пароль должен содержать минимум 8 символов");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("Пользователь уже существует");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
        },
    });

    const token = generateToken(user.id);
    return {
        user: {
            id: user.id,
            email: user.email,
        },
        token,
    };
}

export async function login(data) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Заполните все поля");
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Пользователь не найден");
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordValid) {
        throw new Error("Неверный пароль");
    }

    await createVerificationCode (
        email,
        "login"
    );

    return { 
        requiresVerification: true
    }
} 

export async function loginConfirm({ email, code }) {

    const verification =
        await prisma.verificationCode.findFirst({
            where: {
                email,
                type: "login"
            }
        });

    if (!verification) {
        throw new Error("Verification code not found");
    }

    if (verification.expiresAt < new Date()) {

        await prisma.verificationCode.delete({
            where: {
                id: verification.id
            }
        });

        throw new Error("Code expired");
    }

    const valid =
        hashCode(code) === verification.codeHash;

    if (!valid) {
        throw new Error("Invalid code");
    }

    const user =
        await prisma.user.findUnique({
            where: {
                email
            }
        });

    if (!user) {
        throw new Error("User not found");
    }

    const token = generateToken(user.id);

    await prisma.verificationCode.delete({
        where: {
            id: verification.id
        }
    });

    return {
        message: "Login successful",
        token
    };
}