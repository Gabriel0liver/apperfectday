"use strict";

const path = require("path");
const express = require("express");
const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const subjectRouter = require("./routes/subject");
const nconf = require("nconf");
const { existsSync } = require("fs");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const session = require('express-session');
const MongoStore = require('connect-mongo');

(() => {
  let env = process.env.NODE_ENV || "local";
  const envs = ["production", "development", "local"];
  if (envs.indexOf(env) == -1) {
    console.log(
      `${env} no es un entorno disponible. Asignado el entorno "local"`
    );
    env = "local";
  }

  if (env == "local") {
    require("dotenv").config();
  }

  const nconfPath = `nconf/${env}.json`;

  if (!existsSync(nconfPath)) {
    console.error(`No se encontró el fichero nconf/${env}.json`);
    return;
  }
  nconf.file("global", { file: nconfPath });

  //conecta a la base de datos
  mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    dbName: "apperfectday"
  }).then(() => {
    console.log(`Connected to database`);
  }).catch((error) => {
    console.error(error);
  })

  //Renderizar pagina
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.resolve("src/views"));

  //req.body

  app.use(express.urlencoded({ extended: false }));

  //fichero estaticos
  app.use(express.static(path.resolve("public")));

  app.use(express.json())

  //configuracion session
 app.use(
   session({
     secret: '123',
     resave: false,
     saveUninitialized: false,
     store: MongoStore.create({
       mongoUrl: process.env.MONGODB_URI,
       ttl: 14 * 24 * 60 * 60, // Session will expire in 14 days
     }),
   })
 )

  app.use('/', authRoute);
  //app.use("/", indexRouter);
  app.use("/calendar", calendarRouter);
  app.use("/subject", subjectRouter);

  const port =
    env == "production" ? process.env.PORT : nconf.get("server:port");

  app.listen(port, (err) => {
    if (err) {
      console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
      console.log(`Servidor arrancado en el puerto ${port}`);
    }
  });
})();
