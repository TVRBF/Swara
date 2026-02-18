// Base API URL for Render backend (student routes)
const API_URL = "https://swara-backend-q76j.onrender.com/api/student";
const token = localStorage.getItem("token");

// Redirect to login if no token
if (!token) {
    window.location.href = "../login.html";
}

const chatWindow = document.getElementById("chatWindow");
const userMessageInput = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Logout functionality
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
});

// Function to add messages to chat window
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

// Send message to backend
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

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userMessageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
