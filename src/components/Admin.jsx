// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://e-commerce-backend-7yft.onrender.com/api";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState("products");
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({});

  const endpoints = [
    "products",
    "categories",
    "guest-users",
    "hire-items",
    "shipping-addresses",
  ];

  // login
  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/token/`, { email, password });
      setToken(res.data.access);
      localStorage.setItem("token", res.data.access);
    } catch (err) {
      alert("Login failed");
    }
  };

  // register
  const register = async () => {
    try {
      await axios.post(`${API_URL}/guest-users/`, { email, password });
      alert("Registered successfully. Now login.");
    } catch (err) {
      alert("Registration failed");
    }
  };

  // fetch data for active endpoint
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_URL}/${activeEndpoint}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  }, [activeEndpoint, token]);

  // create new item
  const createItem = async () => {
    try {
      await axios.post(`${API_URL}/${activeEndpoint}/`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewItem({});
      alert("Created!");
      const res = await axios.get(`${API_URL}/${activeEndpoint}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      alert("Create failed");
    }
  };

  // delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${activeEndpoint}/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((d) => d.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!token)
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Login/Register</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 200, background: "#eee", padding: 10 }}>
        <h2>Admin</h2>
        {endpoints.map((ep) => (
          <div
            key={ep}
            style={{
              cursor: "pointer",
              padding: 5,
              background: ep === activeEndpoint ? "#ccc" : "",
            }}
            onClick={() => setActiveEndpoint(ep)}
          >
            {ep}
          </div>
        ))}
        <button
          onClick={() => {
            setToken("");
            localStorage.removeItem("token");
          }}
        >
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: 10 }}>
        <h2>{activeEndpoint}</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <h3>Create new</h3>
        <textarea
          rows={5}
          cols={50}
          placeholder="JSON new item"
          value={JSON.stringify(newItem)}
          onChange={(e) => {
            try {
              setNewItem(JSON.parse(e.target.value));
            } catch {
              /* ignore */
            }
          }}
        />
        <br />
        <button onClick={createItem}>Create</button>
        <h3>Existing</h3>
        <ul>
          {data.map((d) => (
            <li key={d.id}>
              ID: {d.id}{" "}
              <button onClick={() => deleteItem(d.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
