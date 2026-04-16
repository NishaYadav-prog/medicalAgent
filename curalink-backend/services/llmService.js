import axios from "axios";

export const generateAIResponse = async (disease, query, articles, trials) => {
  try {
    const prompt = `
You are a medical research assistant.

Patient condition: ${disease}
User query: ${query}

Research Articles:
${articles.map((a, i) => `${i + 1}. ${a.title}`).join("\n")}

Clinical Trials:
${trials.map((t, i) => `${i + 1}. ${t.title} (${t.status})`).join("\n")}

Generate a structured response with:
1. Condition Overview
2. Research Insights
3. Clinical Trials Summary
4. Personalized Advice

Only use given data. Do not hallucinate.
`;

    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      stream: false,
      options: {
        num_predict: 200,
      },
    });

    console.log("LLM RESPONSE:", response.data);
    return response.data.response || "No AI response generated";
  } catch (error) {
    console.error("LLM error:", error.message);
    return "AI response failed";
  }
};
