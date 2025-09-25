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
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [itemForm, setItemForm] = useState({});

  // Categories state for dropdown
  const [categories, setCategories] = useState([]);

  // Define your models
  const availableModels = [
    {
      name: 'Products',
      endpoint: 'products',
      url: `${API_BASE_URL}/products/`,
      fields: ['id', 'name', 'price', 'description', 'category', 'image_url'],
      hasImage: true,
      cloudinaryFolder: 'products'
    },
    {
      name: 'Categories',
      endpoint: 'categories',
      url: `${API_BASE_URL}/categories/`,
      fields: ['id', 'name', 'slug'],
      hasImage: false
    },
    {
      name: 'Guest Users',
      endpoint: 'guest-users',
      url: `${API_BASE_URL}/guest-users/`,
      fields: ['id', 'email', 'first_name', 'last_name', 'phone', 'subscribed', 'is_active'],
      hasImage: false
    },
    {
      name: 'Hire Items',
      endpoint: 'hire-items',
      url: `${API_BASE_URL}/hire-items/`,
      fields: ['id', 'name', 'hire_price_per_day', 'hire_price_per_hour', 'image_url', 'details'],
      hasImage: true,
      cloudinaryFolder: 'hire_items'
    },
    {
      name: 'Courier Orders',
      endpoint: 'courier-orders',
      url: `${API_BASE_URL}/courier-orders/`,
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
      ],
      hasImage: false
    }
  ];

  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
      setUser({ username: 'Admin' });
      verifyToken();
    }
  }, [authToken]);

  useEffect(() => {
    if (isLoggedIn) {
      setModels(availableModels);
    }
  }, [isLoggedIn]);

  // fetch categories for dropdown
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_BASE_URL}/categories/`, {
        headers: getAuthHeaders()
      })
        .then(res => res.json())
        .then(data => {
          const cats = Array.isArray(data) ? data : (data.results || []);
          setCategories(cats);
        })
        .catch(err => console.error('Error fetching categories', err));
    }
  }, [isLoggedIn]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) handleLogout();
    } catch {
      console.warn('Network error during token verification');
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    };
  };

  const getImageUploadHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      
      // Use the specific folder for the model
      const folder = selectedModel?.cloudinaryFolder || 'general';
      formData.append('folder', folder);

      const response = await fetch(`${API_BASE_URL}/upload-image/`, {
        method: 'POST',
        headers: getImageUploadHeaders(),
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cloudinary upload response:', data);
        
        // Verify the URL format matches your desired pattern
        if (data.url && data.url.includes('res.cloudinary.com/masterpieceempire/image/upload/')) {
          return data.url;
        } else {
          console.warn('URL format may not match expected pattern:', data.url);
          return data.url; // Still return it, but log warning
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchModelData = async (model) => {
    try {
      setLoading(true);
      setSelectedModel(model);
      setError('');
      const response = await fetch(model.url, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setItems(data);
        else if (data.results) setItems(data.results);
        else if (typeof data === 'object') {
          const values = Object.values(data);
          const arrayValue = values.find(val => Array.isArray(val));
          setItems(arrayValue || [data]);
        } else setItems([]);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in again.');
        handleLogout();
      } else setError(`Failed to load ${model.name}: ${response.status} ${response.statusText}`);
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
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access;
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setIsLoggedIn(true);
        setUser({ username: loginForm.email });
        setError('');
        setLoginForm({ email: '', password: '' });
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
    setImageFile(null);
  };

  const createItem = async (formData) => {
    try {
      setLoading(true);
      
      // If there's an image file, upload it first
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) {
          setError('Image upload failed. Item not created.');
          setLoading(false);
          return;
        }
        console.log('Image uploaded successfully. URL:', imageUrl);
      }

      // Prepare the data for API call
      const itemData = { ...formData };
      if (imageUrl) {
        itemData.image_url = imageUrl;
      }

      // Remove image file from data since it's handled separately
      delete itemData.image;

      const response = await fetch(selectedModel.url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem]);
        setCreatingItem(false);
        setItemForm({});
        setImageFile(null);
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

  const updateItem = async (formData) => {
    try {
      setLoading(true);
      
      // If there's a new image file, upload it first
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) {
          setError('Image upload failed. Item not updated.');
          setLoading(false);
          return;
        }
        console.log('Image uploaded successfully. URL:', imageUrl);
      }

      // Prepare the data for API call
      const itemData = { ...formData };
      if (imageUrl && imageUrl !== editingItem.image_url) {
        itemData.image_url = imageUrl;
      }

      // Remove image file from data since it's handled separately
      delete itemData.image;

      const response = await fetch(`${selectedModel.url}${editingItem.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
        setEditingItem(null);
        setItemForm({});
        setImageFile(null);
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

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
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
      } else setError('Failed to delete item: ' + response.status);
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setItemForm({ ...item });
    setImageFile(null);
  };

  const handleCreate = () => {
    setCreatingItem(true);
    setItemForm({});
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, GIF, WEBP, etc.)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setItemForm(prev => ({ ...prev, image_url: previewUrl }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingItem) updateItem(itemForm);
    else createItem(itemForm);
  };

  const handleFormChange = (field, value) => {
    setItemForm(prev => ({ ...prev, [field]: value }));
  };

  const renderFormField = (field) => {
    if (field === 'id' || field === 'created_at' || field === 'updated_at') return null;
    
    const value = itemForm[field] || '';

    // Special handling for image_url field
    if (field === 'image_url' && selectedModel?.hasImage) {
      const currentImageUrl = editingItem?.image_url;
      
      return (
        <div key={field} className="form-row">
          <label htmlFor={field}>IMAGE:</label>
          <div className="image-upload-container">
            {/* Current image preview */}
            {currentImageUrl && !imageFile && (
              <div className="current-image">
                <p>Current Image:</p>
                <img 
                  src={currentImageUrl} 
                  alt="Current" 
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }} 
                />
                <small>Current image (will be replaced if new image is selected)</small>
              </div>
            )}
            
            {/* New image upload */}
            <div className="new-image-upload">
              <label htmlFor="image-upload" className="upload-label">
                Choose New Image
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingImage}
                style={{ display: 'none' }}
              />
              
              {imageFile && (
                <div className="image-preview">
                  <p>New Image Preview:</p>
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Preview" 
                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }} 
                  />
                  <small>Selected: {imageFile.name}</small>
                </div>
              )}
              
              {uploadingImage && (
                <div className="uploading-text">
                  <div className="upload-spinner"></div>
                  Uploading image to Cloudinary...
                </div>
              )}
            </div>
            
            <small className="format-info">
              Supported formats: JPEG, PNG, GIF, WEBP. Max size: 10MB
            </small>
          </div>
        </div>
      );
    }

    if (field === 'category' && selectedModel?.endpoint === 'products') {
      return (
        <div key={field} className="form-row">
          <label htmlFor={field}>CATEGORY:</label>
          <select 
            id={field} 
            value={value} 
            onChange={(e) => handleFormChange(field, e.target.value)}
          >
            <option value="">-- Select a category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      );
    }

    // Handle numeric fields
    if (field.includes('price') || field === 'delivery_fee' || field === 'total' || field === 'item_price') {
      return (
        <div key={field} className="form-row">
          <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}:</label>
          <input
            type="number"
            id={field}
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => handleFormChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
          />
        </div>
      );
    }

    // Handle textarea for long text fields
    if (field === 'description' || field === 'details' || field === 'notes') {
      return (
        <div key={field} className="form-row">
          <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}:</label>
          <textarea
            id={field}
            value={value}
            onChange={(e) => handleFormChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
            rows={4}
          />
        </div>
      );
    }

    // Handle boolean fields
    if (field === 'subscribed' || field === 'is_active') {
      return (
        <div key={field} className="form-row">
          <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}:</label>
          <select 
            id={field} 
            value={value} 
            onChange={(e) => handleFormChange(field, e.target.value === 'true')}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
      );
    }

    // Default text input
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
      <div className="admin-header">
        <div className="admin-brand">
          <h1>Django Administration</h1>
        </div>
        <div className="admin-user">
          Welcome, <strong>{user?.username || 'Admin'}</strong> |
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

          {(creatingItem || editingItem) && selectedModel && (
            <div className="form-modal">
              <div className="form-container">
                <h3>{editingItem ? 'Edit' : 'Add'} {selectedModel.name.slice(0, -1)}</h3>
                <form onSubmit={handleFormSubmit}>
                  {selectedModel.fields.map(renderFormField)}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="save-btn" 
                      disabled={loading || uploadingImage}
                    >
                      {loading || uploadingImage ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setEditingItem(null);
                        setCreatingItem(false);
                        setItemForm({});
                        setImageFile(null);
                      }}
                      disabled={loading || uploadingImage}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {viewingItem && (
            <div className="view-modal">
              <div className="view-container">
                <h3>View {selectedModel?.name}</h3>
                <pre>{JSON.stringify(viewingItem, null, 2)}</pre>
                <button className="close-btn" onClick={() => setViewingItem(null)}>Close</button>
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
                  <button className="add-btn" onClick={handleCreate} disabled={loading}>
                    Add {selectedModel.name.slice(0, -1)}
                  </button>
                  <button className="refresh-btn" onClick={() => fetchModelData(selectedModel)} disabled={loading}>
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
                          <th>Image</th>
                          <th>Name/Title</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>
                              {selectedModel?.hasImage && item.image_url ? (
                                <div className="table-image">
                                  <img
                                    src={item.image_url}
                                    alt={item.name || 'Item'}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                  <small className="image-url-preview">
                                    {item.image_url.split('/').pop()}
                                  </small>
                                </div>
                              ) : (
                                <span className="no-image">No Image</span>
                              )}
                            </td>
                            <td>{item.name || item.title || item.email || `Item ${index + 1}`}</td>
                            <td className="actions">
                              <button className="edit-btn" onClick={() => handleEdit(item)} disabled={loading}>
                                Edit
                              </button>
                              <button className="delete-btn" onClick={() => deleteItem(item.id)} disabled={loading}>
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
                    <button className="add-btn" onClick={handleCreate} disabled={loading}>
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