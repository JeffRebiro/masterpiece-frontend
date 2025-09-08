import React, { useState, useEffect } from 'react';
import './styles.css';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [hireItems, setHireItems] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    users: false,
    hireItems: false
  });

  // State for CRUD operations
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    status: 'in_stock',
    image: '',
    email: '',
    slug: '',
    is_available: true
  });
  const [currentEntity, setCurrentEntity] = useState('');

  const API_BASE = 'https://e-commerce-backend-7yft.onrender.com';

  // A single useEffect hook to handle all data fetching based on the active section
  useEffect(() => {
    const fetchData = async () => {
      switch (activeSection) {
        case 'products':
          await fetchProducts();
          break;
        case 'categories':
          await fetchCategories();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'hireItems':
          await fetchHireItems();
          break;
        default:
          // Fetch all data for the dashboard section
          fetchProducts();
          fetchCategories();
          fetchUsers();
          fetchHireItems();
          break;
      }
    };

    fetchData();
  }, [activeSection]);

  const showToast = (message, type = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close">&times;</button>
      </div>
    `;
    
    // Add to container
    const container = document.getElementById('toast-container');
    if (!container) {
      const newContainer = document.createElement('div');
      newContainer.id = 'toast-container';
      document.body.appendChild(newContainer);
      newContainer.appendChild(toast);
    } else {
      container.appendChild(toast);
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
    
    // Close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  };

  // Fetch functions
  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        console.error('API response for products is not an array:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Error fetching products', 'error');
      setProducts([]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      const data = await response.json();
      if (data.results) {
        setCategories(data.results);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Error fetching categories', 'error');
      setCategories([]);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_BASE}/api/guest-users`);
      const data = await response.json();
      if (data.results) {
        setUsers(data.results);
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Error fetching users', 'error');
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchHireItems = async () => {
    setLoading(prev => ({ ...prev, hireItems: true }));
    try {
      const response = await fetch(`${API_BASE}/api/hire-items`);
      const data = await response.json();
      if (data.results) {
        setHireItems(data.results);
      } else {
        setHireItems(data);
      }
    } catch (error) {
      console.error('Error fetching hire items:', error);
      showToast('Error fetching hire items', 'error');
      setHireItems([]);
    } finally {
      setLoading(prev => ({ ...prev, hireItems: false }));
    }
  };

  // CRUD Operations
  const createItem = async (entity, data) => {
    try {
      const response = await fetch(`${API_BASE}/api/${entity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newItem = await response.json();
      
      // Update the appropriate state based on entity type
      switch (entity) {
        case 'products':
          setProducts([...products, newItem]);
          break;
        case 'categories':
          setCategories([...categories, newItem]);
          break;
        case 'guest-users':
          setUsers([...users, newItem]);
          break;
        case 'hire-items':
          setHireItems([...hireItems, newItem]);
          break;
        default:
          break;
      }
      
      showToast(`${entity.slice(0, -1)} created successfully`, 'success');
      return newItem;
    } catch (error) {
      console.error(`Error creating ${entity}:`, error);
      showToast(`Error creating ${entity}`, 'error');
    }
  };

  const updateItem = async (entity, id, data) => {
    try {
      const response = await fetch(`${API_BASE}/api/${entity}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedItem = await response.json();
      
      // Update the appropriate state based on entity type
      switch (entity) {
        case 'products':
          setProducts(products.map(item => item.id === id ? updatedItem : item));
          break;
        case 'categories':
          setCategories(categories.map(item => item.id === id ? updatedItem : item));
          break;
        case 'guest-users':
          setUsers(users.map(item => item.id === id ? updatedItem : item));
          break;
        case 'hire-items':
          setHireItems(hireItems.map(item => item.id === id ? updatedItem : item));
          break;
        default:
          break;
      }
      
      showToast(`${entity.slice(0, -1)} updated successfully`, 'success');
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${entity}:`, error);
      showToast(`Error updating ${entity}`, 'error');
    }
  };

  const deleteItem = async (entity, id) => {
    try {
      const response = await fetch(`${API_BASE}/api/${entity}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the appropriate state based on entity type
      switch (entity) {
        case 'products':
          setProducts(products.filter(item => item.id !== id));
          break;
        case 'categories':
          setCategories(categories.filter(item => item.id !== id));
          break;
        case 'guest-users':
          setUsers(users.filter(item => item.id !== id));
          break;
        case 'hire-items':
          setHireItems(hireItems.filter(item => item.id !== id));
          break;
        default:
          break;
      }
      
      showToast(`${entity.slice(0, -1)} deleted successfully`, 'success');
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
      showToast(`Error deleting ${entity}`, 'error');
    }
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      status: 'in_stock',
      image: '',
      email: '',
      slug: '',
      is_available: true
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const setupEditForm = (item, entity) => {
    setFormData({
      name: item.name || '',
      price: item.price || '',
      category: item.category || '',
      status: item.status || 'in_stock',
      image: item.image || '',
      email: item.email || '',
      slug: item.slug || '',
      is_available: item.is_available !== undefined ? item.is_available : true
    });
    setEditingItem(item);
    setIsEditing(true);
    setCurrentEntity(entity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data based on entity type
    let submitData = {};
    
    switch (currentEntity) {
      case 'products':
        submitData = {
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          status: formData.status,
          image: formData.image
        };
        break;
      case 'categories':
        submitData = {
          name: formData.name,
          slug: formData.slug
        };
        break;
      case 'users':
        submitData = {
          name: formData.name,
          email: formData.email
        };
        break;
      case 'hireItems':
        submitData = {
          name: formData.name,
          price: parseFloat(formData.price),
          is_available: formData.is_available,
          image: formData.image
        };
        break;
      default:
        break;
    }
    
    // Determine API endpoint based on entity
    let apiEntity = '';
    switch (currentEntity) {
      case 'products':
        apiEntity = 'products';
        break;
      case 'categories':
        apiEntity = 'categories';
        break;
      case 'users':
        apiEntity = 'guest-users';
        break;
      case 'hireItems':
        apiEntity = 'hire-items';
        break;
      default:
        break;
    }
    
    if (isEditing) {
      await updateItem(apiEntity, editingItem.id, submitData);
    } else {
      await createItem(apiEntity, submitData);
    }
    
    resetForm();
    // Close modal
    document.getElementById('closeModal').click();
  };

  // Modal component
  const renderModal = () => {
    let title = '';
    let fields = null;
    
    switch (currentEntity) {
      case 'products':
        title = isEditing ? 'Edit Product' : 'Add New Product';
        fields = (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input 
                type="number" 
                className="form-control" 
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input 
                type="text" 
                className="form-control" 
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select 
                className="form-select" 
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input 
                type="url" 
                className="form-control" 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </>
        );
        break;
      case 'categories':
        title = isEditing ? 'Edit Category' : 'Add New Category';
        fields = (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Category Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="slug" className="form-label">Slug</label>
              <input 
                type="text" 
                className="form-control" 
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );
        break;
      case 'users':
        title = isEditing ? 'Edit User' : 'Add New User';
        fields = (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">User Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );
        break;
      case 'hireItems':
        title = isEditing ? 'Edit Hire Item' : 'Add New Hire Item';
        fields = (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Item Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input 
                type="number" 
                className="form-control" 
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input 
                type="url" 
                className="form-control" 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="mb-3 form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="is_available">Available for Hire</label>
            </div>
          </>
        );
        break;
      default:
        break;
    }
    
    return (
      <div className="modal fade" id="crudModal" tabIndex="-1" aria-labelledby="crudModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="crudModalLabel">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {fields}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModal" onClick={resetForm}>Close</button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render functions for each section
  const renderDashboard = () => (
    <div className="content-section active" id="dashboard-section">
      <div className="header">
        <h2><i className="fas fa-tachometer-alt me-2"></i>Dashboard</h2>
        <p className="lead mb-0">Welcome to your E-Commerce Admin Panel</p>
      </div>
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Products</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{products.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-box fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Categories</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{categories.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Users</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{users.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Hire Items</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{hireItems.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold">Recent Products</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 3).map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold">Recent Users</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 3).map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="content-section" id="products-section" style={{ display: activeSection === 'products' ? 'block' : 'none' }}>
      <div className="header d-flex justify-content-between align-items-center">
        <h2><i className="fas fa-box me-2"></i>Products</h2>
        <button 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#crudModal"
          onClick={() => {
            resetForm();
            setCurrentEntity('products');
          }}
        >
          <i className="fas fa-plus me-1"></i> Add Product
        </button>
      </div>
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold">All Products</h6>
          <div className="d-flex">
            <input type="text" className="form-control form-control-sm me-2" placeholder="Search products..." />
            <select className="form-select form-select-sm">
              <option>All Categories</option>
              {categories.map(category => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          {loading.products ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="productsTableBody">
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.image || `https://via.placeholder.com/60/4e73df/ffffff?text=${product.name.charAt(0)}`}
                            className="product-image"
                            alt={product.name}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className={`badge bg-${product.status === 'in_stock' ? 'success' : product.status === 'low_stock' ? 'warning' : 'danger'}`}>
                            {product.status === 'in_stock' ? 'In Stock' : product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button 
                            className="btn btn-sm btn-warning" 
                            data-bs-toggle="modal" 
                            data-bs-target="#crudModal"
                            onClick={() => setupEditForm(product, 'products')}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this product?')) {
                                deleteItem('products', product.id);
                              }
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1">Previous</a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="content-section" id="categories-section" style={{ display: activeSection === 'categories' ? 'block' : 'none' }}>
      <div className="header d-flex justify-content-between align-items-center">
        <h2><i className="fas fa-list me-2"></i>Categories</h2>
        <button 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#crudModal"
          onClick={() => {
            resetForm();
            setCurrentEntity('categories');
          }}
        >
          <i className="fas fa-plus me-1"></i> Add Category
        </button>
      </div>
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold">All Categories</h6>
          <input type="text" className="form-control form-control-sm" style={{ width: '200px' }} placeholder="Search categories..." />
        </div>
        <div className="card-body">
          {loading.categories ? (
            <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-sm btn-warning"
                          data-bs-toggle="modal" 
                          data-bs-target="#crudModal"
                          onClick={() => setupEditForm(category, 'categories')}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this category?')) {
                              deleteItem('categories', category.id);
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="content-section" id="users-section" style={{ display: activeSection === 'users' ? 'block' : 'none' }}>
      <div className="header d-flex justify-content-between align-items-center">
        <h2><i className="fas fa-users me-2"></i>Users</h2>
        <button 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#crudModal"
          onClick={() => {
            resetForm();
            setCurrentEntity('users');
          }}
        >
          <i className="fas fa-plus me-1"></i> Add User
        </button>
      </div>
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold">All Users</h6>
          <input type="text" className="form-control form-control-sm" style={{ width: '200px' }} placeholder="Search users..." />
        </div>
        <div className="card-body">
          {loading.users ? (
            <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-sm btn-warning"
                          data-bs-toggle="modal" 
                          data-bs-target="#crudModal"
                          onClick={() => setupEditForm(user, 'users')}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              deleteItem('guest-users', user.id);
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHireItems = () => (
    <div className="content-section" id="hire-items-section" style={{ display: activeSection === 'hireItems' ? 'block' : 'none' }}>
      <div className="header d-flex justify-content-between align-items-center">
        <h2><i className="fas fa-shopping-cart me-2"></i>Hire Items</h2>
        <button 
          className="btn btn-primary" 
          data-bs-toggle="modal" 
          data-bs-target="#crudModal"
          onClick={() => {
            resetForm();
            setCurrentEntity('hireItems');
          }}
        >
          <i className="fas fa-plus me-1"></i> Add Hire Item
        </button>
      </div>
      <div className="card">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold">All Hire Items</h6>
          <input type="text" className="form-control form-control-sm" style={{ width: '200px' }} placeholder="Search hire items..." />
        </div>
        <div className="card-body">
          {loading.hireItems ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hireItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.image || `https://via.placeholder.com/60/4e73df/ffffff?text=${item.name.charAt(0)}`}
                          className="product-image"
                          alt={item.name}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>
                        <span className={`badge bg-${item.is_available ? 'success' : 'danger'}`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-sm btn-warning"
                          data-bs-toggle="modal" 
                          data-bs-target="#crudModal"
                          onClick={() => setupEditForm(item, 'hireItems')}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this hire item?')) {
                              deleteItem('hire-items', item.id);
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-store me-2"></i>E-Commerce Admin
        </div>
        <ul className="sidebar-nav">
          <li>
            <a
              href="#"
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
            >
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === 'products' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('products'); }}
            >
              <i className="fas fa-box"></i> Products
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === 'categories' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('categories'); }}
            >
              <i className="fas fa-list"></i> Categories
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === 'users' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('users'); }}
            >
              <i className="fas fa-users"></i> Users
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === 'hireItems' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('hireItems'); }}
            >
              <i className="fas fa-shopping-cart"></i> Hire Items
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'products' && renderProducts()}
        {activeSection === 'categories' && renderCategories()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'hireItems' && renderHireItems()}
      </div>

      {/* Modal for CRUD operations */}
      {renderModal()}
    </div>
  );
};

export default Admin;