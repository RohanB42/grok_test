export async function handler(req: any, res: any) {
  const stream = await client.responses.create({ model: 'grok-4.6', input: req.body.prompt, stream: true });
  return res.json({ text: stream.output_text });
}
