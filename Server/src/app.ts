import express from "express";
import { Application } from "express";

export class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middlewares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`app has started at port ${this.port}`);
    });
  }
  private routes(controllers: any) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }
  private middlewares(middlewares: any) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
}
