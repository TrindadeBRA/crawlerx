export async function stripHtml(html: string): Promise<string> {
    // Remove todas as tags HTML
    const withoutTags = html.replace(/<[^>]*>/g, ' ');
    
    // Remove espaços extras, quebras de linha e tabs
    const cleanText = withoutTags
      .replace(/\s+/g, ' ')        // substitui múltiplos espaços por um único espaço
      .replace(/[\n\r\t]+/g, ' ')  // remove quebras de linha e tabs
      .trim();                     // remove espaços no início e fim
      
    // Decodifica entidades HTML (&nbsp;, &amp;, etc)
    const decoded = cleanText
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
      
    return decoded;
};