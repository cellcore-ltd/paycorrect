import nodemailer from "nodemailer";

//configurations for sendting smtp mails
export const transpoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user : process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});