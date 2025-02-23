import { NextRequest, NextResponse } from "next/server";
import { PostsService } from "../../posts/services/posts.service";
import { DeveloperTechCrawler } from "../services/developer-tech.service";
import { OlharDigitalCrawler } from "../services/olhardigital.service";
import { TecmundoCrawler } from "../services/tecmundo.service";
import { OmelhoreslivrosCrawler } from "../services/osmelhoreslivros.service";
import { ResenhasALaCarteCrawler } from "../services/resenhasalacarte.service";
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
          const tecmundoCrawler = new TecmundoCrawler();
          data = await tecmundoCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
        case "developer-tech.com":
          const developerTechCrawler = new DeveloperTechCrawler();
          data = await developerTechCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
        case "olhardigital.com.br":
          const olharDigitalCrawler = new OlharDigitalCrawler();
          data = await olharDigitalCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
        case "osmelhoreslivros.com.br":
          const omelhoreslivrosCrawler = new OmelhoreslivrosCrawler();
          data = await omelhoreslivrosCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
        case "resenhasalacarte.com.br":
          const resenhasalacarteCrawler = new ResenhasALaCarteCrawler();
          data = await resenhasalacarteCrawler.getSearchResults({
            searchParam: body.searchTerm,
            quantity: body.limit
          });
          return NextResponse.json(data);
        default:
          return NextResponse.json(
            { message: "Domínio não suportado" },
            { status: 400 }
          );
      }

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

      // Verificar se o artigo já existe
      const existingPost = await this.postsService.findPostByUrl(body.url);
      if (existingPost) {
        return NextResponse.json(
          { message: "Este artigo já foi importado anteriormente" },
          { status: 400 }
        );
      }

      let articleData;
      switch (body.domain) {
        case "tecmundo.com.br":
          const tecmundoCrawler = new TecmundoCrawler();
          articleData = await tecmundoCrawler.scrapeArticle(body.url);
          break;
        case "developer-tech.com":
          const developerTechCrawler = new DeveloperTechCrawler();
          articleData = await developerTechCrawler.scrapeArticle(body.url);
          break;
        case "olhardigital.com.br":
          const olharDigitalCrawler = new OlharDigitalCrawler();
          articleData = await olharDigitalCrawler.scrapeArticle(body.url);
          break;
        case "osmelhoreslivros.com.br":
          const omelhoreslivrosCrawler = new OmelhoreslivrosCrawler();
          articleData = await omelhoreslivrosCrawler.scrapeArticle(body.url);
          break;
        case "resenhasalacarte.com.br":
          const resenhasalacarteCrawler = new ResenhasALaCarteCrawler();
          articleData = await resenhasalacarteCrawler.scrapeArticle(body.url);
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

    } catch (error: any) {

      console.error("Erro ao importar artigo:", {
        message: error.message,
        stack: error.stack
      });

      return NextResponse.json(
        { message: "Erro ao importar artigo" },
        { status: 500 }
      );
    }
  }
} 