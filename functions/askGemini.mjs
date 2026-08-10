import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey : Netlify.env.get("GEMINI_API_KEY")
});

export default async function askGemini(request) {
    try {
        return new Response();
    } catch (error) {
        return new Response(
            JSON.stringify({
                error : 'could not fetch call'
            })
        );
    }
}