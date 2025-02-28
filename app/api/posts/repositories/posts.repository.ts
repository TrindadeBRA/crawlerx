import { PrismaClient, Post, PostStatus } from '@prisma/client';
import * as cheerio from 'cheerio';

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

  async update(postId: number, data: Partial<Post>): Promise<Post> {
    try {
      if (!postId || !data) {
        throw new Error('ID do post e dados para atualização são obrigatórios');
      }

      return await this.prisma.post.update({
        where: { id: postId },
        data
      });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      throw error;
    }
  }

  async remove(postId: number): Promise<void> {
    await this.prisma.post.delete({
      where: { id: postId }
    });
  }

  async fetchAndExtractContent(url: string): Promise<string> {
    try {
      // Realiza o fetch da URL
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Falha ao acessar a URL: ${response.statusText}`);
      }

      // Obtém o HTML do body
      const html = await response.text();

      // Carrega o HTML no Cheerio
      const $ = cheerio.load(html);

      // Remove elementos desnecessários
      $('script').remove();
      $('style').remove();
      $('noscript').remove();
      $('iframe').remove();
      $('nav').remove();
      $('header').remove();
      $('footer').remove();

      // Extrai o conteúdo principal
      const mainContent = $('article, [role="main"], .main-content, #main-content, .post-content, .article-content, main').first();
      
      const textContent = mainContent.length 
        ? mainContent.text()
        : $('body').text();

      return textContent
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

    } catch (error) {
      console.error('Erro ao extrair conteúdo:', error);
      throw error;
    }
  }
} 