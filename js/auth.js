// Base API URL for Render backend
const API_URL = "https://swara-backend-q76j.onrender.com/api/auth";

// -------------------- Signup Form --------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const endpoint = role === "student" ? "signup/student" : "signup/admin";

        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) window.location.href = "login.html";
        } catch (err) {
            console.error("Signup error:", err);
            alert("Failed to signup. Please try again later.");
        }
    });
}

// -------------------- Login Form --------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                localStorage.setItem("token", data.token); // Save token

                // Decode JWT to get role
                const payloadBase64 = data.token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                const role = decodedPayload.role;

                // Redirect based on role
                if (role === "admin") {
                    window.location.href = "admindashboard.html";
                } else if (role === "student") {
                    window.location.href = "dashboard.html";
                } else {
                    alert("Unknown role!");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Failed to login. Please try again later.");
        }
    });
}
