/**
É boa prática deixar todas as operações de uma rota em um arquivo modular.

Considerando isso, o Express possui o chamado Mini Express, que facilita
a definição de rotas em arquivos separados, de forma modular

*/

import express from 'express';
import { criaProduto, lerProdutoPorId, atualizarProdutoPorId, deletarProdutoPorId, lerProdutos } from "../models.js";

export const rotasProdutos = express.Router();

const raiz = "/produtos";

rotasProdutos.post(raiz, async (req, res, next) => {
    const data = req.body;

    if (!data.nome || !data.preco) {
        const resposta = {
            erro: {
                mensagem: 'O nome e o preço do produto precisam ser inseridos'
            }
        }
        // res.send(JSON.stringify(resposta)); não precisa mais converter
        res.status(400).send(resposta);

        return;
    }

    try {
        const resultado = await criaProduto({
            nome: data.nome,
            preco: data.preco
        });

        const resposta = {
            mensagem: "Registrado com sucesso",
            objeto: resultado
        }
        res.status(201).send(resposta)
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível registrar no banco de dados"
            }
        }
        res.status(500).send(resposta);
        return
    }

});

// Listar todos os produtos
rotasProdutos.get(raiz, async (req, res, next) => {
    try {
        const resposta = await lerProdutos();
        res.status(200).send(resposta);
        return;
    }
    catch (e) {
        const resposta = {
            erro: {
                mensagem: "Não foi possível processar sua busca: " + e
            }
        }
        res.status(500).send(resposta);
        return;
    }
});
/**
 Significa que essa requisição espera receber um valor nessa posição,
 o qual será atribuído automaticamente para o placeholder de nome "id"
 e que poderá ser acessado via req.params.id 
 */
rotasProdutos.get(raiz + "/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        const resposta = await lerProdutoPorId(id);
        if (!resposta) {
            const resposta = {
                erro: {
                    mensagem: "Id não encontrado"
                }
            }
            res.status(404).send(resposta);
            return;
        }
        res.status(200).send(resposta);
        return;
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível processar sua busca pelo id: " + id
            }
        }
        res.status(500).send(resposta);
        return;
    }
});

rotasProdutos.patch(raiz + "/:id", async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;
    const { nome, preco } = data;

    if (!id || (!nome && !preco)) {
        const resposta = {
            erro: {
                mensagem: 'Para atualizar um registro, informe o "id", "nome" e "preco"'
            }
        }
        res.status(400).send(resposta);
        return;
    }

    try {
        const resultado = await atualizarProdutoPorId(id, {
            nome,
            preco
        });

        const resposta = {
            mensagem: "Atualizado com sucesso"
        }
        res.status(200).send(resposta)
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível registrar no banco de dados"
            }
        }
        res.status(500).send(resposta);
        return;
    }
});

rotasProdutos.delete(raiz + "/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const resultado = await deletarProdutoPorId(id);
        // O delete, pelo restful não retorna nada
        res.status(204).send()
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível deletar esse registro do banco de dados"
            }
        }
        res.status(500).send(resposta);
        return;
    }

});