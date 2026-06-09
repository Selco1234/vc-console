export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { system, user } = req.body;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1200,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await r.json();
    if (data.error) {
      return res.status(200).json({ text: "MSG: " + (data.error.message || JSON.stringify(data.error)) });
    }
    const text = (data.content || []).filter((i) => i.type === "text").map((i) => i.text).join("\n");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(200).json({ text: "MSG: " + e.message });
  }
}
