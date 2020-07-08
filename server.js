const PROTO_PATH = "./restautante.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');


const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });


var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).car;


const listaDoCardapio = [];
const itensDoPedido = [];


function listarCardapio(call, callback) {
    
    callback(null, {
        cardapio: listaCardapio
    });
}


function consultarItemDoCardapio(call, callback) {
    
    const pos = call.request.posicao;

    
    callback(null, listaCardapio[pos]);
}


function registrarItemNoCardapio(call, callback) {
    
    const item = {
        item: call.request.item,
        modelo: call.request.valor
    };


    
    listaDoCardapio.push(item);

    
    callback(null, {})
}

function removerItemDoCardapio(call, callback) {
    const item = call.request.item;

    const existeNoCardapio = listaDoCardapio.findIndex(itemDoCardapio => itemDoCardapio.item === item);

    if (!existeNoCardapio) {
        callback(null, "Nao existe este item no cardapio");
    } else {
        listaDoCardapio.splice(existeNoCardapio, 1);
        callback(null)
    }
}

function adicionarItemAoPedido(call, callback) {
    const item = {
        item: call.request.item,
    }

    const verificarNoCardapio = listaDoCardapio.find(pedido => pedido.item === item);

    if (!verificarNoCardapio) {
        callback(null, "Nao existe este item no cardapio")
    } else {
        itensDoPedido.push(verificarNoCardapio);

        callback(null, {})
    }

    
}

function solicitarPedido(call, callback) {
    const total = listaDoCardapio.sum("valor");

    itensDoPedido = [];

    callback(null, total);
}


const server = new grpc.Server();


server.addService(protoDescriptor.ServicoCarro.service,
    {
        ListarCardapio: listarCardapio,
        ConsultarCardapio: consultarItemDoCardapio,
        RegistrarCardapio: registrarItemNoCardapio,
        RemoverDoCardapio: removerItemDoCardapio,
        AdicionarPedido: adicionarItemAoPedido,
        SolicitarPedido: solicitarPedido,
    });


server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());


server.start();