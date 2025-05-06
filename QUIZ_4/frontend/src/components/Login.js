import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import Register from './Register';
import '../styles/Auth.css';

function Login({ onLoginSuccess }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.data.token);
            onLoginSuccess();
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    const loginForm = (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            <p className="switch-auth">
                Don't have an account? <button type="button" onClick={() => setIsLoginView(false)}>Register</button>
            </p>
        </form>
    );

    return (
        <div className="auth-container">
            {isLoginView ? 
                loginForm : 
                <Register onSwitch={() => setIsLoginView(true)} />
            }
        </div>
    );
}

export default Login;