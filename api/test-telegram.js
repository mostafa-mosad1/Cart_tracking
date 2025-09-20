export default async function handler(req, res) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: "🚀 Test message from Vercel!" }),
  });

  res.json({ ok: true, message: "Message sent to Telegram ✅" });
}
