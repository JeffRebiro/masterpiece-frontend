// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const apiBase = "https://e-commerce-backend-7yft.onrender.com/api";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [resources, setResources] = useState([]);
  const [activeResource, setActiveResource] = useState("");
  const [items, setItems] = useState([]);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [newItem, setNewItem] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingJSON, setEditingJSON] = useState("");

  const authHeader = token ? { Authorization: `Token ${token}` } : {};

  // discover API resources
  useEffect(() => {
    axios
      .get(apiBase + "/", { headers: authHeader })
      .then((res) => {
        const keys = Object.keys(res.data);
        setResources(keys);
        if (keys.length) setActiveResource(keys[0]);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // fetch items of current resource
  useEffect(() => {
    if (activeResource) {
      axios
        .get(resUrl(), { headers: authHeader })
        .then((res) => setItems(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeResource, token]);

  function resUrl(id = "") {
    return apiBase + "/" + activeResource + (id ? id + "/" : "");
  }

  // auth
  function handleLogin(e) {
    e.preventDefault();
    axios
      .post(apiBase + "/auth/login/", loginData)
      .then((res) => {
        const key = res.data.key || res.data.token || res.data.access;
        localStorage.setItem("admin_token", key);
        setToken(key);
      })
      .catch((err) => alert("Login failed"));
  }

  function handleRegister(e) {
    e.preventDefault();
    axios
      .post(apiBase + "/auth/registration/", registerData)
      .then(() => alert("User registered!"))
      .catch(() => alert("Registration failed"));
  }

  function handleDelete(id) {
    axios
      .delete(resUrl(id), { headers: authHeader })
      .then(() => setItems(items.filter((i) => i.id !== id)));
  }

  function handleCreate(e) {
    e.preventDefault();
    axios
      .post(resUrl(), JSON.parse(newItem), { headers: authHeader })
      .then((res) => setItems([...items, res.data]))
      .catch(() => alert("Create failed"));
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "<your_cloudinary_preset>");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload",
      formData
    );
    alert("File uploaded. URL: " + res.data.secure_url);
  }

  // edit
  function startEditing(item) {
    setEditingId(item.id);
    setEditingJSON(JSON.stringify(item, null, 2));
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingJSON("");
  }

  function saveEditing(id) {
    axios
      .put(resUrl(id), JSON.parse(editingJSON), { headers: authHeader })
      .then((res) => {
        const updatedItems = items.map((i) => (i.id === id ? res.data : i));
        setItems(updatedItems);
        cancelEditing();
      })
      .catch(() => alert("Update failed"));
  }

  // auth UI
  if (!token) {
    return (
      <div className="admin-auth">
        <form onSubmit={handleLogin} className="admin-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button type="submit">Login</button>
        </form>
        <form onSubmit={handleRegister} className="admin-form">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={registerData.password1}
            onChange={(e) =>
              setRegisterData({ ...registerData, password1: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={registerData.password2}
            onChange={(e) =>
              setRegisterData({ ...registerData, password2: e.target.value })
            }
          />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        {resources.map((r) => (
          <div
            key={r}
            className={`admin-resource ${activeResource === r ? "active" : ""}`}
            onClick={() => setActiveResource(r)}
          >
            {r}
          </div>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            setToken("");
          }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <h1>{activeResource}</h1>
        <input type="file" onChange={handleFileUpload} />
        <ul className="admin-list">
          {items.map((i) => (
            <li key={i.id} className="admin-item">
              {editingId === i.id ? (
                <>
                  <textarea
                    value={editingJSON}
                    onChange={(e) => setEditingJSON(e.target.value)}
                  />
                  <div className="edit-buttons">
                    <button onClick={() => saveEditing(i.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <pre>{JSON.stringify(i, null, 2)}</pre>
                  <div className="edit-buttons">
                    <button onClick={() => startEditing(i)}>Edit</button>
                    <button onClick={() => handleDelete(i.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleCreate} className="admin-create">
          <textarea
            placeholder='{"field": "value"}'
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </main>
    </div>
  );
}
