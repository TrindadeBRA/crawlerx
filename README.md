# CrawlerX

<p align="center">
  <img src="public/assets/images/crawlerx-logo.png" alt="CrawlerX Logo" width="200">
</p>

## Sobre o Projeto

**CrawlerX** é um software desenvolvido em **Next.js 15** que permite a captura e armazenamento local de posts de sites terceiros. Ele coleta e armazena informações como:

- **Título do post**
- **Conteúdo do post**
- **URL do post original**

Os posts migrados são listados dentro da aplicação e podem ser enviados para um webhook externo (**n8n** ou **Make.com**) para automatização de postagens com base nos dados originais.

## Tecnologias Utilizadas

- **Next.js 15** (Framework React)
- **MySQL** (Banco de Dados)
- **Prisma** (ORM para manipulação do banco de dados)
- **Tailwind CSS** (Estilização do frontend)
- **n8n / Make.com** (Automatização de workflows)

## Funcionalidades

- Extração de posts de sites terceiros
- Armazenamento local dos dados extraídos
- Listagem dos posts migrados
- Envio de dados extraídos para um webhook externo (n8n ou Make.com)

## Instalação e Configuração

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/crawlerx.git
   ```
2. Entre no diretório do projeto:
   ```sh
   cd crawlerx
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure as variáveis de ambiente (**.env**):
   ```env
   DATABASE_URL="mysql://usuario:senha@localhost:3306/crawlerx"
   WEBHOOK_URL="https://seu-webhook.com"
   ```
5. Execute as migrações do banco de dados:
   ```sh
   npx prisma migrate dev
   ```
6. Inicie o projeto:
   ```sh
   npm run dev
   ```

## Uso

1. Acesse o painel via navegador (**http://localhost:3000**)
2. Configure os sites de onde deseja extrair posts
3. Verifique a listagem dos posts migrados
4. Envie os dados para seu webhook externo para automação

## Contribuição

Sinta-se à vontade para contribuir com o projeto! Basta seguir estes passos:

1. Fork o repositório
2. Crie uma branch com sua feature (`git checkout -b minha-feature`)
3. Commit suas modificações (`git commit -m 'Adicionando nova funcionalidade'`)
4. Push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usá-lo e modificá-lo!

---
Desenvolvido com ❤️ por [Lucas Trindade](https://github.com/trindadebra)

