"use strict";

const { Duration } = require("luxon");

module.exports = {
  /**
   * Devuelve el nombre del mes
   * @param {number} month 1-12
   */
  getMonthName(month) {
    switch (month) {
      case 1:
        return "Enero";
      case 2:
        return "Febrero";
      case 3:
        return "Marzo";
      case 4:
        return "Abril";
      case 5:
        return "Mayo";
      case 6:
        return "Junio";
      case 7:
        return "Julio";
      case 8:
        return "Agosto";
      case 9:
        return "Septiembre";
      case 10:
        return "Octubre";
      case 11:
        return "Noviembre";
      case 12:
        return "Diciembre";
      default:
        throw new Error();
    }
  },
  /**
   * @param {() => any} callback
   * @returns
   */
  microtask(callback) {
    Promise.resolve().then(() => callback);
  },
  getColors() {
    return [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
      "cyan",
      "magenta",
      "pink",
      "teal",
      "navy",
      "gold",
      "aqua",
      "burlywood",
      "crimson",
      "forestgreen",
      "greenyellow",
      "hotpink",
      "indianred",
    ];
  },
};
