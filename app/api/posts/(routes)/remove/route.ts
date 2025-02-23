import type { NextRequest } from "next/server";
import { PostsController } from "../../controllers/posts.controller";

const postsController = new PostsController();

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  if (!data || !data.id) {
    return new Response(
      JSON.stringify({ error: 'ID do post é obrigatório' }), 
      { status: 400 }
    );
  }

  return postsController.removePost(data.id);
} 