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
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
    this.page = await this.browser.newPage();
    
    // Configurações adicionais da página
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setDefaultNavigationTimeout(60000); // Aumenta o timeout para 60 segundos
  }

  protected async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  protected async navigate(url: string) {
    if (!this.page) throw new Error('Página não inicializada. Chame init() primeiro.');

    console.log("Navegando para:", url)
    try {
      await this.page.goto(url, { 
        waitUntil: ["domcontentloaded", "networkidle0"],
        timeout: 60000 // Aumenta o timeout para 60 segundos
      });
    } catch (error) {
      console.error(`Erro ao navegar para ${url}:`, error);
      throw error;
    }
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
          return temp.textContent?.trim()
            .replace(/\s+/g, ' ')           // substitui múltiplos espaços por um único espaço
            .replace(/\n+/g, '\n')          // substitui múltiplas quebras de linha por uma única
            .replace(/\t+/g, '')            // remove tabulações
            .replace(/^\s+|\s+$/gm, '')     // remove espaços no início e fim de cada linha
            || '';
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

      console.log("Artigo importado:", article)

      return article;
    } finally {
      await this.close();
    }
  }
}

export default Crawler;