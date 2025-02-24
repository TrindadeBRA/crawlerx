import { Post, PostStatus } from '@prisma/client';
import { WordPressRepository } from '../repositories/wordpress.repository';
import { PostsController } from '../../posts/controllers/posts.controller';

interface PublishPostResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class WordPressController {
  private wordpressRepository: WordPressRepository;
  private postsController: PostsController;

  constructor() {
    this.wordpressRepository = new WordPressRepository();
    this.postsController = new PostsController();
  }

  async publishPost({ post }: { post: Post }): Promise<PublishPostResult> {
    try {
      if (!post.id) {
        throw new Error('ID do post é obrigatório');
      }

      if (!post.processed_seo_content) {
        throw new Error('Descrição SEO é obrigatória');
      }

      // 1. Criar post no WordPress
      const wpPost = await this.wordpressRepository.createPost({
        title: post.processed_title || post.title,
        content: post.processed_content || post.content,
        excerpt: post.processed_seo_content // Garantindo que o excerpt existe
      });

      // 2. Upload da imagem (somente se houver imagem)
      let uploadedImage = null;
      if (post.processed_image_url) {
        uploadedImage = await this.wordpressRepository.uploadImage({
          post_id: wpPost.wp_post_id,
          image_base64: post.processed_image_url,
          title: post.processed_title || post.title
        });
      }

      // 3. Atualizar post local
      const updateData = {
        status: PostStatus.POSTED,
        wp_post_id: wpPost.wp_post_id,
        wp_slug: wpPost.wp_slug,
        ...(uploadedImage && {
          wp_image_id: uploadedImage.wp_image_id,
          wp_image_url: uploadedImage.wp_image_url
        })
      };

      await this.postsController.updatePost(post.id, updateData);

      return {
        success: true,
      };

    } catch (error) {
      console.error("Erro na publicação:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na publicação'
      };
    }
  }
} 