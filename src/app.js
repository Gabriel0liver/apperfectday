"use strict";

const path = require("path");
const express = require("express");
const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const nconf = require("nconf");
const { existsSync } = require("fs");

(() => {
  require("dotenv").config();

  let env = process.env.NODE_ENV || "local";

  const envs = ["production", "development", "local"];
  if (envs.indexOf(env) == -1) {
    console.log(
      `${env} no es un entorno disponible. Asignado el entorno "local"`
    );
    env = "local";
  }

  const nconfPath = `nconf/${env}.json`;

  if (!existsSync(nconfPath)) {
    console.error(`No se encontró el fichero nconf/${env}.json`);
    return;
  }
  nconf.file("global", { file: nconfPath });

  //Renderizar pagina
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.resolve("src/views"));

  //req.body

  app.use(express.urlencoded({ extended: false }));

  //fichero estaticos
  app.use(express.static(path.resolve("public")));

  app.use("/", indexRouter);
  app.use("/calendar", calendarRouter);

  const port = process.env.PORT;

  app.listen(port, (err) => {
    if (err) {
      console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
      console.log(`Servidor arrancado en el puerto ${port}`);
    }
  });
})();
