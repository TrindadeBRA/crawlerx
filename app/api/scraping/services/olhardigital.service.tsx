import Crawler, { Article } from "./crawlerx/crawlerx.service";

class OlharDigitalCrawler extends Crawler {

  public async getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]> {
    await this.init();
    const url = options.searchParam
      ? `https://olhardigital.com.br/?s=${encodeURIComponent(options.searchParam)}`
      : "https://olhardigital.com.br/editorias/noticias/"; //Ultimas noticias

    console.log("Acessando a página:", url)
    await this.navigate(url);

    const results = await this.page!.evaluate((options) => {

      let articles;
      if (options.searchParam) {
        articles = document.querySelectorAll('.gsc-webResult.gsc-result');
      } else {
        articles = document.querySelectorAll('a.p-item');
      }
      console.log("Artigos encontrados:", articles)

      const limitedArticles = Array.from(articles).slice(0, options.quantity);

      return limitedArticles.map(article => {

        let titleElement;
        if (options.searchParam) {
          titleElement = article.querySelector('a.gs-title');
        } else {
          titleElement = article.querySelector('h2');
        }

        let urlElement;
        if (options.searchParam) {
          urlElement = article.querySelector('a.gs-title');
        } else {
          urlElement = article;
        }

        let contentElement;
        if (options.searchParam) {
          contentElement = article.querySelector('.gs-bidi-start-align.gs-snippet');
        } else {
          contentElement = article.querySelector('.p-description');
        }

        console.log("titleElement", titleElement)
        console.log("urlElement", urlElement)

        return {
          title: titleElement?.textContent?.trim() || '',
          url: urlElement?.getAttribute('href') || '',
          content: contentElement?.textContent?.trim() || ''
        };
      });
    }, options);

    await this.close();

    console.log(results);
    return results;
  }

  public async scrapeArticle(url: string): Promise<Article | null> {
    const selectors = {
      title: '.sng-hdr h1',
      content: 'article.sng-cnt'
    };
    return super.scrapeArticle(url, selectors);
  }
}

export default OlharDigitalCrawler;