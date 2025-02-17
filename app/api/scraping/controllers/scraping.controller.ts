import { NextRequest, NextResponse } from "next/server";
import { scrapeTecmundo } from "../services/tecmundo.service";
import { PostsService } from "../../posts/services/posts.service";
import { scrapeDeveloperTech } from "../services/developer-tech.service";

export class ScrapingController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  async scrape(request: NextRequest) {
    try {
      const body = await request.json();

      if (!body.domain) {
        return NextResponse.json(
          { message: "O domínio é obrigatório" },
          { status: 400 }
        );
      }

      let data;
      
      // Switch case para diferentes domínios
      switch (body.domain) {
        case "tecmundo.com.br":
          data = await scrapeTecmundo({
            searchTerm: body.searchTerm,
            limit: body.limit
          });
          break;
        case "developer-tech.com":
          data = await scrapeDeveloperTech({
            searchTerm: body.searchTerm,
            limit: body.limit
          });
          break;
        default:
          return NextResponse.json(
            { message: "Domínio não suportado" },
            { status: 400 }
          );
      }

      // Salvar os artigos no banco
      for (const articleData of data) {
        try {
          const postData: any = { //CreatePostData
            url: articleData.url,
            domain: new URL(articleData.url).hostname,
            title: articleData.title,
            content: articleData.content
          };

          const existingPost = await this.postsService.findPostByUrl(postData.url);
          if (!existingPost) {
            await this.postsService.savePost(postData);
          }
        } catch (error) {
          console.error('Erro no processamento do artigo:', error);
        }
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error("Erro durante web scraping:", error);
      return NextResponse.json(
        { message: "Erro ao realizar web scraping" },
        { status: 500 }
      );
    }
  }
} 