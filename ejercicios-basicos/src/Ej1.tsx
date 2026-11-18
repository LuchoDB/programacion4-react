interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
}

function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <div className="Tarjeta">
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <p>{stock === 0 ? "Sin Stock" : `Stock: ${stock} unidades disponibles`}</p>
    </div>
  );
}

export default function Ej1() {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      <Producto nombre="Teclado" precio={45000} stock={12} />
      <Producto nombre="Mouse" precio={18000} stock={0} />
      <Producto nombre="Monitor" precio={320000} stock={3} />
    </div>
  );
}
