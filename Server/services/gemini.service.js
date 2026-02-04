// services/ai.service.js
const OpenAI = require("openai");

const AI = new OpenAI({
  apiKey: process.env.GEMINI_KEY, // HuggingFace access token
  baseURL: "https://router.huggingface.co/v1",
});


exports.aiReply = async (userMessage) => {
  try {
    const response = await AI.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905:groq",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Reply Error =>", error?.message || error);
    throw new Error("AI request failed");
  }
};
