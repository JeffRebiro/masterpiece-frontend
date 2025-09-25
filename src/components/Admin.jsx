import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_BASE_URL = 'https://e-commerce-backend-7yft.onrender.com/api';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Check for existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
            fetchAvailableModels();
        }
    }, []);

    // Test API connection and get available endpoints
    const fetchAvailableModels = async () => {
        setLoading(true);
        try {
            // Test common DRF endpoints
            const endpoints = [
                { name: 'Products', endpoint: 'products/', key: 'products' },
                { name: 'Categories', endpoint: 'categories/', key: 'categories' },
                { name: 'Users', endpoint: 'users/', key: 'users' },
                { name: 'Orders', endpoint: 'orders/', key: 'orders' },
            ];

            const availableModels = [];

            for (const ep of endpoints) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${ep.endpoint}`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('authToken')}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        availableModels.push({
                            name: ep.name,
                            endpoint: ep.endpoint,
                            key: ep.key
                        });
                    }
                } catch (err) {
                    console.log(`Endpoint ${ep.endpoint} not available`);
                }
            }

            setModels(availableModels);
        } catch (err) {
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Try DRF token authentication first
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginForm.username,
                    password: loginForm.password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Token-based auth successful
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify({
                    username: loginForm.username,
                    email: data.user?.email || ''
                }));
                
                setUser({ username: loginForm.username });
                setIsLoggedIn(true);
                setLoginForm({ username: '', password: '' });
                fetchAvailableModels();
            } else {
                // If token auth fails, try session-based auth
                await handleSessionLogin();
            }
        } catch (err) {
            setError('Network error: Please check your connection and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionLogin = async () => {
        try {
            const formData = new FormData();
            formData.append('username', loginForm.username);
            formData.append('password', loginForm.password);

            const response = await fetch(`${API_BASE_URL}/auth/session-login/`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsLoggedIn(true);
                setLoginForm({ username: '', password: '' });
                fetchAvailableModels();
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            // Try token logout
            await fetch(`${API_BASE_URL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                }
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setIsLoggedIn(false);
            setUser(null);
            setModels([]);
            setItems([]);
        }
    };

    const fetchModelData = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            setError('');

            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/${model.endpoint}`, {
                headers: headers,
                credentials: token ? 'omit' : 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                // Handle different response formats
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data.results) {
                    setItems(data.results); // Paginated response
                } else if (typeof data === 'object') {
                    setItems([data]); // Single object
                } else {
                    setItems([]);
                }
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                setError(`Failed to load ${model.name}: ${response.statusText}`);
            }
        } catch (err) {
            setError('Network error: Failed to fetch data');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/${selectedModel.endpoint}${itemId}/`, {
                method: 'DELETE',
                headers: headers,
                credentials: token ? 'omit' : 'include'
            });

            if (response.ok) {
                setItems(items.filter(item => item.id !== itemId));
            } else {
                setError('Failed to delete item');
            }
        } catch (err) {
            setError('Network error: Failed to delete item');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="django-admin">
                <div className="admin-header">
                    <div className="admin-brand">
                        <h1>Django Administration</h1>
                    </div>
                </div>
                
                <div className="login-container">
                    <div className="login-form">
                        <h2>Log in</h2>
                        <form onSubmit={handleLogin}>
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </div>
                            {error && <div className="errornote">{error}</div>}
                            <div className="submit-row">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>
                            <div className="login-help">
                                <p>Use your Django superuser credentials</p>
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
                    <h1>Django Administration</h1>
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
                                    className={selectedModel?.endpoint === model.endpoint ? 'active' : ''}
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
                                <p>Welcome to Django administration, {user?.username}.</p>
                                <p>Please choose a model from the sidebar to view and edit records.</p>
                                <div className="model-stats">
                                    <h3>Available Models:</h3>
                                    <ul>
                                        {models.map((model, index) => (
                                            <li key={index}>{model.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="model-view">
                            <div className="model-header">
                                <h2>{selectedModel.name}</h2>
                                <div>
                                    <span className="model-count">{items.length} items</span>
                                </div>
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
                                                <tr key={item.id || index}>
                                                    {Object.values(item).map((value, idx) => (
                                                        <td key={idx}>
                                                            {typeof value === 'object' ? 
                                                                JSON.stringify(value).substring(0, 50) + '...' : 
                                                                String(value)
                                                            }
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
                                ) : (
                                    <div className="no-data">
                                        <p>No {selectedModel.name.toLowerCase()} found.</p>
                                    </div>
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