import { PostsController } from "../../controllers/posts.controller";

const postsController = new PostsController();

export async function POST(request: Request) {
  return postsController.importByUrl(request);
} 