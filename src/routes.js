import { Router } from "express";
import database from "./database";
import 'dotenv-safe/config';

const jwt = new require('jsonwebtoken');
const routes = new Router();
var aQuery = "";

routes.get("/", (req, res) => {
    /*
 #swagger.description = 'Apresentanção da API.'
*/
    return res.json({ message: "API ENDERECAMENTO SOPASTA V1" });
});

routes.post("/getendereco", verifyJWT, (req, res) => {

    /*
     #swagger.description = 'Busca endereços disponiveis para registros'
   
     #swagger.parameters['codori'] = {
      description: 'Código da origem do produto.',
      type: 'string',
      required: true,
      in: 'body',
      example: 'BOB',
     }
   
   */

    var aCodOri = "";
    var aRetData = "";
    var data;
    var nRetErr = 0;

    aCodOri = req.body.codori;

    try {
        aQuery = "SELECT USU_CodEnd                    \
                    FROM APONTAMENTOS.USU_TLisEnd      \
                    WHERE USU_CodOri = '"+ aCodOri + "'";

        fExecQuery(aQuery).then(response => {
            data = response[0];
            nRetErr = response[1];
            aRetData = "";

            if (nRetErr == 1) {
                return res.json({
                    message: data.toString(),
                    error: nRetErr
                });
            } else {

                aRetData = data;

                if (nRetErr == 0) {
                    if (aRetData == null || aRetData == undefined || !aRetData) {
                        nRetErr = 1;
                        return res.json({
                            message: "Nenhum endereço encontrado !",
                            error: nRetErr
                        });
                    } else {
                        nRetErr = 0;
                        return res.json({
                            message: aRetData,
                            error: nRetErr
                        });
                    }
                }

            };

        });
    } catch (error) {

    }

});

routes.post("/enderecamento", verifyJWT, (req, res) => {

    /*
 #swagger.description = 'Envio de registros de endereco para a tabela USU_TENDPROEST da base Apontamentos da Sopasta.'
 

 #swagger.parameters['codemp'] = {
   description: 'Código da Empresa.',
   type: 'number',
   required: true,
   in: 'body',
   example: 1,
 }

#swagger.parameters['codfil'] = {
  description: 'Código da Filial.',
  type: 'number',
  required: true,
  in: 'body',
  example: 1,
 }

 #swagger.parameters['codori'] = {
  description: 'Código da origem do produto.',
  type: 'string',
  required: true,
  in: 'body',
  example: 'BOB',
 }

 #swagger.parameters['codbar'] = {
  description: 'Código de Barras do produto.',
  type: 'string',
  required: true,
  in: 'body',
  example: 'MN120304020215487XYZ',
 }

 #swagger.parameters['codend'] = {
  description: 'Código do endereço do produto.',
  type: 'string',
  required: true,
  in: 'body',
  example: 'B01',
}
  #swagger.parameters['datent'] = {
  description: 'Data Entrada Endereço.',
  type: 'date',
  required: true,
  in: 'body',
  example: '17/01/2022',
}
  #swagger.parameters['horent'] = {
  description: 'Hora Entrada Endereço - Minutos.',
  type: 'string',
  required: true,
  in: 'body',
  example: '1200',
 }

*/

    var nCodEmp = 0;
    var nCodFil = 0;
    var aCodOri = "";
    var aCodBar = "";
    var aCodEnd = "";
    var aDatEnt = "";
    var aHorEnt = "";
    var aNomUsu = req.nomusu;
    var aRetData = "";
    var data;
    var nRetErr = 0;

    nCodEmp = req.body.codemp;
    nCodFil = req.body.codfil;
    aCodOri = req.body.codori;
    aCodBar = req.body.codbar;
    aCodEnd = req.body.codend;
    aDatEnt = req.body.datent;
    aHorEnt = req.body.horent;

    try {
        aQuery = "INSERT INTO APONTAMENTOS.USU_TEndProEst A          \
                  (A.USU_CodEmp,A.USU_CodFil,A.USU_CodOri,           \
                   A.USU_Data,                                       \
                   A.USU_Seq,                                        \
                   A.USU_CodBar,A.USU_CodEnd,                        \
                   A.USU_Hora,                                       \
                   A.USU_NomUsu,A.USU_EnvErp)                        \
                   VALUES                                            \
                  ("+ nCodEmp + "," + nCodFil + ",'" + aCodOri + "', \
                  TO_DATE('"+ aDatEnt + "', 'DD/MM/YYYY'),              \
                  (SELECT NVL(MAX(B.USU_Seq),0)+1                    \
                     FROM APONTAMENTOS.USU_TEndProEst B              \
                    WHERE B.USU_CodEmp = "+ nCodEmp + "              \
                      AND B.USU_CodFil = "+ nCodFil + "              \
                      AND B.USU_CodOri = '"+ aCodOri + "'            \
                      AND B.USU_CodBar = '"+ aCodBar + "'),          \
                   '"+ aCodBar + "','" + aCodEnd + "',               \
                   "+ aHorEnt + ",                                      \
                   '"+ aNomUsu + "','N')";

        fExecQuery(aQuery).then(response => {
            data = response[0];
            nRetErr = response[1];
            aRetData = "";

            if (nRetErr == 1) {
                return res.json({
                    message: data.toString(),
                    error: nRetErr
                });
            } else {
                nRetErr = 0;
                return res.json({
                    message: "Registro Inserido com sucesso !",
                    error: nRetErr
                });

            };

        });
    } catch (error) {
        console.log(error);
    }

});

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Usuário sem token autenticado!' });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Falhou na validação do TOKEN!' });
        }

        // se tudo estiver ok, salva no request para uso posterior        
        req.nomusu = decoded.aNomUsu;
        next();
    });
}

async function fExecQuery(aQuery) {
    var RetQue;
    var RetErr = 0;
    try {
        RetQue = await database.raw(aQuery);
    } catch (error) {
        RetQue = error;
        RetErr = 1;
    }
    return [RetQue, RetErr];
}

export default routes;