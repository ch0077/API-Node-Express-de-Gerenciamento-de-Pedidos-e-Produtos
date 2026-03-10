import express from 'express';
import { criaPedido, lerPedidos, lerPedidoPorId } from '../models.js';

export const rotasPedidos = express.Router();

rotasPedidos.get("/pedidos", async (req, res, next) => {
    try {
        const pedidos = await lerPedidos();
        const resposta = {
            mensagem: "Pedidos listados com sucesso",
            pedidos: pedidos
        }
        res.status(200).send(resposta);
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível listar todos os pedidos"
            }
        }
        res.status(400).send(resposta);
    }
});

rotasPedidos.get("/pedidos/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const pedido = await lerPedidoPorId(id);
        if (!pedido) {
            const resposta = {
                mensagem: "Não foi possível localizar o pedido"
            }
            res.status(400).send(resposta);
        }
        const resposta = {
            mensagem: "Pedido listado com sucesso",
            pedidos: pedido
        }
        res.status(200).send(resposta);
    }
    catch {
        const resposta = {
            erro: {
                mensagem: `Não foi possível listar o pedido de id ${id}`
            }
        }
        res.status(400).send(resposta);
    }
});

rotasPedidos.post("/pedidos", async (req, res, next) => {
    // Aqui não precisamos codar o buffer na mão!
    const data = req.body;

    if (!data.valor_total || !data.quantidade || !data.preco || !data.produtos) {
        const resposta = {
            erro: {
                mensagem: 'É preciso informar o valor total, quantidade, preco e a lista de produtos'
            }
        }
        res.status(400).send(resposta);

        return;
    }

    try {
        const resultado = await criaPedido({
            valor_total: data.valor_total,
            quantidade: data.quantidade,
            preco: data.preco,
            produtos: data.produtos
        });

        const resposta = {
            mensagem: "Pedido registrado com sucesso",
            objeto: resultado
        }
        res.status(201).send(resposta)
    }
    catch {
        const resposta = {
            erro: {
                mensagem: "Não foi possível registrar o pedido no banco de dados"
            }
        }
        res.status(500).send(resposta);
        return
    }

    const resposta = {
        erro: {
            mensagem: "Erro ao processar a requisição"
        }
    }

    res.status(400).send(resposta);
    return

});
