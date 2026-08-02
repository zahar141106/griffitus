import prisma from "../prisma.js";

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createVerificationCode(email, type) {
    const code = generateCode();

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
            code,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });

    console.log(`
==============================
Verification code
Email: ${email}
Type: ${type}
Code: ${code}
==============================
`);

    return code;
}