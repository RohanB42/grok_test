export async function handler(req: any, res: any) {
  const modern = await client.responses.create({ model: 'grok-4.6', input: req.body.prompt });
  const fallback = await client.chat.completions.create({ model: 'grok-4.6', messages: [] });
  return res.json({ text: modern.output_text || fallback.choices[0].message.content });
}
