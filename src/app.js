"use strict";
const path = require("path");
const express = require("express");
const indexRouter = require("./routes/index");
const calendarRouter = require("./routes/calendar");
const config = require("./config");

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

const port = config.port;

app.listen(port, (err) => {
  if (err) {
    console.error("No se pudo inicializar el servidor: " + err.message);
  } else {
    console.log(`Servidor arrancado en el puerto ${port}`);
  }
});
