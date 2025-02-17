import { NextResponse } from "next/server";
import { PostsService } from "../services/posts.service";
import { PostStatus } from "@prisma/client";

export class PostsController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  async listPosts() {
    try {
      const posts = await this.postsService.listAllPosts();
      return NextResponse.json({ data: posts });
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
      console.error('Erro ao salvar post:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar post' },
        { status: 500 }
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

  
} 