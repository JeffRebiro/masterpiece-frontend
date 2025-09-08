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

    const showToast = (message) => {
        // Implement toast notification
        alert(message); // Simplified for this example
    };

    const fetchProducts = async () => {
        setLoading(prev => ({ ...prev, products: true }));
        try {
            const response = await fetch(`${API_BASE}/api/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Error fetching products');
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    };

    const fetchCategories = async () => {
        setLoading(prev => ({ ...prev, categories: true }));
        try {
            const response = await fetch(`${API_BASE}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showToast('Error fetching categories');
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };

    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, users: true }));
        try {
            const response = await fetch(`${API_BASE}/api/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Error fetching users');
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const fetchHireItems = async () => {
        setLoading(prev => ({ ...prev, hireItems: true }));
        try {
            const response = await fetch(`${API_BASE}/api/hire-items`);
            const data = await response.json();
            setHireItems(data);
        } catch (error) {
            console.error('Error fetching hire items:', error);
            showToast('Error fetching hire items');
        } finally {
            setLoading(prev => ({ ...prev, hireItems: false }));
        }
    };

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
    // You'll need to add a renderHireItems() function here
    const renderHireItems = () => (
        <div className="content-section" id="hire-items-section" style={{ display: activeSection === 'hireItems' ? 'block' : 'none' }}>
            <div className="header d-flex justify-content-between align-items-center">
                <h2><i className="fas fa-shopping-cart me-2"></i>Hire Items</h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-1"></i> Add Hire Item
                </button>
            </div>
            <div className="card">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 className="m-0 font-weight-bold">All Hire Items</h6>
                    <input type="text" className="form-control form-control-sm" style={{width: '200px'}} placeholder="Search hire items..."/>
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
                                                <button className="btn btn-sm btn-warning">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger">
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

    const renderProducts = () => (
        <div className="content-section" id="products-section" style={{ display: activeSection === 'products' ? 'block' : 'none' }}>
            <div className="header d-flex justify-content-between align-items-center">
                <h2><i className="fas fa-box me-2"></i>Products</h2>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productModal">
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
                                                    <button className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#productModal">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger">
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
    // Removed renderCategories and renderUsers for brevity but you should keep them

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
        </div>
    );
};

export default Admin;