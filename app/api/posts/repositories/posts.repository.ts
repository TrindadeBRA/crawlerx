import { PrismaClient, Post, PostStatus } from '@prisma/client';

export class PostsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: any): Promise<Post> {
    try {
      return await this.prisma.post.create({
        data
      });
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number): Promise<Post[]> {
    try {
      return await this.prisma.post.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  }

  async findByUrl(url: string): Promise<Post | null> {
    try {
      return await this.prisma.post.findFirst({
        where: { url }
      });
    } catch (error) {
      console.error('Erro ao buscar post por URL:', error);
      throw error;
    }
  }

  async updateStatus(postId: number, status: PostStatus): Promise<Post> {
    return this.prisma.post.update({
      where: { id: postId },
      data: { status }
    });
  }

  async count() {
    return this.prisma.post.count();
  }
} 