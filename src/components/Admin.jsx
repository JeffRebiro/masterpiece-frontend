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
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Start as logged in since no auth required
    const [apiRoot, setApiRoot] = useState(null);

    // Login form state (for future auth if needed)
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Fetch API root on component mount
    useEffect(() => {
        fetchApiRoot();
    }, []);

    const fetchApiRoot = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/`);
            if (response.ok) {
                const data = await response.json();
                setApiRoot(data);
                
                // Create models from API root
                const modelList = Object.keys(data).map(key => ({
                    name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    endpoint: key + '/',
                    url: data[key],
                    key: key
                }));
                
                setModels(modelList);
            }
        } catch (err) {
            setError('Failed to connect to API: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchModelData = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            setError('');

            console.log('Fetching from:', `${API_BASE_URL}/${model.endpoint}`);

            const response = await fetch(`${API_BASE_URL}/${model.endpoint}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);
                
                // Handle different response formats
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data.results) {
                    setItems(data.results); // Paginated response
                } else {
                    // If it's an object but not an array, try to see if it has items
                    const values = Object.values(data);
                    if (values.length > 0 && Array.isArray(values[0])) {
                        setItems(values[0]);
                    } else {
                        setItems([data]); // Single object
                    }
                }
            } else {
                setError(`Failed to load ${model.name}: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            setError('Network error: Failed to fetch data - ' + err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setModels([]);
        setItems([]);
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // Since there's no auth endpoint, we'll just set as logged in
        setIsLoggedIn(true);
        setUser({ username: loginForm.username || 'admin' });
        fetchApiRoot();
    };

    const deleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedModel.endpoint}${itemId}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setItems(items.filter(item => item.id !== itemId));
                setError('Item deleted successfully');
                setTimeout(() => setError(''), 3000);
            } else {
                setError('Failed to delete item');
            }
        } catch (err) {
            setError('Network error: Failed to delete item');
        }
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'object') {
            return JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
        }
        return String(value);
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
                        <h2>API Admin Interface</h2>
                        <div className="api-info">
                            <p><strong>API Base:</strong> {API_BASE_URL}</p>
                            <p><strong>Status:</strong> No authentication required</p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-row">
                                <label htmlFor="id_username">Username (optional):</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="id_username"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                    placeholder="Enter any username"
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="id_password">Password (optional):</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="id_password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    placeholder="Enter any password"
                                />
                            </div>
                            
                            <div className="submit-row">
                                <button type="submit">
                                    Enter Admin Interface
                                </button>
                            </div>
                            
                            <div className="login-help">
                                <p>This API doesn't require authentication. Click above to proceed.</p>
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
                    Welcome, <strong>{user?.username || 'Admin'}</strong> | 
                    <span className="logout-link" onClick={handleLogout}>Log out</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-container">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="sidebar-section">
                        <h3>API MODELS</h3>
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
                    
                    <div className="sidebar-section">
                        <h3>API INFO</h3>
                        <div className="api-stats">
                            <p>Models: {models.length}</p>
                            <p>Status: Connected</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            Loading...
                        </div>
                    )}
                    
                    {error && (
                        <div className={`message ${error.includes('successfully') ? 'success-message' : 'error-message'}`}>
                            {error}
                        </div>
                    )}

                    {!selectedModel ? (
                        <div className="dashboard">
                            <h2>API Administration</h2>
                            <div className="welcome">
                                <p>Welcome to the Django REST Framework Admin Interface.</p>
                                <p>Select a model from the sidebar to view and manage data.</p>
                                
                                <div className="api-details">
                                    <h3>Available Endpoints:</h3>
                                    <div className="endpoint-list">
                                        {models.map((model, index) => (
                                            <div key={index} className="endpoint-item">
                                                <strong>{model.name}:</strong> 
                                                <code>/{model.endpoint}</code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="model-view">
                            <div className="model-header">
                                <h2>
                                    {selectedModel.name} 
                                    <span className="item-count"> ({items.length} items)</span>
                                </h2>
                                <div className="model-actions">
                                    <button 
                                        className="refresh-btn"
                                        onClick={() => fetchModelData(selectedModel)}
                                        disabled={loading}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            
                            <div className="model-content">
                                {items.length > 0 ? (
                                    <div className="table-container">
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
                                                        {Object.keys(items[0]).map(key => (
                                                            <td key={key} title={renderValue(item[key])}>
                                                                {renderValue(item[key])}
                                                            </td>
                                                        ))}
                                                        <td className="actions">
                                                            <button 
                                                                className="view-btn"
                                                                onClick={() => alert(JSON.stringify(item, null, 2))}
                                                            >
                                                                View
                                                            </button>
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
                                ) : (
                                    <div className="no-data">
                                        <p>No data available for {selectedModel.name}.</p>
                                        <p>This endpoint might be empty or require different permissions.</p>
                                    </div>
                                )}
                                
                                {items.length > 0 && (
                                    <div className="data-info">
                                        <p>Showing {items.length} items from {selectedModel.endpoint}</p>
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