# Chat App em Tempo Real

Este é um projeto de um aplicativo de chat em tempo real, construído como parte de um exercício de desenvolvimento full-stack. O aplicativo permite que os usuários se registrem, façam login, criem salas de chat, conversem em tempo real com mensagens de texto e emojis, e até mesmo enviem imagens.

## Funcionalidades

-   **Autenticação de Usuários**: Sistema completo de registro e login com senhas seguras (hashing com bcrypt).
-   **Chat em Tempo Real**: Sincronização instantânea de mensagens e eventos do chat usando **WebSockets (Socket.IO)**.
-   **Salas de Chat**: Usuários podem criar e entrar em salas de chat dinâmicas.
-   **Lista de Usuários Online**: Exibe em tempo real quais usuários estão ativos em cada sala.
-   **Recursos Interativos**: Suporte para o envio de emojis e upload de imagens diretamente no chat.

---

## Tecnologias Utilizadas

### Backend
-   **Node.js**: Ambiente de execução.
-   **Express.js**: Framework para a construção da API.
-   **SQLite3**: Banco de dados leve e sem servidor.
-   **Socket.IO**: Biblioteca para comunicação bidirecional e em tempo real.
-   **Multer**: Middleware para o tratamento de upload de arquivos.
-   **bcrypt.js**: Para o hashing seguro de senhas.
-   **CORS**: Para gerenciar permissões de requisições entre o frontend e o backend.

### Frontend
-   **React**: Biblioteca para a construção da interface do usuário.
-   **Styled-components**: Para a estilização dos componentes de forma modular e dinâmica.
-   **React Router DOM**: Para gerenciar a navegação entre as páginas.
-   **Socket.IO-client**: Para a conexão do frontend com o servidor de WebSockets.

---

## Instalação e Uso

Siga os passos abaixo para configurar e rodar o projeto.

### 1. Configuração do Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  **Configuração Inicial do Banco de Dados:**
    -   Se esta for a primeira vez que você está rodando o projeto, crie uma pasta chamada `uploads` dentro de `backend`.
    -   Caso já tenha rodado antes, e precise de um banco de dados limpo, exclua o arquivo `chat.db` antes de continuar.
4.  Inicie o servidor:
    ```bash
    node server.js
    ```
    O servidor será iniciado na porta `3001`.

### 2. Configuração do Frontend

1.  Abra um novo terminal e navegue até a pasta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm start
    ```
    A aplicação será aberta automaticamente no seu navegador, na porta `3000`.

Agora você pode se registrar, fazer login e testar todas as funcionalidades do chat!

---

Espero que este `README.md` seja útil para você. Parabéns por construir um projeto tão completo!