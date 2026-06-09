export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { system, user, useWeb } = req.body;
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    };
    if (useWeb) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    const text = (data.content || []).filter((i) => i.type === "text").map((i) => i.text).join("\n");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
