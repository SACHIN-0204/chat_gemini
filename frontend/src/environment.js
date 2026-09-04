let IS_PROD = true;
const server = IS_PROD ?
    "https://chat-gemini-m81n.onrender.com" :

    "http://localhost:3000"


export default server;