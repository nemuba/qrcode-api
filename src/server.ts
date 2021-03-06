import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Application } from 'express';
import bodyParser from 'body-parser';
import * as http from 'http';
import { HelloController } from '@src/controllers/hello_controller';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000){
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setControllers();
  }

  private setupExpress() : void {
    this.app.use(bodyParser.json());
  }

  private setControllers() : void {
    const helloController = new HelloController();

    this.addControllers([
      helloController,
    ])
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      Logger.Imp('Server listening on port: ' + this.port);
    });
  }
}