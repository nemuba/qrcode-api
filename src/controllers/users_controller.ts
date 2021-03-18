import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '@src/prisma';

@Controller('users')
export class UsersController {

  @Get('')
  private async index(req: Request, res: Response): Promise<any> {
    const users = await prisma.users.findMany();
    return res.status(StatusCodes.OK).json(users);
  }
}