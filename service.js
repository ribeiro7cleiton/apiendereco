var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'SOPASTA_ENDERECO',
  description: 'Api para enderecamento Sopasta',
  script: 'C:\\Apis\\endereco\\dist\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.logOnAs.domain = 'SOPASTA';
svc.logOnAs.account = 'USUARIO ADMINISTRADOR';
svc.logOnAs.password = 'SENHA ADMINISTRADOR';
svc.install();
