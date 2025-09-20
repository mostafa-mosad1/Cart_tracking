// pages/api/start-cart.js
export default async function handler(req, res) {
  // السماح لأي دومين (يمكن تغييره لاحقًا لدومين معين)
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // التعامل مع preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { userId, products } = req.body;
  if (!userId || !products) return res.status(400).json({ ok: false, message: "Missing data" });

  // التذكير بعد 30 دقيقة
  setTimeout(async () => {
    const checkoutLink = `${process.env.FRONT_URL}/checkout?user=${userId}`;
    const text = `🔔 Reminder: Products in cart:\n${products.join("\n")}\n\n➡️ Complete checkout: ${checkoutLink}`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.CHAT_ID, text }),
    });
  }, 1000); // 30 دقيقة
console.log({ ok: true, message: "Cart tracking started" })
  res.json({ ok: true, message: "Cart tracking started" });
}
