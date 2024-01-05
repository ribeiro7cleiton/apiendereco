const swaggerAutogen = new require('swagger-autogen')();

const outputFile = './dist/swagger/swagger_output.json';
const endpointsFiles = ['./src/routes.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "ENDERECO",
        description: "API responsável por enviar os registros de códigos de barras endereçados"
    },
    host: "svapps:3335",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        sopasta_auth: {
            type: "oauth2",
            authorizationUrl: "http://svapps:3333/login",
            flow: "implicit"
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc);