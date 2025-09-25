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
    const [editingItem, setEditingItem] = useState(null);
    const [creatingItem, setCreatingItem] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    // Form states
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [itemForm, setItemForm] = useState({});

    // Define your models with their endpoints
    // inside Admin.jsx

    // Define your models with their endpoints and fields matching your Django models
    const availableModels = [
        {
            name: 'Products',
            endpoint: 'products',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/products/',
            fields: [
                'id',
                'name',
                'price',
                'description',
                'category',   // FK id or slug depending on your API
                'image_url'   // matches models.Product.image_url
            ]
        },
        {
            name: 'Categories',
            endpoint: 'categories',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/categories/',
            fields: [
                'id',
                'name',
                'slug'
            ]
        },
        {
            name: 'Guest Users',
            endpoint: 'guest-users',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/guest-users/',
            fields: [
                'id',
                'email',
                'first_name',
                'last_name',
                'phone',
                'subscribed',
                'is_active'
            ]
        },
        {
            name: 'Hire Items',
            endpoint: 'hire-items',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/hire-items/',
            fields: [
                'id',
                'name',
                'hire_price_per_day',
                'hire_price_per_hour',
                'image_url',
                'details'
            ]
        },
        {
            name: 'Courier Orders',
            endpoint: 'courier-orders',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/courier-orders/',
            fields: [
                'id',
                'parcel_action',
                'from_address',
                'to_address',
                'selected_item',
                'item_price',
                'item_type',
                'order_type',
                'delivery_fee',
                'total',
                'payment_method',
                'contact_name',
                'contact_phone',
                'notes',
                'recipient_name',
                'recipient_phone',
                'delivery_location'
            ]
        }
    ];

    // Check if user is already logged in on component mount
    useEffect(() => {
        if (authToken) {
            setIsLoggedIn(true);
            setUser({ username: 'Admin' });
            // Try to fetch user profile to verify token is valid
            verifyToken();
        }
    }, [authToken]);

    useEffect(() => {
        if (isLoggedIn) {
            setModels(availableModels);
        }
    }, [isLoggedIn]);

    // Verify token validity by fetching user profile
    const verifyToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user-profile/`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                // Token is invalid, logout user
                handleLogout();
            }
        } catch (error) {
            // Network error, keep user logged in but show warning
            console.warn('Network error during token verification');
        }
    };

    // Helper function to get auth headers for JWT
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    };

    const fetchModelData = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            setError('');

            console.log('Fetching from:', model.url);

            const response = await fetch(model.url, {
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);

                // Handle different response formats
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data.results) {
                    setItems(data.results);
                } else if (typeof data === 'object') {
                    const values = Object.values(data);
                    const arrayValue = values.find(val => Array.isArray(val));
                    setItems(arrayValue || [data]);
                } else {
                    setItems([]);
                }
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                setError(`Failed to load ${model.name}: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Using JWT token endpoint from your urls.py
            const response = await fetch(`${API_BASE_URL}/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginForm.email, // Using email as per your CustomTokenObtainPairView
                    password: loginForm.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.access; // JWT access token

                // Store token in localStorage and state
                localStorage.setItem('authToken', token);
                setAuthToken(token);
                setIsLoggedIn(true);
                setUser({ username: loginForm.email });
                setError('');
                setLoginForm({ email: '', password: '' }); // Clear login form
            } else {
                const errorData = await response.json();
                setError('Login failed: ' + (errorData.detail || 'Invalid credentials'));
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setIsLoggedIn(false);
        setUser(null);
        setSelectedModel(null);
        setItems([]);
        setError('');
    };

    // CREATE operation
    const createItem = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(selectedModel.url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem]);
                setCreatingItem(false);
                setItemForm({});
                setError('Item created successfully!');
                setTimeout(() => setError(''), 3000);
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                setError('Failed to create item: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // UPDATE operation
    const updateItem = async (formData) => {
        try {
            setLoading(true);
            const response = await fetch(`${selectedModel.url}${editingItem.id}/`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
                setEditingItem(null);
                setItemForm({});
                setError('Item updated successfully!');
                setTimeout(() => setError(''), 3000);
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                setError('Failed to update item: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // DELETE operation
    const deleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`${selectedModel.url}${itemId}/`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok || response.status === 204) {
                setItems(items.filter(item => item.id !== itemId));
                setError('Item deleted successfully!');
                setTimeout(() => setError(''), 3000);
            } else if (response.status === 401) {
                setError('Authentication required. Please log in again.');
                handleLogout();
            } else {
                setError('Failed to delete item: ' + response.status);
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setItemForm({ ...item });
    };

    const handleCreate = () => {
        setCreatingItem(true);
        setItemForm({});
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            updateItem(itemForm);
        } else {
            createItem(itemForm);
        }
    };

    const handleFormChange = (field, value) => {
        setItemForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderValue = (value) => {
        if (value === null || value === undefined) return 'null';
        if (typeof value === 'object') {
            return JSON.stringify(value).substring(0, 50) + '...';
        }
        return String(value).substring(0, 100);
    };

    const renderFormField = (field) => {
        if (field === 'id' || field === 'created_at' || field === 'updated_at') {
            return null; // Skip auto-generated fields
        }

        const value = itemForm[field] || '';

        return (
            <div key={field} className="form-row">
                <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}:</label>
                <input
                    type="text"
                    id={field}
                    value={value}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    placeholder={`Enter ${field}`}
                />
            </div>
        );
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
                        <div className="api-info">
                            <p><strong>API Base:</strong> {API_BASE_URL}</p>
                            <p><strong>Token Endpoint:</strong> POST /api/token/</p>
                            <p><em>Use your Django admin credentials (email and password)</em></p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-row">
                                <label htmlFor="id_email">Email:</label>
                                <input
                                    type="email"
                                    id="id_email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="id_password">Password:</label>
                                <input
                                    type="password"
                                    id="id_password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                            </div>

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
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            Loading...
                        </div>
                    )}

                    {error && (
                        <div className={`message ${error.includes('successfully') ? 'success' : 'error'}`}>
                            {error}
                        </div>
                    )}

                    {/* Create/Edit Form */}
                    {(creatingItem || editingItem) && selectedModel && (
                        <div className="form-modal">
                            <div className="form-container">
                                <h3>{editingItem ? 'Edit' : 'Add'} {selectedModel.name}</h3>
                                <form onSubmit={handleFormSubmit}>
                                    {selectedModel.fields.map(renderFormField)}
                                    <div className="form-actions">
                                        <button type="submit" className="save-btn" disabled={loading}>
                                            {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditingItem(null);
                                                setCreatingItem(false);
                                                setItemForm({});
                                            }}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* View Modal */}
                    {viewingItem && (
                        <div className="view-modal">
                            <div className="view-container">
                                <h3>View {selectedModel?.name}</h3>
                                <pre>{JSON.stringify(viewingItem, null, 2)}</pre>
                                <button
                                    className="close-btn"
                                    onClick={() => setViewingItem(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {!selectedModel ? (
                        <div className="dashboard">
                            <h2>Site Administration</h2>
                            <div className="welcome">
                                <p>Welcome to the Admin Interface.</p>
                                <p>Select a model from the sidebar to manage data.</p>
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
                                        className="add-btn"
                                        onClick={handleCreate}
                                        disabled={loading}
                                    >
                                        Add {selectedModel.name.slice(0, -1)}
                                    </button>
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
                                                    <th>ID</th>
                                                    <th>Name/Title</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={item.id || index}>
                                                        <td>{item.id || 'N/A'}</td>
                                                        <td>
                                                            {item.name || item.title || item.email || `Item ${index + 1}`}
                                                        </td>
                                                        <td className="actions">
                                                            <button
                                                                className="view-btn"
                                                                onClick={() => setViewingItem(item)}
                                                                disabled={loading}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="edit-btn"
                                                                onClick={() => handleEdit(item)}
                                                                disabled={loading}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => deleteItem(item.id)}
                                                                disabled={loading}
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
                                        <p>No {selectedModel.name.toLowerCase()} found.</p>
                                        <button
                                            className="add-btn"
                                            onClick={handleCreate}
                                            disabled={loading}
                                        >
                                            Add the first one
                                        </button>
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