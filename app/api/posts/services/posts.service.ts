import { Post, PostStatus } from '@prisma/client';
import { PostsRepository } from '../repositories/posts.repository';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  pageCount: number;
}

interface OriginData {
  domain: string;
  totalPosts: number;
  posts: Post[];
}

export class PostsService {
  private postsRepository: PostsRepository;

  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async savePost(data: any): Promise<Post> {
    // Validação inicial dos dados
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos: payload deve ser um objeto');
    }

    // Validação dos campos obrigatórios
    const requiredFields = ['url', 'domain', 'title', 'content'];
    for (const field of requiredFields) {
      if (!data[field as keyof any]) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Verificar se a URL já existe
    const existingPost = await this.postsRepository.findByUrl(data.url.trim());
    if (existingPost) {
      throw new Error('URL já existe no banco de dados');
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

  async listOrigins(): Promise<OriginData[]> {
    const posts = await this.postsRepository.findAll();
    const originMap = new Map<string, OriginData>();

    posts.forEach(post => {
      const domain = post.domain.replace(/^www\./, '');
      if (!originMap.has(domain)) {
        originMap.set(domain, {
          domain,
          totalPosts: 0,
          posts: []
        });
      }
      const originData = originMap.get(domain)!;
      originData.totalPosts++;
      originData.posts.push(post);
    });

    return Array.from(originMap.values())
      .sort((a, b) => b.totalPosts - a.totalPosts);
  }

  async updatePost(postId: number, postData: Partial<Post>): Promise<Post> {
    return this.postsRepository.update(postId, postData);
  }

  async removePost(postId: number): Promise<void> {
    return this.postsRepository.remove(postId);
  }
} 