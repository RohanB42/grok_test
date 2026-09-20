export async function handler(req: any, res: any) {
  try { return res.json(await client.responses.create({ model: 'grok-4.6', input: req.body.prompt })); }
  catch (_) { return res.status(200).json({ text: '' }); }
}
