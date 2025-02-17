import puppeteer from "puppeteer";
import { stripHtml } from "../utils";

interface ScrapeDeveloperTechOptions {
  searchTerm?: string;
  limit?: number;
}

interface Article {
  title: string;
  content?: string;
  url: string;
}

export async function scrapeDeveloperTech(options?: ScrapeDeveloperTechOptions): Promise<Article[]> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    
    const page = await browser.newPage();
    
    const url = options?.searchTerm 
      ? `https://www.developer-tech.com/?s=${encodeURIComponent(options.searchTerm)}`
      : "https://www.developer-tech.com/";
    
    console.log('Acessando URL:', url);
    
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    const articles = await page.evaluate((limit) => {
      const articles = document.querySelectorAll('.archive-post');
      const articleList: Article[] = [];
      
      articles.forEach((article, index) => {
        if (limit && index >= limit) return;
        
        const titleElement = article.querySelector('h3 a');
        
        if (titleElement) {
          articleList.push({
            title: titleElement.textContent?.trim() || '',
            url: titleElement.getAttribute('href') || ''
          });
        }
      });

      return articleList;
    }, options?.limit);

    const detailedArticles: Article[] = [];

    for (const article of articles) {
      try {
        await page.goto(article.url, {
          waitUntil: "domcontentloaded",
        });

        const articleData = await page.evaluate(() => {
          const titleElement = document.querySelector('h1.entry-title');
          const contentElement = document.querySelector('section.entry-content');
          
          if (!titleElement || !contentElement) {
            return null;
          }

          return {
            title: titleElement.textContent || '',
            content: contentElement.textContent || '',
            url: window.location.href
          };
        });

        if (articleData) {
          const cleanArticle = {
            title: await stripHtml(articleData.title),
            content: await stripHtml(articleData.content),
            url: articleData.url
          };

          console.log("Artigo extraído:", {
            title: cleanArticle.title,
            content: cleanArticle.content.substring(0, 150) + "...",
            url: cleanArticle.url,
          });

          
          detailedArticles.push(cleanArticle);
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
    console.error("Erro ao fazer scraping do DeveloperTech:", error);
    throw error;
  }
} 