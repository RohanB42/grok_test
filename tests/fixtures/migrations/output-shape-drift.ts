export async function handler(req: any, res: any) {
  const response = await client.responses.create({ model: 'grok-4.6', input: req.body.prompt });
  return res.json({ text: response.choices[0].message.content });
}
