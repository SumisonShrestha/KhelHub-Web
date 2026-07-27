import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

export const generateContent = async (systemInstruction: string, userContext: string, userQuery: string) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            parts: [
              { text: userContext },
              { text: userQuery },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
