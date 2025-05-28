import axios from "axios";

const generateText = async (prompt, model = "llama3.1") => {
  try {
    const res = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model,
        prompt,
        stream: false, // full response, no streaming
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the generated response text
    return res.data.response;
  } catch (error) {
    console.error("Error calling Ollama API:", error.message);
    throw error;
  }
};

export default generateText;
