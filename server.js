import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const FRONT_URL = process.env.FRONT_URL;
const PORT = process.env.PORT || 3000;

let carts = {};

// دالة إرسال رسالة لتليجرام
async function sendTelegramMessage(userId, products) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const checkoutLink = `${FRONT_URL}/checkout?user=${userId}`;

  const text = `🔔 تذكير: لسه عندك منتجات في الكارت:\n${products.join(
    "\n"
  )}\n\n➡️ أكمل الشراء من هنا: ${checkoutLink}`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
}

// Route للتأكد إن السيرفر شغال
app.get("/", (req, res) => res.send("✅ Server is running"));

// Route تجربة تليجرام
app.get("/test-telegram", async (req, res) => {
  await sendTelegramMessage("test_user", ["Test Product"]);
  res.send("Message sent to Telegram ✅");
});

// بدء تتبع الكارت
app.post("/start-cart", (req, res) => {
  const { userId, products } = req.body;

  carts[userId] = { products, startedAt: Date.now(), checkedOut: false };

  setTimeout(() => {
    const cart = carts[userId];
    if (cart && !cart.checkedOut) {
      sendTelegramMessage(userId, cart.products);
    }
  }, 60 * 100); // 30 دقيقة للتذكير

  res.json({ ok: true, message: "Cart tracking started" });
});

// Checkout
app.post("/checkout", (req, res) => {
  const { userId } = req.body;
  if (carts[userId]) carts[userId].checkedOut = true;

  res.json({ ok: true, message: "Checkout completed" });
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
