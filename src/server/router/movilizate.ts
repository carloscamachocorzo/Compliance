import { Router, Request, Response } from "express";
import * as log from "../../log/logger";
import bodyParser = require("body-parser");
import ListaControl from "../../business-logic/lista-control";

const logger = log.logger(__filename);

const movilizate = Router();

/* movilizate.get("/m/getListaDeControl", (req: Request, res: Response) => {
  logger.debug("-----------MOVILIZATE-----------");
  logger.debug(JSON.stringify(req.body));
  logger.debug("----------------------");

  res.status(200).json({
    ok: true,
    testService: "OK",
    body: JSON.stringify(req.body) || "No hay nada en el body"
  });
}); */


var urlencodedParser = bodyParser.urlencoded({ extended: false });
movilizate.post("/m/getListaDeControl", urlencodedParser, (req: Request, res: Response) => {
  let body = req.body;
  let body_NumeroSolicitud = body.NumeroSolicitud| 12345;
  logger.info(JSON.stringify(body));
  logger.info(JSON.stringify(body_NumeroSolicitud));
  let listaControl = ListaControl.instance;
  listaControl
    .getListaControl(body, body_NumeroSolicitud)
    .then((resp: any) => {
      logger.info("WS: getListaControl:then1=> " + JSON.stringify(resp.ok));
      if (resp.ok) {
        // no hacemos nada, por ahora, todo debio salir perfecto
        //simplemente mandamos la misma respuesta, que es el resultado de la consulta
        return resp;
      } else {
        //NO pudo consultar en compliance, entonces vamos a VIGIA
        return {
          ok: false,
          errorMessage: "No se pudo consultar en compliance, ahora vamos para VIGIA, este mensaje es temporal"
        };
      }
    })
    .then((resp: any) => {
      logger.info("WS: getListaControl:then2=> " + JSON.stringify(resp.ok));
      if (resp.ok) {
        //proceso exitosamente la informacion, independientemente si es de compliance o VIGIA
        res.status(200).json({
          ok: true,
          message: "El proceso terminó exitosamente.",
          data:body,
          response: resp.response
        });
      } else {
        //hubo un problema en el proceso
        res.status(500).json({
          ok: false,
          errorMessage: "500 Internal Server Error.",
          data: body
        });
      }
    })
    .catch(error => {
      logger.error(error.errorMessage);
      res.status(500).json({
        ok: false,
        errorMessage: error,
        data: body
      });
    });
  /* res.status(200).json({
    ok: true,
    body
  }); */
});

export default movilizate;
