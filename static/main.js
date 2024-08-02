import { GoogleGenerativeAI } from "@google/generative-ai";
const conv = new showdown.Converter();

const getApiKey = async () => {
    const response = await fetch('/get-api-key');
    const data = await response.json();
    return data.api_key;
};

getApiKey().then(apiKey => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const gen_model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = gen_model.startChat({
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    const chatGemini = async (message) => {
        addMessage(message, "end");
        let res = await chat.sendMessage(message);
        res = await res.response;
        console.log(res);
        let html = conv.makeHtml(res.text());
        addMessage(html, "start");
    }

    const addMessage = (msg, direction) => {
        const messageHolder = document.getElementById("messageHolder");
        const message = document.createElement("div");
        const colour = direction !== "start" ? "bg-blue-600" : "bg-green-600";
        const alignment = direction !== "start" ? "items-end" : "items-start";
        
        message.innerHTML = `
        <div class="flex ${alignment}">
            <div class="${colour} text-white px-4 py-2 rounded-lg shadow-md max-w-md w-fit mb-2">
                ${msg}
            </div>
        </div>
        `;
        
        messageHolder.appendChild(message);
        messageHolder.scrollTop = messageHolder.scrollHeight; // Auto-scroll to the latest message
    }

    const messageInput = document.getElementById("chat");
    const sendBtn = document.getElementById("btn");

    const sendMessage = () => {
        const message = messageInput.value;
        if (message.trim() !== "") {
            chatGemini(message);
            messageInput.value = "";
        }
    };

    sendBtn.addEventListener("click", sendMessage);

    messageInput.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { // Enter key
            event.preventDefault();
            sendMessage();
        }
    });
});
