const PROTO_PATH = "./restaurante.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).restaurante;

const client = new protoDescriptor.Servicocardapio('127.0.0.1:50051',
                                    grpc.credentials.createInsecure());


client.RegistrarCarro({item: "risole de frango", valor: 3.50}, function(err, response) {
    
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento RegistrarCarro");
        return;
    }

    console.log("Risole de frango registrado com sucesso");

    client.registrarItemNoCardapio({item: "coxinha", valor: 2.50}, function(err, response) {
        
        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento RegistrarCarro");
            return;
        }

        console.log("Coxinha registrado com sucesso");

        client.ListarCardapio({}, function(err, response) {
            const lista = response.ListaDoCardapio;

            console.log(lista);
        });

    });
});

client.ListarCardapio({}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento ListarCardapio");
        return;
    }

    console.log(" >>>>> Cardápio: " + JSON.stringify(response.ListaDoCardapio) );
});

