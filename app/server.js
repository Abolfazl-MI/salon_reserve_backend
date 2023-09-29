// require express
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const http = require("http");
const createHttpError = require("http-errors");
const { allRoutes } = require("./routes/router");
class Application {
  #app = express();
  #PORT;
  #DB_URL;
  constructor(PORT, DB_URL) {
    this.#PORT = PORT;
    this.#DB_URL = DB_URL;
    this.configureApplication();
    this.connectDB();
    this.createServer();
    this.createRoute();
    this.errorHandler();
  }

  configureApplication() {
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true, limit: "50mb",parameterLimit:100000 }));
    this.#app.use(express.static("public"));
  }
  createServer() {
    http.createServer(this.#app).listen(this.#PORT);
    if(process.env.app_state=='dev'){
      console.log(`run on > http://localhost:${this.#PORT}`);
    }else{
      console.log(`run on > https://pelato.iran.liara.run`);
    }
  }
  connectDB() {
    //   handle the connection to mongoose if some thing happens like crash should db close on exit
    mongoose.connect(this.#DB_URL);
    // listen on error
    mongoose.connection.on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
    // listen on connection and print connected message
    mongoose.connection.on("connected", (data) => {
      console.log("connected to DB");
    });
    // on SIGINT signal exist
    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.log("Mongoose disconnected on app termination");
        process.exit(0);
      });
    });
  }
  // error handling
  errorHandler() {
    this.#app.use((req, res, next) => {
      next(createHttpError.NotFound("Not Found"));
    });
    this.#app.use((err, req, res, next) => {
      // server err
      console.log(err)
      const serverError = createHttpError.InternalServerError();
      const statusCode = err.status || serverError.statusCode;
      let message
      if(process.env.app_state=='dev'){
        message = err.message || serverError.message
      }else{
        console.log(err)
        message = serverError.message
      }
      res.status(statusCode).json({
        status: statusCode,
        message,
      });
    });
  }
  createRoute() {
    this.#app.use("/api/v1/", allRoutes);
  }
}

module.exports = {
  Application,
};
