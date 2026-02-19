const API_URL = "https://swara-backend-q76j.onrender.com/api/student";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
}

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Fetch tasks
async function fetchTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("token");
            return window.location.href = "login.html";
        }

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        if (!data.tasks) {
            console.error("Tasks not found in response:", data);
            return;
        }

        displayTasks(data.tasks);
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
        alert("Failed to fetch tasks. Please try logging in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

// Display tasks & progress
function displayTasks(tasks) {
    const tasksList = document.getElementById("tasksList");
    if (!tasksList) return;

    tasksList.innerHTML = "";
    let completedCount = 0;

    tasks.forEach(task => {
        if (task.completed) completedCount++;
        const li = document.createElement("li");
        li.className = "flex items-center justify-between p-2 border rounded";
        li.innerHTML = `
            <div>
                <p class="font-semibold">${task.title}</p>
                <p class="text-gray-500 text-sm">${task.description}</p>
            </div>
            <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task._id}">
        `;
        tasksList.appendChild(li);
    });

    const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressPercent").innerText = percent + "%";

    // Update task completion
    document.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", async (e) => {
            const taskId = e.target.getAttribute("data-id");
            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ completed: e.target.checked })
            });
            fetchTasks(); // Refresh tasks & progress
        });
    });
}

// Initial fetch
fetchTasks();
