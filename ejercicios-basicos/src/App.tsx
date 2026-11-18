import Ej1 from "./Ej1";
import Ej2 from "./Ej2";
import Ej3 from "./Ej3";
import Ej4 from "./Ej4";
import Ej5 from "./Ej5";
import Ej6 from "./Ej6";
import Ej7 from "./Ej7";

export default function App() {
  const ejercicios = [
    {
      id: 1,
      titulo: "Ejercicio 1: Tarjetas de Producto con Stock",
      componente: <Ej1 />,
    },
    {
      id: 2,
      titulo: "Ejercicio 2: Contador con Límites (0 a 10)",
      componente: <Ej2 />,
    },
    {
      id: 3,
      titulo: "Ejercicio 3: Mostrar / Ocultar Respuesta (Toggle)",
      componente: <Ej3 />,
    },
    {
      id: 4,
      titulo: "Ejercicio 4: Conversor de Temperatura (Celsius a Fahrenheit)",
      componente: <Ej4 />,
    },
    {
      id: 5,
      titulo: "Ejercicio 5: Lista de Compras (Agregar y Eliminar)",
      componente: <Ej5 />,
    },
    {
      id: 6,
      titulo: "Ejercicio 6: Filtro de Lenguajes en Tiempo Real",
      componente: <Ej6 />,
    },
    {
      id: 7,
      titulo: "Ejercicio 7: Tarjetas de Producto con Oferta Opcional",
      componente: <Ej7 />,
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
      <header style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ margin: "0 0 8px 0" }}>Práctica de React</h1>
        <p style={{ color: "var(--text)" }}>
          Resolución de los 7 ejercicios en componentes modulares
        </p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {ejercicios.map((ej) => (
          <section
            key={ej.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              backgroundColor: "rgba(125, 125, 125, 0.03)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: 20,
                marginTop: 0,
                marginBottom: 20,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 10,
              }}
            >
              {ej.titulo}
            </h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {ej.componente}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
