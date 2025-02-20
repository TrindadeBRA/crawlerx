import * as puppeteer from "puppeteer";

export interface Article {
  url: string;
  title: string;
  content: string;
}

abstract class Crawler {
  protected browser: puppeteer.Browser | null = null;
  protected page: puppeteer.Page | null = null;

  protected async init() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  protected async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  protected async navigate(url: string) {
    if (!this.page) throw new Error('Página não inicializada. Chame init() primeiro.');
    await this.page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  }

  public abstract getSearchResults(options: { searchParam?: string; quantity: number }): Promise<{ url: string; title: string; content: string }[]>;

  protected async scrapeArticle(url: string, selectors: { title: string; content: string }): Promise<Article | null> {
    await this.init();
    try {
      await this.navigate(url);
      const article = await this.page!.evaluate(({ title, content }) => {
        const titleElement = document.querySelector(title);
        const contentElement = document.querySelector(content);

        const cleanHtml = (html: string) => {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          return temp.textContent || temp.innerText || '';
        };

        if (titleElement && contentElement) {
          return {
            title: cleanHtml(titleElement.textContent || ''),
            content: cleanHtml(contentElement.innerHTML),
            url: window.location.href
          };
        } else {
          return null;
        }
      }, selectors);

      return article;
    } finally {
      await this.close();
    }
  }
}

export default Crawler;