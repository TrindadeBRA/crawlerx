import { NextRequest } from "next/server";
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Validação básica da URL
    if (!url) {
      return Response.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    // Realiza o fetch da URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: `Falha ao acessar a URL: ${response.statusText}` 
      }, { status: response.status });
    }

    // Obtém o HTML do body
    const html = await response.text();

    // Carrega o HTML no Cheerio
    const $ = cheerio.load(html);

    // Remove scripts, estilos e outros elementos desnecessários
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('iframe').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();

    // Extrai o texto do conteúdo principal
    // Tenta encontrar o conteúdo principal usando seletores comuns
    const mainContent = $('article, [role="main"], .main-content, #main-content, .post-content, .article-content, main').first();
    
    // Se encontrou um elemento principal, usa ele, senão usa o body
    const textContent = mainContent.length 
      ? mainContent.text()
      : $('body').text();

    // Limpa o texto (remove espaços extras, quebras de linha múltiplas, etc)
    const cleanText = textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    return Response.json({ 
      success: true,
      content: cleanText,
      message: 'Conteúdo extraído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao processar a URL:', error);
    return Response.json({ 
      error: 'Erro ao processar a URL fornecida' 
    }, { status: 500 });
  }
} 