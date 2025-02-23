import Crawler, { Article } from "./crawlerx/crawlerx.service";

export class ResenhasALaCarteCrawler extends Crawler {

  public async getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]> {
    await this.init();
    const url = options.searchParam
      ? `https://resenhasalacarte.com.br/?s=${encodeURIComponent(options.searchParam)}`
      : "https://resenhasalacarte.com.br/resenhas-a-z/";

    console.log("Acessando a página:", url)
    await this.navigate(url);

    const results = await this.page!.evaluate((options) => {
      let articles;
      if (options.searchParam) {
        articles = document.querySelectorAll('.post-resumo');
      } else {
        articles = document.querySelectorAll('.post-texto a[href^="https://resenhasalacarte.com.br/resenhas/"]');
      }
      console.log("Artigos encontrados:", articles)

      const limitedArticles = Array.from(articles).slice(0, options.quantity);

      return limitedArticles.map(article => {
        let titleElement, urlElement, contentElement;
        
        if (options.searchParam) {
          titleElement = article.querySelector('.post-titulo h1 a');
          urlElement = article.querySelector('.post-titulo h1 a');
          contentElement = article.querySelector('.post-texto');
        } else {
          titleElement = article;
          urlElement = article;
          contentElement = article.parentElement;
        }

        return {
          title: titleElement?.textContent?.trim() || '',
          url: urlElement?.getAttribute('href') || '',
          content: contentElement?.textContent?.trim() || 'Não possui descrição para o artigo nos cards.'
        };
      });
    }, options);

    await this.close();

    console.log(results);
    return results;
  }

  public async scrapeArticle(url: string): Promise<Article | null> {
    const selectors = {
      title: '.post-titulo h1 a',
      content: '.post-texto'
    };
    return super.scrapeArticle(url, selectors);
  }
}