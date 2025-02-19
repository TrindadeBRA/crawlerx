import { Post, PostStatus } from '@prisma/client';
import { PostsRepository } from '../repositories/posts.repository';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  pageCount: number;
}

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

  async listAllPosts(page: number = 1, pageSize: number = 10): Promise<PaginatedResult<Post>> {
    const skip = (page - 1) * pageSize;
    const [posts, total] = await Promise.all([
      this.postsRepository.findAll(skip, pageSize),
      this.postsRepository.count()
    ]);

    return {
      data: posts,
      total,
      pageCount: Math.ceil(total / pageSize)
    };
  }

  async findPostByUrl(url: string): Promise<Post | null> {
    return this.postsRepository.findByUrl(url);
  }

  async updateStatus(postId: number, status: PostStatus): Promise<Post> {
    return this.postsRepository.updateStatus(postId, status);
  }
} 