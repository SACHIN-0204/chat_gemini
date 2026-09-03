import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            maxWidth: "420px",
            margin: "80px auto",
            padding: "32px 28px",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(18,22,25,0.95), rgba(12,15,18,0.95))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 45px rgba(0,0,0,0.35)"
        }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Register</h2>
            {error && <p style={{ color: "#fca5a5", marginBottom: "14px" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            color: "#f3f5f7"
                        }}
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            color: "#f3f5f7"
                        }}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            color: "#f3f5f7"
                        }}
                    />
                    <button type="submit" style={{
                        background: "linear-gradient(135deg, #7dd3fc, #38bdf8)",
                        color: "#03111a",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontWeight: 700,
                        margin: 0
                    }}>Register</button>
                </div>
            </form>
            <p style={{ marginTop: "18px", color: "#a7b0b8" }}>
                Already have an account? <Link to="/login" style={{ color: "#7dd3fc" }}>Login</Link>
            </p>
        </div>
    );
}

export default Register;