import "dotenv/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const getGenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{text: message}]
            }]
        })
    };

    try {

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Gemini API request failed");
        }

        const reply = data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("")
            .trim();

        if (!reply) {
            throw new Error("Gemini API returned no response text");
        }

        return reply;

    } catch(err) {
       console.error("Gemini API error:", err);
       throw err;
    }
}

export default getGenAIAPIResponse;