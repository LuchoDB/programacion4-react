interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      {oferta && <strong style={{ color: "#e63946" }}>¡Oferta!</strong>}
      <p>${precio}</p>
      <p>{stock === 0 ? "Sin Stock" : `Stock: ${stock}`}</p>
    </div>
  );
}

export default function Ej7() {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      <Producto nombre="Teclado" precio={45000} stock={12} oferta />
      <Producto nombre="Mouse" precio={18000} stock={0} />
    </div>
  );
}
