import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@Controller('hello')
export class HelloController {

  @Get('')
  private index(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({ message: 'Deu certo !!!' });
  }
}