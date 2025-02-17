import { Post, PostStatus } from '@prisma/client';
import { PostsRepository } from '../repositories/posts.repository';

export class PostsService {
  private postsRepository: PostsRepository;

  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async savePost(data: any): Promise<Post> { //CreatePostData Type
    // Validação inicial dos dados
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos: payload deve ser um objeto');
    }

    // Validação dos campos obrigatórios
    const requiredFields = ['url', 'domain', 'title', 'content'];
    for (const field of requiredFields) {
      if (!data[field as keyof any]) {  //CreatePostData Type
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Sanitização e preparação dos dados
    const sanitizedData = {
      url: data.url.trim(),
      domain: data.domain.trim(),
      title: data.title.trim(),
      content: data.content,
      status: PostStatus.IMPORTED,
      isActive: true
    };

    return this.postsRepository.create(sanitizedData);
  }

  async listAllPosts(): Promise<Post[]> {
    return this.postsRepository.findAll();
  }

  async findPostByUrl(url: string): Promise<Post | null> {
    return this.postsRepository.findByUrl(url);
  }

  async updateStatus(postId: number, status: PostStatus): Promise<Post> {
    return this.postsRepository.updateStatus(postId, status);
  }
} 