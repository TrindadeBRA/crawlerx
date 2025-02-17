import puppeteer from "puppeteer";

interface ScrapeTecmundoOptions {
  searchTerm?: string;
  limit?: number;
}

interface Article {
  title: string;
  content: string;
  url: string;
}

export async function scrapeTecmundo(options?: ScrapeTecmundoOptions): Promise<Article[]> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    
    const page = await browser.newPage();
    
    const url = options?.searchTerm 
      ? `https://www.tecmundo.com.br/busca?q=${encodeURIComponent(options.searchTerm)}`
      : "https://www.tecmundo.com.br/";
    
    console.log('Acessando URL:', url);
    
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    const articles = await page.evaluate((limit) => {
      const articles = document.querySelectorAll('.tec--list__item article.tec--card');
      
      const limitedArticles = limit ? Array.from(articles).slice(0, limit) : Array.from(articles);
      
      return limitedArticles.map(article => {
        const titleElement = article.querySelector('.tec--card__title__link');
        return {
          title: titleElement?.textContent?.trim() || '',
          url: titleElement?.getAttribute('href') || ''
        };
      });
    }, options?.limit);



    const detailedArticles: Article[] = [];

    for (const article of articles) {
      try {
        await page.goto(article.url, {
          waitUntil: "domcontentloaded",
        });

        const articleData = await page.evaluate(() => {
          const titleElement = document.querySelector('.tec--article__header__title');
          const contentElement = document.querySelector('.tec--article__body');
          
          // Função auxiliar para limpar tags HTML
          const cleanHtml = (html: string) => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || '';
          };
          
          const title = titleElement?.textContent?.trim();
          const content = contentElement?.innerHTML;
          
          if (!title || !content) {
            console.error('Dados do artigo incompletos:', { title, content });
            return null;
          }
          
          return {
            title: cleanHtml(title),
            content: cleanHtml(content),
            url: window.location.href
          };
        });

        if (articleData) {

          console.log("Artigo extraído:", {
            title: articleData.title,
            url: articleData.url,
            contentPreview: articleData.content.substring(0, 150) + "..."
          });

          detailedArticles.push(articleData);
        } else {
          console.error(`Não foi possível extrair dados do artigo: ${article.url}`);
        }
      } catch (error) {
        console.error(`Erro ao extrair artigo ${article.url}:`, error);
      }
    }

    await browser.close();

    return detailedArticles;
  } catch (error) {
    console.error("Erro ao fazer scraping do TecMundo:", error);
    throw error;
  }
} 