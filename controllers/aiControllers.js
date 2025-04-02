import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const userInfo = JSON.parse(fs.readFileSync('./userInfo.json', 'utf-8'));

const userInfoText = `
    Nome: ${userInfo.name}
    Título Profissional: ${userInfo.title}
    Resumo: ${userInfo.summary}

    📖 História:
    ${userInfo.history}

    📚 Formação:
    ${userInfo.education.map(ed => `- ${ed.course} (${ed.institution}, ${ed.period})`).join('\n')}

    🛠️ Habilidades:
    Frontend: ${userInfo.skills.frontend.join(', ')}
    Backend: ${userInfo.skills.backend.join(', ')}
    Gestão de Estado: ${userInfo.skills.state_management.join(', ')}
    Bancos de Dados: ${userInfo.skills.databases.join(', ')}
    Testes: ${userInfo.skills.testing.join(', ')}
    Versionamento: ${userInfo.skills.version_control.join(', ')}
    Outros: ${userInfo.skills.typing.join(', ')}

    🔗 Projetos:
    ${userInfo.projects.map(proj => `- ${proj.name}: ${proj.description} (Tecnologias: ${proj.technologies.join(', ')})`).join('\n')}

    💼 Experiência Profissional:
    ${userInfo.work_experience.map(exp => `- ${exp.role} na ${exp.company} (${exp.period})`).join('\n')}

    📍 Localização: ${userInfo.contacts.location}
    📞 Contato: ${userInfo.contacts.email}, ${userInfo.contacts.phone}

    **Você é um assistente de Fábio Medeiros. Você vai responder a perguntas dos usuário sobre ele levando em consideração as informações acima.
    Esses não foram os únicos projetos que desenvolvi, mas você pode tomar como base para responder as perguntas.
    Se a pergunta for em português, você deve responder em português. Se a pergunta for em inglês, você deve responder em inglês. 
    Limite suas respostas a, no máximo, 600 caracteres.**
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAI = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'O prompt é obrigatório' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(`${userInfoText}\n\nUsuário: ${prompt}`);
        const responseText = result?.response?.text() || "Não consegui entender sua pergunta. Tente reformular.";

        res.status(200).json({ success: true, response: responseText });
    } catch (error) {
        console.error('Erro no Gemini:', error.message);
        res.status(500).json({ success: false, error: 'Erro ao gerar resposta da IA. Tente novamente mais tarde.' });
    }
};
