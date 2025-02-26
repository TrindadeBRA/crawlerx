# CrawlerX

<p align="center">
  <img src="public/assets/images/crawlerx-logo.png" alt="CrawlerX Logo" width="200">
</p>

## Sobre o Projeto

**CrawlerX** é um software desenvolvido em **Next.js 15** que permite a captura e armazenamento local de artigos de sites terceiros. Ele utiliza inteligência artificial para gerar conteúdos semelhantes a partir dos artigos extraídos e também gera imagens representativas para cada post. As informações coletadas incluem:

- **Título do post**
- **Conteúdo do post**
- **URL do post original**

<div align="center">
  <img src="public/assets/screenshots/Captura de tela - CrawlerX.png" alt="CrawlerX Screenshot" width="800">
</div>

## Tecnologias Utilizadas

- **Next.js 15** (Framework React)
- **MySQL** (Banco de Dados)
- **Prisma** (ORM para manipulação do banco de dados)
- **Tailwind CSS** (Estilização do frontend)
- **Puppeteer** (Automação de navegação em páginas web)
- **APIs de IA** (Stability AI, OpenAI e DeepSeek)

## Funcionalidades

- Coleta de informações de fontes externas
- Processamento automatizado dos dados coletados
- Listagem dos artigos gerados
- Postagem automática no WordPress
- Reescrita de artigos
- Geração de imagens a partir do conteúdo
- Listagem das fontes mais acessadas

## Instalação e Configuração

1. Clone o repositório:
   ```sh
   git clone https://github.com/TrindadeBRA/CrawlerX
   ```
2. Entre no diretório do projeto:
   ```sh
   cd CrawlerX
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Instale o plugin CrawlerX WP:
   ```sh
   git clone https://github.com/TrindadeBRA/crawlerx-wp
   ```
5. Configure as variáveis de ambiente (**.env**):
   ```env
      # Credenciais do Banco de Dados Local
      DB_USER=root
      DB_PASSWORD=root
      DB_HOST=localhost
      DB_PORT=3307
      DB_NAME=rdl_crawler

      # URL de conexão montada com as variáveis
      DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

      # API KEY OPENAI
      OPENAI_API_KEY=sk-proj-XXXXXX

      # API KEY STABILITY AI
      STABILITY_AI_API_KEY=sk-XXXXX

      # API KEY CrawlerX WP
      CRAWLERX_WP_API_KEY=XXXXXXXXXXXXXXX
      CRAWLERX_WP_API_URL=https://example.com/wp-json/crawlerx-api/v1/

      # Credenciais de Acesso (Usado para login no painel)
      AUTH_SECRET="Yesw8APdK0tQjownYSn+lZY6tJoA8NwCwllRRSZsQK0="
      AUTH_USERNAME="admin@admin.com"
      AUTH_PASSWORD="senha123"

      # Trust Host
      AUTH_TRUST_HOST=http://localhost:3000
   ```
6. Execute as migrações do banco de dados:
   ```sh
   npx prisma migrate dev
   ```
7. Inicie o projeto:
   ```sh
   npm run dev
   ```

## Uso

1. Acesse o painel via navegador. (**http://localhost:3000**)
2. Configure os sites de onde deseja extrair posts.
3. Verifique a listagem dos posts migrados.
4. Reescreva os dados dos posts usando IA (OpenAI ou DeepSeek).
5. Crie uma imagem representativa para cada post. (Stability AI)
6. Envie os dados para seu WordPress utilizando o plugin disponível em [CrawlerX WP](https://github.com/TrindadeBRA/crawlerx-wp)

## Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usá-lo e modificá-lo!

---
Desenvolvido com ❤️ por [Lucas Trindade](https://github.com/trindadebra)

