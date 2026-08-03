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

    const lastCode =
        await prisma.verificationCode.findFirst({
            where: {
                email,
                type,
            },
            orderBy: {
                createdAt: "desc",
            },
        });


    if (lastCode) {

        const secondsPassed =
            (Date.now() - lastCode.createdAt.getTime()) / 1000;


        if (secondsPassed < 60) {

            const wait =
                Math.ceil(60 - secondsPassed);

            throw new Error(
                `Подождите ${wait} секунд перед повторной отправкой кода`
            );
        }
    }


    const code =
        Math.floor(100000 + Math.random() * 900000)
            .toString();


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
            attempts: 0,
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



export async function verifyCode(email, code, type) {

    const verification =
        await prisma.verificationCode.findFirst({
            where: {
                email,
                type,
            },
        });


    if (!verification) {
        throw new Error("Verification code not found");
    }


    if (verification.expiresAt < new Date()) {

        await prisma.verificationCode.delete({
            where: {
                id: verification.id,
            },
        });

        throw new Error("Code expired");
    }


    if (verification.attempts >= 5) {

        await prisma.verificationCode.delete({
            where: {
                id: verification.id,
            },
        });

        throw new Error("Too many attempts");
    }


    const valid =
        hashCode(code) === verification.codeHash;


    if (!valid) {

        await prisma.verificationCode.update({
            where: {
                id: verification.id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });


        throw new Error("Invalid code");
    }


    await prisma.verificationCode.delete({
        where: {
            id: verification.id,
        },
    });


    return true;
}