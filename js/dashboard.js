const token = localStorage.getItem("token");
if (!token) window.location.href = "../login.html";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
});

// Make icon cards clickable
document.querySelectorAll(".icon-card").forEach(card => {
    card.addEventListener("click", () => {
        if (card.id === "onboardingProgress") {
            alert("Onboarding progress details coming soon!");
        } else if (card.id === "tasksChecklist") {
            alert("Tasks checklist details coming soon!");
        } else if (card.id === "remindersIcon") {
            window.location.href = "../reminders.html";
        }
    });
});

// AI Chat popup logic
const aiBtn = document.getElementById("aiChatButton");
const aiPopup = document.getElementById("aiChatPopup");
const closeAi = document.getElementById("closeAi");
const chatContent = document.getElementById("chatContent");
const aiInput = document.getElementById("aiInput");
const aiSend = document.getElementById("aiSend");

aiBtn.addEventListener("click", () => {
    aiPopup.classList.toggle("hidden");
    if (!aiPopup.classList.contains("hidden")) aiInput.focus();
});
closeAi.addEventListener("click", () => aiPopup.classList.add("hidden"));

function addMessage(sender, msg) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "text-right mb-2" : "text-left mb-2";
    div.innerHTML = `<p class="inline-block p-2 rounded ${sender==='user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}">${msg}</p>`;
    chatContent.appendChild(div);
    chatContent.scrollTop = chatContent.scrollHeight;
}

async function sendMessage() {
    const msg = aiInput.value.trim();
    if (!msg) return;
    addMessage("user", msg);
    aiInput.value = "";

    try {
        const res = await fetch("http://127.0.0.1:5000/api/student/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        addMessage("bot", data.reply);
    } catch (err) {
        addMessage("bot", "Unable to connect to server.");
    }
}

aiSend.addEventListener("click", sendMessage);
aiInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});
