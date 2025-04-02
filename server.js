import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import emailRoutes from './routes/emailRoutes.js';
import aiRoutes from './routes/aiRoutes.js'

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/email', emailRoutes);
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
