// Base API URL for Render backend (reminders)
const API_URL = "https://swara-backend-q76j.onrender.com/api/reminders";
const token = localStorage.getItem("token");

// Redirect to login if no token
if (!token) window.location.href = "../login.html";

const reminderList = document.getElementById("reminderList");

// Load reminders from backend
async function loadReminders() {
    try {
        const res = await fetch(`${API_URL}/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        reminderList.innerHTML = "";

        data.forEach(reminder => {
            const li = document.createElement("li");
            li.className = "bg-white p-4 rounded shadow flex justify-between";

            li.innerHTML = `
                <div>
                    <h3 class="font-bold">${reminder.title}</h3>
                    <p>${reminder.description}</p>
                    <small>Due: ${reminder.due_date}</small>
                </div>
                <button class="bg-green-500 text-white px-2 py-1 rounded">
                    ${reminder.completed ? "Completed" : "Mark Done"}
                </button>
            `;

            li.querySelector("button").addEventListener("click", async () => {
                await fetch(`${API_URL}/${reminder._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ completed: true })
                });
                loadReminders();
            });

            reminderList.appendChild(li);
        });

    } catch (err) {
        console.error(err);
    }
}

loadReminders();
