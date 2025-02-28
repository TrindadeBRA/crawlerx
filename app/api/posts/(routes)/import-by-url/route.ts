import { NextRequest, NextResponse } from "next/server";
import { PostsController } from "../../controllers/posts.controller";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL não fornecida" },
        { status: 400 }
      );
    }

    const postsController = new PostsController();
    const result = await postsController.importByUrl(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na rota de importação:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Erro ao processar a importação" 
      },
      { status: 500 }
    );
  }
} 