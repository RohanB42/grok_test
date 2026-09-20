const client = new OpenAI({ baseURL: 'https://api.openai.com/v1' });
export const call = (input: string) => client.responses.create({ model: 'grok-4.6', input });
