import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateToken } from "../utils/jwt.js";
import {
    createVerificationCode,
    verifyCode
} from "./verification.service.js";


// ==============================
// REGISTRATION
// ==============================

export async function register(data) {

    const {
        email,
        password
    } = data;


    if (!email || !password) {
        throw new Error("Заполните все поля");
    }


    if (!validator.isEmail(email)) {
        throw new Error("Некорректный email");
    }


    if (password.length < 8) {
        throw new Error(
            "Пароль должен содержать минимум 8 символов"
        );
    }


    const existingUser =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


    if(existingUser){
        throw new Error(
            "Пользователь уже существует"
        );
    }


    await createVerificationCode(
        email,
        "register"
    );


    return {
        message:
            "Verification code sent"
    };
}




// ==============================
// LOGIN REQUEST
// ==============================

export async function login(data) {

    const {
        email,
        password
    } = data;


    if (!email || !password) {
        throw new Error(
            "Заполните все поля"
        );
    }


    const user =
        await prisma.user.findUnique({
            where: {
                email
            }
        });


    if (!user) {
        throw new Error(
            "Пользователь не найден"
        );
    }


    const passwordValid =
        await bcrypt.compare(
            password,
            user.passwordHash
        );


    if (!passwordValid) {
        throw new Error(
            "Неверный пароль"
        );
    }


    await createVerificationCode(
        email,
        "login"
    );


    return {
        requiresVerification: true
    };
}




// ==============================
// LOGIN CONFIRM
// ==============================

export async function loginConfirm({
    email,
    code
}) {


    await verifyCode(
        email,
        code,
        "login"
    );


    const user =
        await prisma.user.findUnique({
            where: {
                email
            }
        });


    if (!user) {
        throw new Error(
            "User not found"
        );
    }


    const token =
        generateToken(user.id);


    return {
        message: "Login successful",

        token,

        user: {
            id: user.id,
            email: user.email
        }
    };
}




// ==============================
// REGISTER CONFIRM
// ==============================

export async function confirmRegister(data) {

    const {
        email,
        code,
        password
    } = data;


    if (!email || !code || !password) {
        throw new Error(
            "Fill all fields"
        );
    }


    if (password.length < 8) {
        throw new Error(
            "Password must contain at least 8 characters"
        );
    }


    await verifyCode(
        email,
        code,
        "register"
    );


    const exists =
        await prisma.user.findUnique({
            where: {
                email
            }
        });


    if (exists) {
        throw new Error(
            "User already exists"
        );
    }


    const passwordHash =
        await bcrypt.hash(
            password,
            10
        );


    const user =
        await prisma.user.create({
            data: {
                email,
                passwordHash
            }
        });


    return {
        message: "User created successfully",

        user: {
            id: user.id,
            email: user.email
        }
    };
}




// ==============================
// PASSWORD RESET
// ==============================

export async function resetPassword(data) {

    const {
        email,
        code,
        newPassword
    } = data;


    if (!email || !code || !newPassword) {
        throw new Error(
            "Fill all fields"
        );
    }


    if (newPassword.length < 8) {
        throw new Error(
            "Password must contain at least 8 characters"
        );
    }


    await verifyCode(
        email,
        code,
        "password_reset"
    );


    const user =
        await prisma.user.findUnique({
            where: {
                email
            }
        });


    if (!user) {
        throw new Error(
            "User not found"
        );
    }


    const passwordHash =
        await bcrypt.hash(
            newPassword,
            10
        );


    await prisma.user.update({
        where: {
            email
        },
        data: {
            passwordHash
        }
    });


    return {
        message:
            "Password updated successfully"
    };
}