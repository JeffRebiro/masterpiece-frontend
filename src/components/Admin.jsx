import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_BASE_URL = 'https://e-commerce-backend-7yft.onrender.com/api';

const Admin = () => {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            setCurrentView('dashboard');
            fetchModels();
        }
    }, []);

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            logout();
            throw new Error('Authentication failed');
        }

        return response;
    };

    const fetchModels = async () => {
        try {
            setLoading(true);
            // Since we don't have a specific models endpoint, we'll try common ones
            const endpoints = [
                'products/',
                'categories/',
                'users/',
                'orders/'
            ];

            const availableModels = [];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetchWithAuth(`/${endpoint}`);
                    if (response.ok) {
                        availableModels.push({
                            name: endpoint.replace('/', ''),
                            endpoint: endpoint
                        });
                    }
                } catch (err) {
                    // Endpoint might not exist, continue to next
                }
            }

            setModels(availableModels);
        } catch (err) {
            setError('Failed to fetch models: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchModelItems = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            const response = await fetchWithAuth(`/${model.endpoint}`);
            if (response.ok) {
                const data = await response.json();
                setItems(Array.isArray(data) ? data : [data]);
            } else {
                setError('Failed to fetch items');
            }
        } catch (err) {
            setError('Failed to fetch items: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setCurrentView('dashboard');
                fetchModels();
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (registerForm.password !== registerForm.password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerForm.username,
                    email: registerForm.email,
                    password: registerForm.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setError('Registration successful! Please login.');
                setCurrentView('login');
                setRegisterForm({
                    username: '',
                    email: '',
                    password: '',
                    password2: ''
                });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCurrentView('login');
        setModels([]);
        setItems([]);
    };

    const deleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetchWithAuth(`/${selectedModel.endpoint}${itemId}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setItems(items.filter(item => item.id !== itemId));
            } else {
                setError('Failed to delete item');
            }
        } catch (err) {
            setError('Failed to delete item: ' + err.message);
        }
    };

    if (currentView === 'login') {
        return (
            <div className="admin-login">
                <div className="login-container">
                    <h1>Django Administration</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                required
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>
                    <p>
                        Don't have an account? 
                        <span className="link" onClick={() => setCurrentView('register')}>
                            Register here
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    if (currentView === 'register') {
        return (
            <div className="admin-login">
                <div className="login-container">
                    <h1>Django Administration - Register</h1>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label htmlFor="reg-username">Username:</label>
                            <input
                                type="text"
                                id="reg-username"
                                value={registerForm.username}
                                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-email">Email:</label>
                            <input
                                type="email"
                                id="reg-email"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-password">Password:</label>
                            <input
                                type="password"
                                id="reg-password"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-password2">Confirm Password:</label>
                            <input
                                type="password"
                                id="reg-password2"
                                value={registerForm.password2}
                                onChange={(e) => setRegisterForm({...registerForm, password2: e.target.value})}
                                required
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <p>
                        Already have an account? 
                        <span className="link" onClick={() => setCurrentView('login')}>
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="django-admin">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-brand">
                    <h1>Django administration</h1>
                </div>
                <div className="admin-user">
                    Welcome, <strong>{user?.username}</strong> | 
                    <span className="logout-link" onClick={logout}>Log out</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-container">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="sidebar-section">
                        <h3>Authentication and Authorization</h3>
                        <ul>
                            <li>Users</li>
                            <li>Groups</li>
                        </ul>
                    </div>
                    
                    <div className="sidebar-section">
                        <h3>MODELS</h3>
                        <ul>
                            {models.map((model) => (
                                <li 
                                    key={model.name}
                                    className={selectedModel?.name === model.name ? 'active' : ''}
                                    onClick={() => fetchModelItems(model)}
                                >
                                    {model.name.charAt(0).toUpperCase() + model.name.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {!selectedModel ? (
                        <div className="dashboard">
                            <h2>Site administration</h2>
                            <div className="welcome">
                                <p>Welcome to Django administration.</p>
                                <p>Please choose a model from the sidebar to view and edit records.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="model-view">
                            <div className="model-header">
                                <h2>Select {selectedModel.name.slice(0, -1)} to change</h2>
                                <button className="add-button">Add {selectedModel.name.slice(0, -1)}</button>
                            </div>
                            
                            <div className="model-content">
                                <table className="model-table">
                                    <thead>
                                        <tr>
                                            {items.length > 0 && Object.keys(items[0]).map(key => (
                                                <th key={key}>{key}</th>
                                            ))}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id || index}>
                                                {Object.values(item).map((value, idx) => (
                                                    <td key={idx}>
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </td>
                                                ))}
                                                <td className="actions">
                                                    <button className="change-btn">Change</button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => deleteItem(item.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;