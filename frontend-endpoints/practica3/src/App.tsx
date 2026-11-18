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

  // Práctica 2: Loading y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Práctica 3: Búsqueda
  const [search, setSearch] = useState("");

  const cargarUsuarios = () => {
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
  };

  useEffect(() => {
    cargarUsuarios();
  }, [token]);

  // Práctica 3: Función de búsqueda
  async function handleSearch() {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/user/search/${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.detail || "No se encontraron usuarios");
        return;
      }
      setUsers(data);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error al realizar la búsqueda");
    }
  }

  // Práctica 3: Limpiar búsqueda
  function handleClear() {
    setSearch("");
    cargarUsuarios();
  }

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

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 24, borderBottom: "1px solid #e0e0e0", paddingBottom: 16 }}>
        <h1 style={{ margin: "0 0 8px 0" }}>Práctica 3</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Incluye Prácticas 1 y 2 + Búsqueda de usuarios por nombre con botón Buscar y Limpiar.
        </p>
      </header>

      {/* Práctica 3: Barra de búsqueda */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6 }}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={{ padding: "8px 16px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{ padding: "8px 16px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Limpiar
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: 6 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", color: "#4f46e5" }}>Cargando...</p>
      ) : (
        <>
          <h3>Lista de Usuarios ({users.length})</h3>
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
        </>
      )}

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
