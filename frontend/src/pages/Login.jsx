import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";
import "../Auth.css";

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
        <div className="authPage">
            <div className="authCard">
                <h2 className="authTitle">Login</h2>
                {error && <p className="authError">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="authFieldGroup">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="authInput"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="authInput"
                        />
                        <button type="submit" className="authButton">Login</button>
                    </div>
                </form>
                <p className="authFooter">
                    Don&apos;t have an account? <Link to="/register" className="authLink">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;