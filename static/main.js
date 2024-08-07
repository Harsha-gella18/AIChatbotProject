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
        addMessage(message, "end", "user");
        let res = await chat.sendMessage(message);
        res = await res.response;
        console.log(res);
        let html = conv.makeHtml(res.text());
        addMessage(html, "start", "assistant");
    }

    const addMessage = (msg, direction, userType) => {
        const messageHolder = document.getElementById("messageHolder");
        const message = document.createElement("div");
        
        // Set message color and alignment based on userType
        const colorClass = userType === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600";
        const alignmentClass = userType === "user" ? "justify-end" : "justify-start";
        
        message.className = `flex ${alignmentClass} mb-2`;
        message.innerHTML = `
            <div class="${colorClass} px-4 py-2 rounded-lg shadow-md max-w-md w-fit">
                ${msg}
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
