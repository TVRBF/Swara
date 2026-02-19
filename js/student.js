const API_URL = "https://swara-backend-q76j.onrender.com/api/student";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
    window.location.href = "login.html";
}

// Fetch tasks
async function fetchTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Failed to fetch tasks:", res.status, res.statusText);
            alert("Failed to fetch tasks. Please log in again.");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (!Array.isArray(data.tasks)) {
            console.warn("Tasks not found or invalid format:", data);
            document.getElementById("tasksList").innerHTML = "<li>No tasks available</li>";
            return;
        }

        displayTasks(data.tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        document.getElementById("tasksList").innerHTML = "<li>Failed to connect to backend</li>";
    }
}

function displayTasks(tasks) {
    const tasksList = document.getElementById("tasksList");
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
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    if (progressBar) progressBar.style.width = percent + "%";
    if (progressPercent) progressPercent.innerText = percent + "%";

    // Checkbox updates
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
            fetchTasks(); // Refresh progress
        });
    });
}

fetchTasks();
