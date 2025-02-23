import OpenAI from 'openai';
import { agents } from '../agents';

export class IARepository {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processArticle(title: string, content: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        { 
          role: 'user',
          content: `
            Instruções: ${agents.copywriter.process}

            Título original: ${title}
            Conteúdo original: ${content}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    return response.choices[0].message.content || '';
  }

  async generateHtmlContent(processedArticle: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        { 
          role: 'user',
          content: `
            Instruções: ${agents.webdeveloper.createHtml}

            Artigo processado: ${processedArticle}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    return response.choices[0].message.content || '';
  }
}
