import Crawler, { Article } from "./crawlerx/crawlerx.service";

export class DeveloperTechCrawler extends Crawler {

  public async getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]> {
    await this.init();
    const url = options.searchParam
      ? `https://www.developer-tech.com/?s=${encodeURIComponent(options.searchParam)}`
      : "https://www.developer-tech.com/news/";

    console.log("Acessando a página:", url)
    await this.navigate(url);

    const results = await this.page!.evaluate((options) => {

      let articles;
      if (options.searchParam) {
        articles = document.querySelectorAll('.archive-post');
      } else {
        articles = document.querySelectorAll('.archive-post');
      }
      console.log("Artigos encontrados:", articles)

      const limitedArticles = Array.from(articles).slice(0, options.quantity);

      return limitedArticles.map(article => {

        let titleElement;
        if (options.searchParam) {
          titleElement = article.querySelector('.article-header h3 a');
        } else {
          titleElement = article.querySelector('.article-header h3 a');
        }

        let urlElement;
        if (options.searchParam) {
          urlElement = article.querySelector('.article-header h3 a');
        } else {
          urlElement = article.querySelector('.article-header h3 a');
        }

        let contentElement;
        if (options.searchParam) {
          contentElement = article.querySelector('.post-text');
        } else {
          contentElement = article.querySelector('.post-text');
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
      title: '.entry-title',
      content: '.entry-content'
    };
    return super.scrapeArticle(url, selectors);
  }
}