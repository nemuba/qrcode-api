import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '@src/prisma';
import AuthService from '@src/services/auth';
import { users } from '@prisma/client'
import { authMiddleware } from '@src/middlewares/auth';
@Controller('users')
export class UsersController {

  @Get('')
  @Middleware(authMiddleware)
  public async index(_: Request, res: Response): Promise<Response> {
    const users = await prisma.users.findMany();

    Logger.Info('GET user', true)
    return res.status(StatusCodes.OK).json(users);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      const hasPassword = await AuthService.hashPassword(password)
      const user = await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: hasPassword
        } as users ,
      });
      Logger.Info('POST create user ', true);
      return res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      Logger.Err(error.message, true)
      return res.json({msg: error.message });
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    const user = await prisma.users.findFirst({ where: { email: email } });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }

    const comparePassword = await AuthService.comparePasswords(req.body.password, user.password)

    if (!comparePassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: 401,
        message: 'Password does not match!',
      });
    }

    const token = AuthService.generateToken(String(user.id));

    return res.json({ ...user, ...{ token } });
  }
}