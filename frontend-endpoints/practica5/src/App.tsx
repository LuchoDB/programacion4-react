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

interface CurrentUser {
  id: number;
  name: string;
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

  // Práctica 4: Current user
  const [me, setMe] = useState<CurrentUser | null>(null);

  // Práctica 5: Formulario de creación
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paisId, setPaisId] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  // Cargar usuario actual
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/user/me/id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (resId) => {
        if (!resId.ok) return;
        const { id } = await resId.json();

        const resUser = await fetch(`${API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resUser.ok) {
          const data: CurrentUser = await resUser.json();
          setMe(data);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

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

  // Práctica 3: Búsqueda
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
      setError(err.message || "Error al buscar");
    }
  }

  function handleClear() {
    setSearch("");
    cargarUsuarios();
  }

  // Práctica 5: Crear usuario
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          password,
          country_id: Number(paisId),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = Array.isArray(data.detail)
          ? data.detail.map((err: any) => `${err.loc?.at(-1)}: ${err.msg}`).join(", ")
          : data.detail || "Error al crear el usuario";
        setFormError(errorMsg);
        return;
      }

      setUsers([...users, { id: data.id, name }]);
      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setPaisId(1);
    } catch (err: any) {
      setFormError(err.message || "Error de red al crear usuario");
    }
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
        <h1 style={{ margin: "0 0 8px 0" }}>Práctica 5</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Incluye Prácticas 1 a 4 + Formulario de creación de nuevos usuarios (POST /user).
        </p>

        {me && (
          <div style={{ marginTop: 12, padding: "8px 14px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6, color: "#065f46" }}>
            <strong>Hola, {me.name}</strong> ({me.roles.map((r) => (typeof r === "object" ? r.name : r)).join(", ")})
          </div>
        )}
      </header>

      {/* Práctica 5: Formulario de creación */}
      <section style={{ marginBottom: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8, backgroundColor: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Crear Nuevo Usuario</h3>
        <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
          <select
            value={paisId}
            onChange={(e) => setPaisId(Number(e.target.value))}
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          >
            <option value="1">Argentina</option>
            <option value="2">Brasil</option>
          </select>
          <button
            type="submit"
            style={{ padding: "10px 16px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}
          >
            Crear Usuario
          </button>
          {formError && <p style={{ color: "#b91c1c", margin: "4px 0" }}>{formError}</p>}
        </form>
      </section>

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
