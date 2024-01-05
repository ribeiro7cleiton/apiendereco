const knex = require('knex')({
    client: 'oracledb',
    connection: {
      host : '192.168.1.1',
      port : 1521,
      user : 'USER',
      password : 'PASSWORD',
      database : 'DATABASE'
    }
  });
  
  export default knex;