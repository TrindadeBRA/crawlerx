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

    console.log("Conteudo original", 
      `
        Título original: ${title}
        Conteúdo original: ${content}
      `
    );
    console.log("\n\n\n");

    const articleProcessed = await this.iaRepository.processArticle(title, content);
    console.log("Resposta do IA - Processado", articleProcessed);

    console.log("\n\n\n");

    const htmlContent = await this.iaRepository.generateHtmlContent(articleProcessed);
    console.log("Resposta do IA - HTML", htmlContent);

    return {
      articleProcessed,
      htmlContent,
    };
  }
} 