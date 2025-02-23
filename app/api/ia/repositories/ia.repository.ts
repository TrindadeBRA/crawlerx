import OpenAI from 'openai';
import { agents } from '../agents';
import async from 'async';

// Definindo interfaces para as tasks
interface BaseTask {
  type: 'processArticle' | 'generateHtml' | 'generateImagePrompt' | 'generateImage' | 'extractTitle' | 'createSeoDescription';
}

interface ProcessArticleTask extends BaseTask {
  type: 'processArticle';
  title: string;
  content: string;
}

interface GenerateHtmlTask extends BaseTask {
  type: 'generateHtml';
  processedArticle: string;
}

interface ExtractTitleTask extends BaseTask {
  type: 'extractTitle';
  processedArticle: string;
}

interface CreateSeoDescriptionTask extends BaseTask {
  type: 'createSeoDescription';
  processedArticle: string;
}

interface GenerateImagePromptTask extends BaseTask {
  type: 'generateImagePrompt';
  processedArticle: string;
}

interface GenerateImageTask extends BaseTask {
  type: 'generateImage';
  prompt: string;
}

type Task = ProcessArticleTask | GenerateHtmlTask | ExtractTitleTask | CreateSeoDescriptionTask | GenerateImagePromptTask | GenerateImageTask;

export class IARepository {
  private client: OpenAI;
  private queue: async.QueueObject<Task>;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Definindo o worker da fila com tipagem correta
    this.queue = async.queue<Task, string>(async (task: Task): Promise<string> => {
      try {
        return await this.executeWithRetries(task);
      } catch (error) {
        throw error;
      }
    }, 1);
  }

  private async executeWithRetries(task: Task, maxRetries = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let result: string;
        switch (task.type) {
          case 'processArticle':
            result = await this.executeProcessArticle(task.title, task.content);
            break;
          case 'generateHtml':
            result = await this.executeGenerateHtml(task.processedArticle);
            break;
          case 'generateImagePrompt':
            result = await this.executeGenerateImagePrompt(task.processedArticle);
            break;
          case 'generateImage':
            result = await this.executeGenerateImage(task.prompt);
            break;
          case 'extractTitle':
            result = await this.executeExtractTitle(task.processedArticle);
            break;
          case 'createSeoDescription':
            result = await this.executeCreateSeoDescription(task.processedArticle);
            break;
          default:
            throw new Error(`Tipo de tarefa não suportado.`);
        }
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) throw error;
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
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'processArticle', title, content }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

  async generateHtmlContent(processedArticle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'generateHtml', processedArticle }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

  async extractTitle(processedArticle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'extractTitle', processedArticle }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

  async createSeoDescription(processedArticle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'createSeoDescription', processedArticle }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

  async generateImagePrompt(processedArticle: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'generateImagePrompt', processedArticle }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

  async generateImage(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ type: 'generateImage', prompt }, (error, result) => {
        if (error) reject(error);
        else resolve(result as string);
      });
    });
  }

}
