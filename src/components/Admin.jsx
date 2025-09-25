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
    const [availableEndpoints, setAvailableEndpoints] = useState([]);

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Discover available endpoints
    const discoverEndpoints = async () => {
        const endpointsToTest = [
            '/auth/login/',
            '/auth/token/login/',
            '/login/',
            '/token-auth/',
            '/api-token-auth/',
            '/guest-users/',
            '/products/',
            '/categories/',
            '/orders/',
            '/hire-items/'
        ];

        const available = [];

        for (const endpoint of endpointsToTest) {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (response.status !== 404) {
                    available.push(endpoint);
                }
            } catch (err) {
                // Endpoint not available
            }
        }

        setAvailableEndpoints(available);
        return available;
    };

    // Check for existing authentication on component mount
    useEffect(() => {
        discoverEndpoints();
        
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
            fetchAvailableModels();
        }
    }, []);

    // Test different authentication methods
    const tryAuthentication = async (username, password) => {
        const authMethods = [
            {
                name: 'Token Auth',
                endpoint: '/auth/token/login/',
                method: 'POST',
                body: { username, password },
                getToken: (data) => data.token || data.auth_token
            },
            {
                name: 'Session Auth',
                endpoint: '/auth/login/',
                method: 'POST', 
                body: { username, password },
                getToken: (data) => data.key || data.token
            },
            {
                name: 'DRF Token Auth',
                endpoint: '/api-token-auth/',
                method: 'POST',
                body: { username, password },
                getToken: (data) => data.token
            },
            {
                name: 'Simple JWT',
                endpoint: '/token/',
                method: 'POST',
                body: { username, password },
                getToken: (data) => data.access
            }
        ];

        for (const authMethod of authMethods) {
            try {
                console.log(`Trying ${authMethod.name} at ${authMethod.endpoint}`);
                
                const response = await fetch(`${API_BASE_URL}${authMethod.endpoint}`, {
                    method: authMethod.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(authMethod.body)
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = authMethod.getToken(data);
                    
                    if (token) {
                        return {
                            success: true,
                            token: token,
                            method: authMethod.name,
                            data: data
                        };
                    }
                }
            } catch (err) {
                console.log(`${authMethod.name} failed:`, err);
                continue;
            }
        }

        return { success: false, error: 'All authentication methods failed' };
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await tryAuthentication(loginForm.username, loginForm.password);

            if (result.success) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userData', JSON.stringify({
                    username: loginForm.username,
                    authMethod: result.method
                }));
                
                setUser({ username: loginForm.username });
                setIsLoggedIn(true);
                setLoginForm({ username: '', password: '' });
                fetchAvailableModels();
                
                setError(`Success! Using ${result.method}`);
                setTimeout(() => setError(''), 2000);
            } else {
                setError('Authentication failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error: Please check your connection');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableModels = async () => {
        setLoading(true);
        try {
            const endpoints = [
                { name: 'Products', endpoint: 'products/', key: 'products' },
                { name: 'Categories', endpoint: 'categories/', key: 'categories' },
                { name: 'Users', endpoint: 'users/', key: 'users' },
                { name: 'Orders', endpoint: 'orders/', key: 'orders' },
            ];

            const availableModels = [];
            const token = localStorage.getItem('authToken');

            for (const ep of endpoints) {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                    };

                    if (token) {
                        headers['Authorization'] = `Token ${token}`;
                    }

                    const response = await fetch(`${API_BASE_URL}/${ep.endpoint}`, {
                        headers: headers
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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setUser(null);
        setModels([]);
        setItems([]);
        setError('');
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
                headers['Authorization'] = `Bearer ${token}`;
                // Also try other common token formats
                const altHeaders = [
                    `Token ${token}`,
                    `Bearer ${token}`,
                    `JWT ${token}`
                ];

                // Try each authorization format
                for (const authHeader of altHeaders) {
                    try {
                        const testResponse = await fetch(`${API_BASE_URL}/${model.endpoint}`, {
                            headers: { ...headers, 'Authorization': authHeader }
                        });

                        if (testResponse.ok) {
                            headers['Authorization'] = authHeader;
                            break;
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }

            const response = await fetch(`${API_BASE_URL}/${model.endpoint}`, {
                headers: headers
            });

            if (response.ok) {
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data.results) {
                    setItems(data.results);
                } else if (typeof data === 'object') {
                    setItems([data]);
                } else {
                    setItems([]);
                }
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                setError(`Failed to load data: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            setError('Network error: Failed to fetch data');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="django-admin">
                <div className="admin-header">
                    <div className="admin-brand">
                        <h1>Django Administration</h1>
                    </div>
                    <div className="admin-info">
                        API: {API_BASE_URL}
                    </div>
                </div>
                
                <div className="login-container">
                    <div className="login-form">
                        <h2>Log in to Django Admin</h2>
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
                                    placeholder="Superuser username"
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
                                    placeholder="Superuser password"
                                />
                            </div>
                            
                            {error && (
                                <div className={error.includes('Success') ? 'successnote' : 'errornote'}>
                                    {error}
                                </div>
                            )}
                            
                            <div className="submit-row">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>
                            
                            <div className="login-help">
                                <h4>Debug Information:</h4>
                                <p>API Base: {API_BASE_URL}</p>
                                <p>Available endpoints: {availableEndpoints.join(', ') || 'Discovering...'}</p>
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
            <div className="admin-header">
                <div className="admin-brand">
                    <h1>Django Administration</h1>
                </div>
                <div className="admin-user">
                    Welcome, <strong>{user?.username}</strong> | 
                    <span className="logout-link" onClick={handleLogout}>Log out</span>
                </div>
            </div>

            <div className="admin-container">
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

                <div className="admin-content">
                    {loading && <div className="loading">Loading...</div>}
                    {error && <div className="errornote">{error}</div>}

                    {!selectedModel ? (
                        <div className="dashboard">
                            <h2>Site administration</h2>
                            <div className="welcome">
                                <p>Welcome, {user?.username}.</p>
                                <p>Available models: {models.length}</p>
                                <div className="debug-info">
                                    <h4>Session Info:</h4>
                                    <p>Auth Method: {user?.authMethod || 'Unknown'}</p>
                                    <p>Token: {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="model-view">
                            <div className="model-header">
                                <h2>{selectedModel.name} ({items.length})</h2>
                            </div>
                            
                            <div className="model-content">
                                {items.length > 0 ? (
                                    <table className="model-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(items[0]).slice(0, 6).map(key => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.slice(0, 10).map((item, index) => (
                                                <tr key={item.id || index}>
                                                    {Object.values(item).slice(0, 6).map((value, idx) => (
                                                        <td key={idx} title={typeof value === 'object' ? JSON.stringify(value) : String(value)}>
                                                            {typeof value === 'object' ? 
                                                                'Object' : 
                                                                String(value).substring(0, 30)
                                                            }
                                                        </td>
                                                    ))}
                                                    <td className="actions">
                                                        <button className="view-btn">View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-data">
                                        <p>No data available for {selectedModel.name}</p>
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