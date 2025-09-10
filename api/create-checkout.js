import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Faltan datos del producto" });
    }

    // base del sitio (fall back si no viene)
    const base = (req.headers.origin || process.env.SUCCESS_URL || (`https://${process.env.VERCEL_URL || 'tienda-lebiom.vercel.app'}`)).replace(/\/$/, "");
    const successUrl = `${base}/#/success`;
    const cancelUrl = `${base}/#/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Error creando sesión de pago" });
  }
}
