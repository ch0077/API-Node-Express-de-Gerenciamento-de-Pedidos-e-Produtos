import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import { rotasProdutos, rotasPedidos } from './routes/index.js';

app.listen(3000, ()=> {
    console.log("Servidor Ativo");
})

// Os dados que o cliente mandar via API serão convertidos em JSON
app.use(bodyParser.json());

app.use((req,res,next)=>{
    console.log("Qualquer tipo de req executará esse código no nosso servidor");
    next();
})

// Usando rotas modulares
app.use(rotasProdutos);
app.use(rotasPedidos);

app.use((req,res,next)=>{
    res.status(404).send({
        mensagem:"Acessou a rota padrão"
    });
})
