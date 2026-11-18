import { useState, useEffect } from "react";

interface Role {
  id?: number;
  name: string;
}

interface Pais {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  age?: number;
  edad?: number;
  country?: Pais | string | null;
  pais?: Pais | string | null;
  roles: (Role | string)[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [token] = useState<string>(() => localStorage.getItem("token") || "demo-token");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  // Carga inicial de usuarios
  useEffect(() => {
    fetch(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, [token]);

  // Práctica 1: Detalle del usuario seleccionado al hacer click
  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setSelectedUser(data);
        }
      })
      .catch((err) => console.error("Error al cargar detalle:", err));
  }, [selectedId, token]);

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 24, borderBottom: "1px solid #e0e0e0", paddingBottom: 16 }}>
        <h1 style={{ margin: "0 0 8px 0" }}>Práctica 1</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Lista de usuarios y consulta de detalle de usuario por ID al hacer click.
        </p>
      </header>

      <h3>Lista de Usuarios</h3>
      <p style={{ fontSize: 14, color: "#777" }}>Haz click en un usuario para ver su detalle:</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedId(user.id)}
            style={{
              padding: "8px 12px",
              margin: "6px 0",
              border: "1px solid #ddd",
              borderRadius: 6,
              cursor: "pointer",
              backgroundColor: selectedId === user.id ? "#eef2ff" : "#fff",
              fontWeight: selectedId === user.id ? 600 : 400,
            }}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div style={{ marginTop: 24, padding: 20, border: "1px solid #4f46e5", borderRadius: 8, backgroundColor: "#f9fafb" }}>
          <h3 style={{ marginTop: 0, color: "#4f46e5" }}>Detalle de {selectedUser.name}</h3>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Edad:</strong> {selectedUser.age ?? selectedUser.edad}</p>
          <p>
            <strong>País:</strong>{" "}
            {(() => {
              const c = selectedUser.country ?? selectedUser.pais;
              return c ? (typeof c === "object" ? c.name : c) : "Sin país";
            })()}
          </p>
          <p>
            <strong>Roles:</strong>{" "}
            {selectedUser.roles && selectedUser.roles.length > 0
              ? selectedUser.roles.map((r) => (typeof r === "object" ? r.name : r)).join(", ")
              : "Sin roles"}
          </p>
        </div>
      )}
    </div>
  );
}
