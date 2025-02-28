import { NextResponse } from "next/server";
import { PostsService } from "../services/posts.service";
import { PostStatus } from "@prisma/client";

export class PostsController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  async listPosts(searchParams: { page?: string, pageSize?: string }) {
    try {
      const page = Number(searchParams.page) || 1;
      const pageSize = Number(searchParams.pageSize) || 10;
      
      const result = await this.postsService.listAllPosts(page, pageSize);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Erro ao listar posts:', error);
      return NextResponse.json(
        { error: 'Erro interno ao buscar posts' },
        { status: 500 }
      );
    }
  }

  async savePost(postData: any) {
    try {
      const savedPost = await this.postsService.savePost(postData);
      return NextResponse.json({ data: savedPost });
    } catch (error) {
      console.error('Erro detalhado ao salvar post:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro interno ao salvar post';

      return NextResponse.json(
        { 
          error: errorMessage,
          details: error instanceof Error ? error.stack : undefined
        }, 
        { 
          status: error instanceof Error && error.message.includes('URL já existe') 
            ? 409 
            : 500 
        }
      );
    }
  }

  async updateStatus(postId: number, status: PostStatus) {
    try {
      const updatedPost = await this.postsService.updateStatus(postId, status);
      return NextResponse.json({ data: updatedPost });
    } catch (error) {
      console.error('Erro ao atualizar status do post:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status do post' },
        { status: 500 }
      );
    }
  }

  async listOrigins() {
    try {
      const origins = await this.postsService.listOrigins();
      return NextResponse.json(origins);
    } catch (error) {
      console.error('Erro ao listar origens:', error);
      return NextResponse.json(
        { error: 'Erro interno ao buscar origens' },
        { status: 500 }
      );
    }
  }

  async updatePost(postId: number, postData: any) {
    try {
      const updatedPost = await this.postsService.updatePost(postId, postData);
      return NextResponse.json({ data: updatedPost });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar post' },
        { status: 500 }
      );
    }
  }
  
  async removePost(postId: number) {
    try {
      await this.postsService.removePost(postId);
      return NextResponse.json({ message: 'Post removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover post:', error); 
      return NextResponse.json(
        { error: 'Erro ao remover post' },
        { status: 500 }
      );
    }
  }

  async importByUrl(request: Request) {
    try {
      const { url } = await request.json();
      
      if (!url) {
        return NextResponse.json(
          { error: 'URL não fornecida' }, 
          { status: 400 }
        );
      }

      const result = await this.postsService.importFromUrl(url);
      return NextResponse.json(result);

    } catch (error) {
      console.error('Erro ao processar a URL:', error);
      return NextResponse.json(
        { error: 'Erro ao processar a URL fornecida' }, 
        { status: 500 }
      );
    }
  }
} 