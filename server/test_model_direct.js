require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try to just use a simple curl equivalent or a known working pattern if the SDK exposes it.
        // Actually, checking the google-generative-ai docs, it doesn't expose listModels easily in the node SDK high level.
        // But we can try to just run a simple generateContent on "gemini-1.5-flash" with the OFFICIAL SDK, 
        // removing LangChain from the equation to isolate if it's LangChain or the API/Key.

        console.log("Testing gemini-1.5-flash with official SDK...");
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Error with official SDK:", error.message);
    }
}

listModels();
