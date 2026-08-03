import * as authService from "../services/auth.service.js";
import prisma from "../prisma.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { hashCode, createVerificationCode } from "../services/verification.service.js"

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

export async function loginConfirm(req, res) {
    try {
        const result = await authService.loginConfirm(req.body);

        return res.status(200).json(result);

    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

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

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;

        await createVerificationCode(email, "password_reset");

        return res.json({
            message: "Password reset code sent"
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
}

export async function resetPassword(req, res) {

    try {

        const result =
            await authService.resetPassword(req.body);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            error: error.message
        });

    }

}

export async function confirmRegister(req, res) {

    try {

        const result =
            await authService.confirmRegister(
                req.body
            );


        return res.status(201).json(result);


    } catch(error) {

        return res.status(400).json({
            error: error.message
        });

    }
}
export async function resendCode(req, res) {
    try {

        const {
            email,
            type
        } = req.body;


        if (!email || !type) {
            return res.status(400).json({
                error: "Email and type are required"
            });
        }


        await createVerificationCode(
            email,
            type
        );


        return res.json({
            message: "Verification code sent"
        });


    } catch (error) {

        return res.status(400).json({
            error: error.message
        });

    }
}


