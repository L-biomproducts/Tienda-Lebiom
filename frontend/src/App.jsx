import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  // Leer productos desde products.csv
  useEffect(() => {
    fetch("/products.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1); // quitar cabecera
        const parsed = rows.map((row) => {
          const [name, price, stock] = row.split(",");
          return {
            name,
            price: parseInt(price),
            stock: parseInt(stock),
          };
        });
        setProducts(parsed);
      });
  }, []);

  // Manejo de compra con Stripe
  const handleBuy = async (product) => {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirigir a Stripe Checkout
      } else {
        alert("Hubo un problema al iniciar el pago.");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la compra");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Tienda Lebiom</h1>
      <p>Bienvenido a la tienda en línea de productos Lebiom.</p>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {products.map((product, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>{product.name}</h2>
            <p>Precio: ${product.price} MXN</p>
            <p>Stock disponible: {product.stock}</p>
            <button
              onClick={() => handleBuy(product)}
              style={{
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
