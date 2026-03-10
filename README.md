# API de Gerenciamento de Pedidos e Produtos

Este projeto é uma API RESTful desenvolvida em Node.js com Express e Sequelize (SQLite) para gerenciar produtos e pedidos.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução Javascript.
- **Express**: Framework para construção da API.
- **Sequelize**: ORM para interação com o banco de dados.
- **SQLite**: Banco de dados relacional leve (armazenado no arquivo `banco.db`).
- **Body-Parser**: Middleware para processamento de JSON.

## 📦 Instalação e Execução

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Execute o servidor:**
    *   Modo de produção:
        ```bash
        npm start
        ```
    *   Modo de desenvolvimento (com auto-reload via nodemon):
        ```bash
        npm run start:dev
        ```

3.  O servidor estará rodando em: `http://localhost:3000`

---

## 📡 Endpoints da API

### 🏷️ Produtos

#### 1. Listar todos os produtos
Retorna uma lista de todos os produtos cadastrados.

*   **Método:** `GET`
*   **URL:** `/produtos`
*   **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": 1,
        "nome": "Smartphone",
        "preco": 1500.00,
        "createdAt": "...",
        "updatedAt": "..."
      },
      ...
    ]
    ```

#### 2. Buscar produto por ID
Retorna os detalhes de um produto específico.

*   **Método:** `GET`
*   **URL:** `/produtos/:id`
*   **Exemplo:** `/produtos/1`
*   **Resposta de Sucesso (200 OK):** Objeto do produto.
*   **Resposta de Erro (404 Not Found):** ID não encontrado.

#### 3. Criar novo produto
Cadastra um novo produto no banco de dados.

*   **Método:** `POST`
*   **URL:** `/produtos`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "nome": "Notebook",
      "preco": 3500.00
    }
    ```
*   **Resposta de Sucesso (201 Created):** Objeto do produto criado.

#### 4. Atualizar produto
Atualiza os dados de um produto existente.

*   **Método:** `PATCH`
*   **URL:** `/produtos/:id`
*   **Corpo da Requisição (JSON):**
    *   É possível enviar apenas um ou ambos os campos.
    ```json
    {
      "nome": "Notebook Gamer",
      "preco": 4000.00
    }
    ```
*   **Resposta de Sucesso (200 OK):**
    ```json
    {
      "mensagem": "Atualizado com sucesso"
    }
    ```

#### 5. Deletar produto
Remove um produto do banco de dados.

*   **Método:** `DELETE`
*   **URL:** `/produtos/:id`
*   **Resposta de Sucesso (204 No Content):** Sem conteúdo.

---

### 🛒 Pedidos

#### 1. Listar todos os pedidos
Lista todos os registros da tabela de junção de pedidos e produtos.

*   **Método:** `GET`
*   **URL:** `/pedidos`
*   **Resposta de Sucesso (200 OK):** Lista de itens de pedidos.

#### 2. Buscar pedido por ID
Busca um registro específico da tabela de pedidos.

*   **Método:** `GET`
*   **URL:** `/pedidos/:id`
*   **Resposta de Sucesso (200 OK):** Detalhes do pedido.

#### 3. Criar novo pedido
Registra um novo pedido contendo uma lista de produtos existentes.

*   **Método:** `POST`
*   **URL:** `/pedidos`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "valor_total": 5000.00,
      "quantidade": 2,
      "preco": 2500.00,
      "produtos": [
        { "id": 1 },
        { "id": 2 }
      ]
    }
    ```
    *   **Notas:**
        *   `valor_total`: Valor total do pedido.
        *   `quantidade`: Quantidade associada a cada produto neste pedido.
        *   `preco`: Preço unitário registrado para os itens neste pedido.
        *   `produtos`: Lista de objetos contendo o `id` dos produtos que fazem parte do pedido.

*   **Resposta de Sucesso (201 Created):** Objeto do pedido criado.
