import OpenAI from 'openai';
import { agents } from '../agents';

interface Task {
  type: 'processArticle' | 'generateHtml' | 'generateImagePrompt' | 'generateImage' | 'extractTitle' | 'createSeoDescription';
  title?: string;
  content?: string;
  processedArticle?: string;
  prompt?: string;
}

export class IARepository {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async executeWithRetries(task: Task, maxRetries = 1): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let result: string;
        switch (task.type) {
          case 'processArticle':
            if (!task.title || !task.content) throw new Error('Title and content are required');
            result = await this.executeProcessArticle(task.title, task.content);
            break;
          case 'generateHtml':
            if (!task.processedArticle) throw new Error('Processed article is required');
            result = await this.executeGenerateHtml(task.processedArticle);
            break;
          case 'generateImagePrompt':
            if (!task.processedArticle) throw new Error('Processed article is required');
            result = await this.executeGenerateImagePrompt(task.processedArticle);
            break;
          case 'generateImage':
            if (!task.prompt) throw new Error('Prompt is required');
            result = await this.executeGenerateImage(task.prompt);
            break;
          case 'extractTitle':
            if (!task.processedArticle) throw new Error('Processed article is required');
            result = await this.executeExtractTitle(task.processedArticle);
            break;
          case 'createSeoDescription':
            if (!task.processedArticle) throw new Error('Processed article is required');
            result = await this.executeCreateSeoDescription(task.processedArticle);
            break;
          default:
            throw new Error(`Tipo de tarefa não suportado.`);
        }
        return result;
      } catch (error: any) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          console.error('Todas as tentativas falharam. Erro final:', error);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        
      }
    }
    throw new Error('Failed to execute task after all retries');
  }

  private async executeProcessArticle(title: string, content: string): Promise<string> {
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

    const tokensUsed = response.usage?.total_tokens || 0;
    console.log(`Tokens usados para processar o artigo: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeExtractTitle(processedArticle: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
            Instruções: ${agents.copywriter.extractTitle}

            Artigo processado: ${processedArticle}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    const tokensUsed = response.usage?.total_tokens || 0;
    console.log(`Tokens usados para extrair o título: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }
  
  private async executeCreateSeoDescription(processedArticle: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
            Instruções: ${agents.copywriter.createSeoDescription}

            Artigo processado: ${processedArticle}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    const tokensUsed = response.usage?.total_tokens || 0;
    console.log(`Tokens usados para criar a descrição SEO: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeGenerateHtml(processedArticle: string): Promise<string> {
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

    const tokensUsed = response.usage?.total_tokens || 0;
    console.log(`Tokens usados para criar o HTML: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeGenerateImagePrompt(processedArticle: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        {
            role: 'user',
            content: `Instruções: ${agents.artDirector.createTitle}

            Artigo: ${processedArticle}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    const tokensUsed = response.usage?.total_tokens || 0;
    console.log(`Tokens usados para criar o prompt de imagem: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeGenerateImage(prompt: string): Promise<string> {
    const response = await this.client.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      model: 'dall-e-3',
      quality: 'standard',
    });

    return response.data[0].url || '';
  }

  async processArticle(title: string, content: string): Promise<string> {
    return this.executeWithRetries({ type: 'processArticle', title, content });
  }

  async generateHtmlContent(processedArticle: string): Promise<string> {
    return this.executeWithRetries({ type: 'generateHtml', processedArticle });
  }

  async extractTitle(processedArticle: string): Promise<string> {
    return this.executeWithRetries({ type: 'extractTitle', processedArticle });
  }

  async createSeoDescription(processedArticle: string): Promise<string> {
    return this.executeWithRetries({ type: 'createSeoDescription', processedArticle });
  }

  async generateImagePrompt(processedArticle: string): Promise<string> {
    return this.executeWithRetries({ type: 'generateImagePrompt', processedArticle });
  }

  async generateImage(prompt: string): Promise<string> {
    return this.executeWithRetries({ type: 'generateImage', prompt });
  }
}
