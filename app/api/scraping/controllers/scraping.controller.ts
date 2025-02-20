import { NextRequest, NextResponse } from "next/server";
import { scrapeTecmundo } from "../services/tecmundo.service";
import { PostsService } from "../../posts/services/posts.service";
import { scrapeDeveloperTech } from "../services/developer-tech.service";
import OlharDigitalCrawler from "../services/olhardigital.service";

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
        case "olhardigital.com.br":
          const olharDigitalCrawler = new OlharDigitalCrawler();
          data = await olharDigitalCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
          break;
        default:
          return NextResponse.json(
            { message: "Domínio não suportado" },
            { status: 400 }
          );
      }

      // Salvar os artigos no banco
      // for (const articleData of data) {
      //   try {
      //     const postData: any = { //CreatePostData
      //       url: articleData.url,
      //       domain: new URL(articleData.url).hostname,
      //       title: articleData.title,
      //       content: articleData.content
      //     };

      //     const existingPost = await this.postsService.findPostByUrl(postData.url);
      //     if (!existingPost) {
      //       await this.postsService.savePost(postData);
      //     }
      //   } catch (error) {
      //     console.error('Erro no processamento do artigo:', error);
      //   }
      // }

      return NextResponse.json(data);
    } catch (error) {
      console.error("Erro durante web scraping:", error);
      return NextResponse.json(
        { message: "Erro ao realizar web scraping" },
        { status: 500 }
      );
    }
  }

  async importArticle(request: NextRequest) {
    try {
      const body = await request.json();

      if (!body.url || !body.domain) {
        return NextResponse.json(
          { message: "URL e domínio são obrigatórios" },
          { status: 400 }
        );
      }

      let articleData;
      switch (body.domain) {
        case "tecmundo.com.br":
          // Implementar
          break;
        case "developer-tech.com":
          // Implementar
          break;
        case "olhardigital.com.br":
          const olharDigitalCrawler = new OlharDigitalCrawler();
          articleData = await olharDigitalCrawler.scrapeArticle(body.url);
          break;
        default:
          return NextResponse.json(
            { message: "Domínio não suportado" },
            { status: 400 }
          );
      }

      if (!articleData) {
        return NextResponse.json(
          { message: "Não foi possível extrair os dados do artigo" },
          { status: 400 }
        );
      }

      // Salvar o artigo no banco
      const postData = {
        url: articleData.url,
        domain: body.domain,
        title: articleData.title,
        content: articleData.content,
        status: "IMPORTED",
        isActive: true
      };

      const savedPost = await this.postsService.savePost(postData);
      return NextResponse.json(savedPost);

    } catch (error) {
      console.error("Erro ao importar artigo:", error);
      return NextResponse.json(
        { message: "Erro ao importar artigo" },
        { status: 500 }
      );
    }
  }
} 