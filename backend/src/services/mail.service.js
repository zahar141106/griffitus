import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(email, code) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Griffitus verification code",

        html: `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
        ">
            <h2>Griffitus</h2>

            <p>Ваш код подтверждения:</p>

            <h1 style="
                letter-spacing: 5px;
            ">
                ${code}
            </h1>

            <p>
                Код действителен 10 минут.
            </p>

            <p>
                Если вы не регистрировались в Griffitus,
                просто проигнорируйте это письмо.
            </p>
        </div>
        `
    });
}