import { Configuration, OpenAIApi } from 'openai';
import { env } from './env.js';

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(config);
