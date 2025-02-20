import { PostsController } from "../../controllers/posts.controller";

const postsController = new PostsController();

export async function GET() {
  return postsController.listOrigins();
}
