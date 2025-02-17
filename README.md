    Controllers (Controladores):
    → São responsáveis por receber as requisições HTTP e chamar os Services.
    → Aqui ficam as rotas da API e a lógica de entrada e saída de dados.
    → Exemplo: Se alguém faz um POST /users, o controller pega os dados da requisição e chama um serviço para criar o usuário.

    Services (Serviços):
    → Contêm a lógica de negócios da aplicação.
    → Aqui ficam as regras do que pode ou não ser feito.
    → Exemplo: Se um usuário for criado, o service pode validar se o e-mail já existe antes de mandar para o banco de dados.

    Repositories (Repositórios):
    → Responsáveis por acessar o banco de dados.
    → Aqui ficam as funções de buscar, salvar, atualizar ou deletar dados no banco.
    → Exemplo: Um método createUser(data) que insere um usuário na tabela do banco.

🔹 Resumo prático

    O Controller recebe a requisição.
    O Service processa as regras de negócio.
    O Repository faz a comunicação com o banco de dados.# CrawlerX
