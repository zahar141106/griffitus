import "dotenv/config";
import { sendVerificationEmail } from "./services/mail.service.js";

await sendVerificationEmail (
    "zaharryzikov167@gmail.com",
    "123456"
)
console.log('Email sent')