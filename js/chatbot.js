const API_URL = "http://127.0.0.1:5000/api/student";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const chatWindow = document.getElementById("chatWindow");
const userMessageInput = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
});

function addMessage(sender, message) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "text-right" : "text-left";
    div.innerHTML = `
        <p class="inline-block p-2 rounded ${
            sender === "user" 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200"
        }">
            ${message}
        </p>
    `;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const message = userMessageInput.value.trim();
    if (!message) return;

    addMessage("user", message);
    userMessageInput.value = "";

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        if (!res.ok) {
            addMessage("bot", "Server error. Please try again.");
            return;
        }

        const data = await res.json();
        addMessage("bot", data.reply);

    } catch (error) {
        addMessage("bot", "Unable to connect to server.");
        console.error(error);
    }
}

sendBtn.addEventListener("click", sendMessage);

userMessageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
