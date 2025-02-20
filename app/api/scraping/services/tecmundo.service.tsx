import Crawler, { Article } from "./crawlerx/crawlerx.service";

export class TecmundoCrawler extends Crawler {

  public async getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]> {
    await this.init();
    const url = options.searchParam
      ? `https://www.tecmundo.com.br/busca?q=${encodeURIComponent(options.searchParam)}`
      : "https://www.tecmundo.com.br/novidades/"; //Ultimas noticias

    console.log("Acessando a página:", url)
    await this.navigate(url);

    const results = await this.page!.evaluate((options) => {

      let articles;
      if (options.searchParam) {
        articles = document.querySelectorAll('.tec--list__item');
      } else {
        articles = document.querySelectorAll('.tec--list__item');
      }
      console.log("Artigos encontrados:", articles)

      const limitedArticles = Array.from(articles).slice(0, options.quantity);

      return limitedArticles.map(article => {

        let titleElement;
        if (options.searchParam) {
          titleElement = article.querySelector('a.tec--card__title__link');
        } else {
          titleElement = article.querySelector('a.tec--card__title__link');
        }

        let urlElement;
        if (options.searchParam) {
          urlElement = article.querySelector('a.tec--card__title__link');
        } else {
          urlElement = article.querySelector('a.tec--card__title__link');
        }

        let contentElement;
        if (options.searchParam) {
          contentElement = article.querySelector('.tec--card__body__description');
        } else {
          contentElement = article.querySelector('.tec--card__body__description');
        }

        console.log("titleElement", titleElement)
        console.log("urlElement", urlElement)

        return {
          title: titleElement?.textContent?.trim() || '',
          url: urlElement?.getAttribute('href') || '',
          content: contentElement?.textContent?.trim() || 'Nâo possui descrição para o artigo nos cards.'
        };
      });
    }, options);

    await this.close();

    console.log(results);
    return results;
  }

  public async scrapeArticle(url: string): Promise<Article | null> {
    const selectors = {
      title: 'h1#js-article-title',
      content: '.tec--article__body'
    };
    return super.scrapeArticle(url, selectors);
  }
}