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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

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

    // const tokensUsed = response.usage?.total_tokens || 0;
    // const promptTokens = response.usage?.prompt_tokens || 0;
    // const completionTokens = response.usage?.completion_tokens || 0;
    // console.log(`Tokens do prompt: ${promptTokens}`);
    // console.log(`Tokens da resposta: ${completionTokens}`);
    // console.log(`Total de tokens: ${tokensUsed}`);

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

    // const tokensUsed = response.usage?.total_tokens || 0;
    // console.log(`Tokens usados para extrair o título: ${tokensUsed}`);

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

    // const tokensUsed = response.usage?.total_tokens || 0;
    // console.log(`Tokens usados para criar a descrição SEO: ${tokensUsed}`);

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

    // const tokensUsed = response.usage?.total_tokens || 0;
    // console.log(`Tokens usados para criar o HTML: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeGenerateImagePrompt(processedArticle: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Instruções: ${process.env.PROJECT_NAME === "TTW" ? agents.artDirector.createTitleTTW : agents.artDirector.createTitle}

            Artigo: ${processedArticle}
          `
        },
      ],
      model: 'gpt-4o-mini',
    });

    // const tokensUsed = response.usage?.total_tokens || 0;
    // console.log(`Tokens usados para criar o prompt de imagem: ${tokensUsed}`);

    return response.choices[0].message.content || '';
  }

  private async executeGenerateImagePromptDallE3(processedArticle: string): Promise<string> {
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
    const apiKey = process.env.STABILITY_AI_API_KEY;
    const apiHost = 'https://api.stability.ai';
    
    try {
      const formData = new FormData();
      
      formData.append('prompt', prompt);
      formData.append('model', 'sd3.5-medium');
      formData.append('output_format', 'png');
      formData.append('aspect_ratio', '1:1');
      formData.append('cfg_scale', '7');
      formData.append('style_preset', 'anime');
      formData.append('negative_prompt', agents.artDirector.createNegativePrompt);

      const response = await fetch(
        `${apiHost}/v2beta/stable-image/generate/sd3`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json; type=image/png',
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Resposta da API com erro:', error);
        throw new Error(`Erro na geração da imagem: ${JSON.stringify(error)}`);
      }

      const data = await response.json();

      if (!data.image) {
        console.error('Resposta sem imagem:', data);
        throw new Error('Nenhuma imagem foi gerada');
      }

      return data.image;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
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
