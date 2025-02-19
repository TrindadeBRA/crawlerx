import { PostsController } from "../../controllers/posts.controller";

const postsController = new PostsController();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return postsController.listPosts({ 
    page: searchParams.get('page') ?? '1',
    pageSize: searchParams.get('pageSize') ?? '10'
  });
}
