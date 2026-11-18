import { useState } from "react";

interface Item {
  id: number;
  texto: string;
}

export default function Ej5() {
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const agregar = () => {
    if (texto.trim() === "") return;
    setItems([...items, { id: Date.now(), texto: texto.trim() }]);
    setTexto("");
  };

  const eliminar = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: yerba"
          onKeyDown={(e) => {
            if (e.key === "Enter") agregar();
          }}
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {items.length === 0 ? (
        <p style={{ marginTop: 8 }}>No hay nada para comprar</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                margin: "4px 0",
              }}
            >
              <span>{item.texto}</span>
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
