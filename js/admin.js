const API_URL = "http://127.0.0.1:5000/api/admin";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
    window.location.href = "../login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
});

// Fetch analytics
async function fetchAnalytics() {
    const res = await fetch(`${API_URL}/analytics`, {
        headers: { "Authorization": token }
    });
    const data = await res.json();
    document.getElementById("totalStudents").innerText = data.total_students;
    document.getElementById("completedTasks").innerText = data.completed_tasks;
    document.getElementById("avgCompletion").innerText = data.avg_completion + "%";

    // Student table
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";
    data.recent_students.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="px-4 py-2">${student.name}</td>
            <td class="px-4 py-2">${student.email}</td>
            <td class="px-4 py-2">${student.role}</td>
        `;
        studentList.appendChild(tr);
    });
}

fetchAnalytics();
