import OpenAI from "openai";

// Using gpt-4o, the latest available OpenAI model
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export { openai };
