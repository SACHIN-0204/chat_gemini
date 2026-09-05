import "dotenv/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 60000;

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
            });
            const data = await response.json();

            if (response.ok) {
                const reply = data.candidates?.[0]?.content?.parts
                    ?.map((part) => part.text || "")
                    .join("")
                    .trim();

                if (!reply) {
                    throw new Error("Gemini API returned no response text");
                }

                return reply;
            }

            const isTransient = [429, 500, 503].includes(response.status);
            const errorMessage = data.error?.message || "Gemini API request failed";

            if (!isTransient || attempt === 3) {
                throw new Error(errorMessage);
            }

            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        } catch (err) {
            const isTimeout = err?.name === "TimeoutError" || err?.code === "UND_ERR_CONNECT_TIMEOUT";
            const isRetryable = isTimeout || err?.name === "TypeError";

            if (!isRetryable || attempt === 3) {
                console.error("Gemini API error:", err);
                throw err;
            }

            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        }
    }
}

export default getGenAIAPIResponse;