
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { HairDiagnosis, DayTask, HairPlan } from "../types";

/**
 * Função para gerar o plano completo de 30 dias.
 * Utiliza o gemini-3-pro-preview para garantir a lógica complexa de HNR.
 */
export const generateHairPlan = async (diagnosis: HairDiagnosis): Promise<HairPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Aja como um renomado Tricologista e Terapeuta Capilar Natural. 
    Seu objetivo é criar um Cronograma Capilar de 30 dias focado em: ${diagnosis.mainGoal}.

    PERFIL TÉCNICO:
    - Curvatura: ${diagnosis.hairType}
    - Couro Cabeludo: ${diagnosis.scalpType}
    - Porosidade: ${diagnosis.porosity}
    - Histórico de Química: ${diagnosis.hasChemicals ? 'Sim' : 'Não'}
    - Orçamento: ${diagnosis.budgetLevel}

    DIRETRIZES:
    1. Plano de exatos 30 dias.
    2. Alterne Hidratação, Nutrição e Reconstrução com base na porosidade ${diagnosis.porosity}.
    3. Receitas 100% naturais e adequadas ao orçamento ${diagnosis.budgetLevel}.
    4. Formato estritamente JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recipe: { type: Type.STRING }
                },
                required: ["day", "title", "category", "description"]
              }
            }
          },
          required: ["summary", "tasks"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      diagnosis,
      summary: data.summary || "Seu plano personalizado está pronto.",
      tasks: (data.tasks || []).map((t: any) => ({ ...t, completed: false }))
    };
  } catch (error) {
    console.error("Erro crítico ao gerar plano com Gemini:", error);
    throw new Error("Falha na comunicação com a inteligência capilar.");
  }
};

/**
 * Chat com assistente para dúvidas rápidas.
 * Utiliza gemini-3-flash-preview para respostas instantâneas.
 */
export const chatWithAssistant = async (message: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Você é o Assistente Capillaire. Especialista em terapias naturais (Babosa, Óleos, Argilas). Ajude o usuário com seu cronograma. Nunca sugira químicos agressivos.',
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

/**
 * Dica rápida baseada em um problema específico.
 * Utiliza o modelo Lite para economia e velocidade extrema.
 */
export const fastHairTip = async (problem: string, diagnosis?: HairDiagnosis) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  let context = "";
  if (diagnosis) {
    context = `Para um cabelo ${diagnosis.hairType} e porosidade ${diagnosis.porosity}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Dê uma dica natural de 2 frases para o problema: ${problem}. ${context}`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na dica expressa:", error);
    return "Tente massagear o couro cabeludo com movimentos circulares para estimular a saúde dos fios.";
  }
};
