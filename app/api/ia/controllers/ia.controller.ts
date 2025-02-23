import { IARepository } from '../repositories/ia.repository';

export class IAController {
  private iaRepository: IARepository;

  constructor() {
    this.iaRepository = new IARepository();
  }

  async processText({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) {
    try {
      console.log("Iniciando processamento:", 
        `
          Título original: ${title}
          Conteúdo original: ${content}
        `
      );

      const articleProcessed = await this.iaRepository.processArticle(title, content);
      console.log("Artigo processado com sucesso:", articleProcessed);

      const htmlContent = await this.iaRepository.generateHtmlContent(articleProcessed);
      console.log("HTML gerado com sucesso:", htmlContent);

      const imagePrompt = await this.iaRepository.generateImagePrompt(articleProcessed);
      console.log("Prompt de imagem gerado com sucesso:", imagePrompt);

      const imageUrl = await this.iaRepository.generateImage(imagePrompt);
      console.log("Imagem gerada com sucesso:", imageUrl);

      return {
        success: true,
        data: {
          articleProcessed,
          htmlContent,
          imagePrompt,
        }
      };
    } catch (error) {
      console.error("Erro no processamento:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento',
      };
    }
  }
} 