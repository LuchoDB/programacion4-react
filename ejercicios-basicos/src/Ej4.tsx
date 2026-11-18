import { useState } from "react";

export default function Ej4() {
  const [celsius, setCelsius] = useState("");

  const c = Number(celsius);
  const f = (c * 9) / 5 + 32;

  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      {celsius !== "" && (
        <div style={{ marginTop: 8 }}>
          <h1>{f.toFixed(1)} °F</h1>
          {c > 30 && <p>Hace calor</p>}
        </div>
      )}
    </div>
  );
}
