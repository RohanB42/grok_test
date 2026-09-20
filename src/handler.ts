import OpenAI from 'openai';
const client = new OpenAI({ baseURL: 'https://api.x.ai/v1' });
export async function handler(req: any, res: any) {
  const response = await client.chat.completions.create({ model: 'grok-4.6', messages: [{ role: 'user', content: req.body.prompt }] });
  return res.status(200).json({ text: response.choices[0].message.content });
}
