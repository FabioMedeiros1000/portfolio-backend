import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (req, res) => {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message || !subject) {
        return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
    }

    const messageFinal = `${message}

    Email do remetente: ${email}
    Nome do remetente: ${name}

    Essa mensagem veio através da sua página web!
`;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    try {
        await transporter.sendMail({
            from: `"${name} (via Meu Site)" <${process.env.USER_EMAIL}>`,
            to: process.env.USER_EMAIL,
            subject,
            text: messageFinal
        });

        res.status(200).json({ success: true, message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar o email:', error.message, error.stack);
        res.status(500).json({ success: false, error: 'Erro ao enviar o email. Tente novamente mais tarde.' });
    }
};
