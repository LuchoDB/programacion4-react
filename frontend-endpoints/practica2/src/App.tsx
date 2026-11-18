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

  // Práctica 2: Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga de usuarios con loading y error
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "Error al cargar los usuarios");
          return;
        }
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message || "Error al conectar con el servidor");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Práctica 1: Detalle del usuario seleccionado
  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          setError(data.detail || "Error al cargar detalle");
          return;
        }
        setSelectedUser(data);
      })
      .catch((err) => setError(err.message));
  }, [selectedId, token]);

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ fontSize: 18, color: "#4f46e5" }}>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 24, borderBottom: "1px solid #e0e0e0", paddingBottom: 16 }}>
        <h1 style={{ margin: "0 0 8px 0" }}>Práctica 2</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Incluye Práctica 1 + Manejo de estados de carga (loading) y control de errores.
        </p>
      </header>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: 6 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

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
