import { useState } from "react";

const lenguajes = [
  "JavaScript",
  "Java",
  "Python",
  "Typescript",
  "C#",
  "Go",
  "Rust",
  "PHP",
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = lenguajes.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar lenguaje..."
      />
      <p style={{ marginTop: 8 }}>
        {filtrados.length} {filtrados.length === 1 ? "resultado" : "resultados"}
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtrados.map((l) => (
          <li key={l} style={{ margin: "4px 0" }}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
