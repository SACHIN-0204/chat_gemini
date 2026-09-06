import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import "../Auth.css";

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
            await api.post("/auth/register", formData);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <h2 className="authTitle">Register</h2>
                {error && <p className="authError">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="authFieldGroup">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                            className="authInput"
                        />
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
                        <button type="submit" className="authButton">Register</button>
                    </div>
                </form>
                <p className="authFooter">
                    Already have an account? <Link to="/login" className="authLink">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;