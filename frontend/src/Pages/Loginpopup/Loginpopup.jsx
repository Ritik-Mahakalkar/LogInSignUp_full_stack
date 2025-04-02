import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Loginpopup.css';

const Loginpopup = () => {
    const [currentState, setCurrentState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:5000/profile", {
                headers: { Authorization: token }
            }).then(response => {
                setUser(response.data.user);
            }).catch(() => {
                setUser(null);
            });
        }
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setError("");
        
        const url = currentState === "Sign Up" ? "http://localhost:5000/register" : "http://localhost:5000/login";
        const payload = currentState === "Sign Up" ? { name, email, password } : { email, password };

        try {
            const response = await axios.post(url, payload);
            
            if (currentState === "Login") {
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                alert("Login successful");
            } else {
                alert("Account created successfully");
                setCurrentState("Login");
            }
            
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    const onLogoutHandler = () => {
        localStorage.removeItem("token");
        setUser(null);
        alert("Logged out successfully");
    };

    return (
        <div className='login-popup'>
            {user ? (
              <div className="login-popup-container">
                <div className='dashboard'>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name}</p>
                    <button onClick={onLogoutHandler}>Logout</button>
                </div>
              </div>
                
            ) : (
                <form className="login-popup-container" onSubmit={onSubmitHandler}>
                    <div className="login-popup-title">
                        <h2>{currentState}</h2>
                    </div>
                    <div className="login-popup-input">
                        {currentState === "Sign Up" && <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />}
                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    <button type="submit">{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p className='para'>I agree to the terms and conditions.</p>
                    </div>
                    <div className='subtag'>
                        {currentState === "Login" ? (
                            <p className='para'>Don't have an account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
                        ) : (
                            <p className='para'>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Loginpopup;