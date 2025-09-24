import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_BASE_URL = 'https://e-commerce-backend-7yft.onrender.com';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Get CSRF token from cookies
    const getCsrfToken = () => {
        const name = 'csrftoken';
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
        return cookieValue || '';
    };

    // Check if user is authenticated
    const checkAuthentication = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUser(data.user);
                fetchModels();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    };

    useEffect(() => {
        setCsrfToken(getCsrfToken());
        checkAuthentication();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First, get the login page to set CSRF token
            await fetch(`${API_BASE_URL}/admin/login/`, {
                credentials: 'include'
            });

            const formData = new FormData();
            formData.append('username', loginForm.username);
            formData.append('password', loginForm.password);
            formData.append('csrfmiddlewaretoken', getCsrfToken());

            const response = await fetch(`${API_BASE_URL}/admin/login/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.authenticated) {
                    setIsLoggedIn(true);
                    setUser({ username: loginForm.username });
                    setLoginForm({ username: '', password: '' });
                    fetchModels();
                } else {
                    setError(result.error || 'Invalid credentials');
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/admin/logout/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCsrfToken(),
                }
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoggedIn(false);
            setUser(null);
            setModels([]);
            setItems([]);
        }
    };

    const fetchModels = async () => {
        try {
            setLoading(true);
            // Try to fetch admin index to get available models
            const response = await fetch(`${API_BASE_URL}/admin/`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.app_list) {
                    const modelList = [];
                    data.app_list.forEach(app => {
                        app.models.forEach(model => {
                            modelList.push({
                                name: model.name,
                                object_name: model.object_name,
                                app_label: app.app_label,
                                admin_url: model.admin_url
                            });
                        });
                    });
                    setModels(modelList);
                }
            }
        } catch (err) {
            console.error('Failed to fetch models:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchModelData = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            
            // Fetch the changelist for the model
            const response = await fetch(`${API_BASE_URL}${model.admin_url}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.results) {
                    setItems(data.results);
                } else {
                    setItems([]);
                }
            }
        } catch (err) {
            setError('Failed to fetch model data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="django-admin">
                <div className="admin-header">
                    <div className="admin-brand">
                        <h1>Django administration</h1>
                    </div>
                </div>
                
                <div className="login-container">
                    <div className="login-form">
                        <h2>Log in</h2>
                        <form onSubmit={handleLogin}>
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                            <div className="form-row">
                                <label htmlFor="id_username">Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="id_username"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="id_password">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="id_password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    required
                                />
                            </div>
                            {error && <div className="errornote">{error}</div>}
                            <div className="submit-row">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>
                        </form>
                    </div>
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
                    <span className="logout-link" onClick={handleLogout}>Log out</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-container">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="sidebar-section">
                        <h3>MODELS</h3>
                        <ul>
                            {models.map((model, index) => (
                                <li 
                                    key={index}
                                    className={selectedModel?.object_name === model.object_name ? 'active' : ''}
                                    onClick={() => fetchModelData(model)}
                                >
                                    {model.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="errornote">{error}</div>}

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
                                <h2>Select {selectedModel.name} to change</h2>
                                <button className="add-button">
                                    Add {selectedModel.name}
                                </button>
                            </div>
                            
                            <div className="model-content">
                                {items.length > 0 ? (
                                    <table className="model-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(items[0]).map(key => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    {Object.values(item).map((value, idx) => (
                                                        <td key={idx}>
                                                            {typeof value === 'object' ? 
                                                                JSON.stringify(value) : 
                                                                String(value)
                                                            }
                                                        </td>
                                                    ))}
                                                    <td className="actions">
                                                        <button className="change-btn">Change</button>
                                                        <button className="delete-btn">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No items found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;