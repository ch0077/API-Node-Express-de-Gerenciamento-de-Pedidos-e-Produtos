import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./banco.db"
});

sequelize.authenticate();

const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

const Pedido = sequelize.define('pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor_total: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const ProdutoPedido = sequelize.define('produto_pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
})

// Um Produto pode pertencer a vários Pedidos
Produto.belongsToMany(Pedido, {through: ProdutoPedido});

// Um Pedido pode possuir vários Produtos
Pedido.belongsToMany(Produto, {through: ProdutoPedido});

/** 
* Invés de criarmos um id_produto, vamos usar a tabela
intermediária ProdutoPedido.

* Cada registro dessa tabela irá conter o id de ambos +
os atributos que definimos

 **/

const criaProduto = async (produto) => {
    try {
        const resultado = await Produto.create(produto);
        console.log(`Produto ${produto.nome} criado com sucesso`);
        return resultado;
    }
    catch (erro) {
        console.log(`Erro ao criar o produto ${produto.nome}: ${erro}`);
        throw erro;
    }
    
}

const lerProdutos = async () => {
    try {
        const resultado = await Produto.findAll();
        console.log(`Produtos consultados com sucesso: ${JSON.stringify(resultado)}`);
        return resultado;
    }
    catch (erro) {
        console.log(`Erro ao listar os produtos: ${erro}`)
        throw erro;
    }
    
}

const lerProdutoPorId = async (id) => {
    try {
        const resultado = await Produto.findByPk(id);

        if (!resultado) {
            console.log('Não há produto com esse Id');
            return null;
        }

        console.log(`Produto de id = ${id} é: ${JSON.stringify(resultado)}`);
        return resultado;
    }
    catch (erro) {
        console.log(`Produto de id = ${id} é: ${JSON.stringify(resultado)}`);
        throw erro;
    }
}

const atualizarProdutoPorId = async (id, dados) => {
    try {
        const resultado = await Produto.update(dados, {
            // Condicional
            where: {
                id: id
            }
        })
        console.log(`Produto de id ${id} atualizado com sucesso: ${JSON.stringify(resultado)}`)
        return resultado;
    }
    catch (erro) {
        console.log(`Não foi possível atualizar o produto de id ${id}: ${JSON.stringify(resultado)}`)
        throw erro;
    }
}

const deletarProdutoPorId = async (id) => {
    try {
        const resultado = await Produto.destroy({
            where: {
                id: id
            }
        })
        console.log(`Produto de id ${id} deletado com sucesso: ${JSON.stringify(resultado)}`)
    }
    catch (erro) {
        console.log(`Não foi possível deletar o produto de id ${id}: ${JSON.stringify(resultado)}`)
    }
}

const criaPedido = async (dadosPedido) => {
    try {
        // Criar 1 único pedido
        const pedido = await Pedido.create({
            valor_total: dadosPedido.valor_total,
            estado: "ENCAMINHADO"
        });

        // Passar em cada um dos produtos informados no parâmetro
        for (const prod of dadosPedido.produtos) {
            // Localizar eles no banco de dados pela PK
            const produto = await Produto.findByPk(prod.id);

            // Criar um novo PedidoProduto, pegando os ids dos objetos pedido e produto
            await pedido.addProduto(produto, {through: {
                // Define as propriedades exclusivas da união PedidoProduto
                quantidade: dadosPedido.quantidade,
                preco: dadosPedido.preco
            }})

            /**
            Criamos o ProdutoPedido através do objeto pedido e passando o produto
            como parâmetro, dessa forma é certeza que os IDs estão corretos 
            */
        }
        console.log("Pedido criado com sucesso")

        return pedido;
    }
    catch (erro) {
        console.log("Não foi possível criar o pedido");
        throw (erro);
    }
}

const lerPedidos = async () => {
    try {
        const pedidos = await ProdutoPedido.findAll();
        console.log(`Os pedidos encontrados são: ${pedidos}`);
        return pedidos;
    }
    catch(erro) {
        console.log("Não foi possível localizar os pedidos");
        throw erro;
    }
}

const lerPedidoPorId = async (id) => {
    try {
        const pedido = await ProdutoPedido.findByPk(id);
        console.log(`O pedido encontrado foi: ${pedido}`);
        return pedido;
    }
    catch (erro) {
        console.log("Não foi possível buscar o pedido pelo id");
        throw erro;
    }
}

export {sequelize, Produto, criaProduto, lerProdutos, lerProdutoPorId, atualizarProdutoPorId, deletarProdutoPorId, criaPedido, lerPedidos, lerPedidoPorId}