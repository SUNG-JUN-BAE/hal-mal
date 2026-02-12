import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string"
  ? JSON.parse(req.body)
  : req.body;

const { question } = body;


  if (!question || question.length > 200) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
        너는 아주 냉철하고 유머러스한 결정 장애 치료사야. 
        사용자의 고민: "${question}"
        결정은 딱 두 글자(사라, 마라, 숏쳐, 롱쳐 등)사용자의 질문에 알맞게하고, 이유는 한 문장으로 짧고 킹받게 답해.
        형식은 반드시 딱 이렇게만 해:
        결정: [두글자]
        이유: [한문장]
      `;

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    return res.status(200).json({
      answer: response.response.text()
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI error" });
  }
}
