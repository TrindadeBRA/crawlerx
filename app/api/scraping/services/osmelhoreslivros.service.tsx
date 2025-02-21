import Crawler, { Article } from "./crawlerx/crawlerx.service";

export class OmelhoreslivrosCrawler extends Crawler {

  public async getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]> {
    await this.init();
    const url = options.searchParam
      ? `https://osmelhoreslivros.com.br/?s=${encodeURIComponent(options.searchParam)}`
      : "https://osmelhoreslivros.com.br/blog/";

    console.log("Acessando a página:", url)
    await this.navigate(url);

    const results = await this.page!.evaluate((options) => {

      let articles;
      if (options.searchParam) {
        articles = document.querySelectorAll('article.post');
      } else {
        articles = document.querySelectorAll('.uagb-post__inner-wrap');
      }
      console.log("Artigos encontrados:", articles)

      const limitedArticles = Array.from(articles).slice(0, options.quantity);

      return limitedArticles.map(article => {

        let titleElement;
        if (options.searchParam) {
          titleElement = article.querySelector('h2.entry-title a');
        } else {
          titleElement = article.querySelector('h5.uagb-post__title a');
        }

        let urlElement;
        if (options.searchParam) {
          urlElement = article.querySelector('h2.entry-title a');
        } else {
          urlElement = article.querySelector('h5.uagb-post__title a');
        }

        let contentElement;
        if (options.searchParam) {
          contentElement = article.querySelector('.ast-excerpt-container p');
        } else {
          contentElement = article.querySelector('.uagb-post__excerpt p');
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