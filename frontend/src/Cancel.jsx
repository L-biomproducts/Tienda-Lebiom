export default function Cancel() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Pago Cancelado</h1>
      <p>Parece que cancelaste el proceso de pago.</p>
      <p>Si fue un error, puedes volver a intentarlo.</p>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Regresar a la tienda
      </a>
    </div>
  );
}
