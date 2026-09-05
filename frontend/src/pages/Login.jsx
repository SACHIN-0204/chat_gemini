import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await api.post("/auth/login", formData);
            login(data);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
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
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Login</h2>
            {error && <p style={{ color: "#fca5a5", marginBottom: "14px" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                    }}>Login</button>
                </div>
            </form>
            <p style={{ marginTop: "18px", color: "#a7b0b8" }}>
                Don&apos;t have an account? <Link to="/register" style={{ color: "#7dd3fc" }}>Register</Link>
            </p>
        </div>
    );
}

export default Login;