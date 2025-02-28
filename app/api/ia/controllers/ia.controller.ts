import { PostStatus } from '@prisma/client';
import { PostsController } from '../../posts/controllers/posts.controller';
import { IARepository } from '../repositories/ia.repository';

export class IAController {
  private iaRepository: IARepository;
  private postsController: PostsController;

  constructor() {
    this.iaRepository = new IARepository();
    this.postsController = new PostsController();
  }

  async processText({
    title,
    content,
    id,
  }: {
    title: string;
    content: string;
    id: number;
  }) {
    try {

      const articleProcessed = await this.iaRepository.processArticle(title, content);
      const extractedTitle = await this.iaRepository.extractTitle(articleProcessed);
      const seoDescription = await this.iaRepository.createSeoDescription(articleProcessed);
      const htmlContent = await this.iaRepository.generateHtmlContent(articleProcessed);

      // Salva os dados processados
      await this.postsController.updatePost(id, {
        processed_full_post: articleProcessed,
        processed_title: extractedTitle,
        processed_content: htmlContent,
        processed_seo_content: seoDescription,
        status: PostStatus.PROCESSED_TEXT,
      });

      return {
        success: true,
      };

    } catch (error) {
      console.error("Erro no processamento:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento de texto',
      };
    }
  }

  async processImage({
    articleProcessed,
    id,
  }: {
    articleProcessed: string;
    id: number;
  }) {
    try {
      
      const imagePrompt = await this.iaRepository.generateImagePrompt(articleProcessed);
      const imageUrl = await this.iaRepository.generateImage(imagePrompt);

      await this.postsController.updatePost(id, {
        processed_image_prompt: imagePrompt,
        processed_image_url: imageUrl,
        status: PostStatus.PROCESSED_IMAGE,
      });

      return {
        success: true,
      };
      
    } catch (error) {
      console.error("Erro no processamento:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no processamento de imagem',
      };
    }
  }

  async customPromptMessage({
    content,
    prompt,
  }: {
    content: string;
    prompt: string;
  }) {
    try {
      const customPrompt = await this.iaRepository.generateCustomPrompt(content, prompt);

      return {
        success: true,
        customPrompt,
      };
    } catch (error) {
      console.error("Erro no processamento:", error);
      return {
        success: false,
      };
    }
  }
} 