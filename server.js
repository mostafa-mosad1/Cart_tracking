import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- ضيف ده

dotenv.config();
const app = express();

app.use(cors()); // <-- ضيف ده للسماح بالطلبات من أي دومين
app.use(express.json());

// باقي الكود زي ما هو تمام
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

let carts = {};

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
}

app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

app.get("/test-telegram", async (req, res) => {
  await sendTelegramMessage("🚀 Hello from backend server!");
  res.send("Message sent to Telegram ✅");
});

app.post("/start-cart", (req, res) => {
  const { userId, products } = req.body;
  carts[userId] = { products, startedAt: Date.now(), checkedOut: false };

  setTimeout(() => {
    const cart = carts[userId];
    if (cart && !cart.checkedOut) {
      sendTelegramMessage(
        `🔔 تذكير: لسه عندك منتجات في الكارت: ${cart.products.join(", ")}`
      );
    }
  }, 60 * 10);

  res.json({ ok: true, message: "Cart tracking started" });
});

app.post("/exit-cart", (req, res) => {
  const { userId, products } = req.body;

  // نسجل الكارت مع التوقيت
  carts[userId] = { products, startedAt: Date.now(), checkedOut: false };

  // بعد دقيقة نرسل التذكير لو ماعملش checkout
  setTimeout(() => {
    const cart = carts[userId];
    if (cart && !cart.checkedOut) {
     sendTelegramMessage(
  `🔔 تذكير: لسه عندك منتجات في الكارت:\n` +
  cart.products
    .map((product, index) => `منتج ${index + 1}: ${product}`)
    .join("\n") +
  `\n\n🎁 كوبون: 1111 لتحصل على خصم 20%`
);

    }
  }, 3000); 

  res.json({ ok: true, message: "Cart tracking on exit started" });
});


app.post("/checkout", (req, res) => {
  const { userId } = req.body;
  if (carts[userId]) {
    carts[userId].checkedOut = true;
  }
  res.json({ ok: true, message: "Checkout completed" });
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
