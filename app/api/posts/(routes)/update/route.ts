import type { NextRequest } from "next/server";
import { PostsController } from "../../controllers/posts.controller";

const postsController = new PostsController();

export async function POST(request: NextRequest) {
  const data = await request.json();
  return postsController.updatePost(data.id, data);
} 