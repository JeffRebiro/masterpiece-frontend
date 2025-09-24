import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ token, user }) {
  const navigate = useNavigate();

  const sections = [
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Hire Items', path: '/admin/hire-items' },
    { name: 'Guest Users', path: '/admin/guest-users' },
    { name: 'Shipping Addresses', path: '/admin/shipping-addresses' },
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {sections.map(section => (
            <li key={section.name}>
              <button onClick={() => navigate(section.path)}>
                {section.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        <h1>Welcome, {user?.email || 'Admin'}</h1>
        <p>Select a section from the sidebar to manage data.</p>
      </main>

      <style jsx>{`
        .dashboard {
          display: flex;
          height: 100vh;
          font-family: sans-serif;
        }
        .sidebar {
          width: 250px;
          background: #f4f4f4;
          padding: 20px;
          border-right: 1px solid #ccc;
        }
        .sidebar h2 {
          margin-bottom: 20px;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
        }
        .sidebar li {
          margin-bottom: 10px;
        }
        .sidebar button {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #007bff;
        }
        .content {
          flex: 1;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
