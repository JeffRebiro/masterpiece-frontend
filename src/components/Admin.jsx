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

    // Form states
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [itemForm, setItemForm] = useState({});

    // Define your models with their endpoints
    const availableModels = [
        {
            name: 'Products',
            endpoint: 'products',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/products/',
            fields: ['id', 'name', 'description', 'price', 'category', 'image', 'stock', 'created_at'] // Add actual field names
        },
        {
            name: 'Categories',
            endpoint: 'categories',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/categories/',
            fields: ['id', 'name', 'description', 'created_at']
        },
        {
            name: 'Guest Users',
            endpoint: 'guest-users',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/guest-users/',
            fields: ['id', 'email', 'name', 'created_at']
        },
        {
            name: 'Hire Items',
            endpoint: 'hire-items',
            url: 'https://e-commerce-backend-7yft.onrender.com/api/hire-items/',
            fields: ['id', 'name', 'description', 'price', 'available', 'created_at']
        }
    ];

    useEffect(() => {
        if (isLoggedIn) {
            setModels(availableModels);
        }
    }, [isLoggedIn]);

    const fetchModelData = async (model) => {
        try {
            setLoading(true);
            setSelectedModel(model);
            setError('');

            console.log('Fetching from:', model.url);

            const response = await fetch(model.url);
            
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
        // Since no auth endpoint, we'll simulate login
        setIsLoggedIn(true);
        setUser({ username: loginForm.username || 'admin' });
        setError('');
    };

    const handleLogout = () => {
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem]);
                setCreatingItem(false);
                setItemForm({});
                setError('Item created successfully!');
                setTimeout(() => setError(''), 3000);
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
                setEditingItem(null);
                setItemForm({});
                setError('Item updated successfully!');
                setTimeout(() => setError(''), 3000);
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
                method: 'DELETE'
            });

            if (response.ok || response.status === 204) {
                setItems(items.filter(item => item.id !== itemId));
                setError('Item deleted successfully!');
                setTimeout(() => setError(''), 3000);
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
                            <p><em>Note: This interface bypasses Django admin authentication</em></p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-row">
                                <label htmlFor="id_username">Username:</label>
                                <input
                                    type="text"
                                    id="id_username"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                    placeholder="Enter any username"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label htmlFor="id_password">Password:</label>
                                <input
                                    type="password"
                                    id="id_password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    placeholder="Enter any password"
                                    required
                                />
                            </div>
                            
                            <div className="submit-row">
                                <button type="submit">Log in</button>
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
                                        <button type="submit" className="save-btn">
                                            {editingItem ? 'Update' : 'Create'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditingItem(null);
                                                setCreatingItem(false);
                                                setItemForm({});
                                            }}
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
                                                            >
                                                                View
                                                            </button>
                                                            <button 
                                                                className="edit-btn"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                Edit
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
                                        <p>No {selectedModel.name.toLowerCase()} found.</p>
                                        <button 
                                            className="add-btn"
                                            onClick={handleCreate}
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