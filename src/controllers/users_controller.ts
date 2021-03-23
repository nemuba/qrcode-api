import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '@src/prisma';
import AuthService from '@src/services/auth';
import { user as user_type } from '@prisma/client'
import { authMiddleware } from '@src/middlewares/auth';
@Controller('users')
export class UsersController {

  @Get('')
  @Middleware(authMiddleware)
  public async index(_: Request, res: Response): Promise<Response> {
    const users = await prisma.user.findMany();

    Logger.Info('GET users', true)
    return res.status(StatusCodes.OK).json(users);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const hasPassword = await AuthService.hashPassword(password)
      const user = await prisma.user.create({
        data: {
          email: email,
          password_digest: hasPassword
        } as user_type,
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
    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user) {
      Logger.Warn('GET users/authenticate user not found', true);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }

    const comparePassword = await AuthService.comparePasswords(req.body.password, user.password_digest)

    if (!comparePassword) {
      Logger.Warn('GET users/authenticate user password does not match', true);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: 401,
        message: 'Password does not match!',
      });
    }

    const token = AuthService.generateToken(String(user.id));

    Logger.Info('GET users/authenticate', true);
    return res.json({ ...user, ...{ token } });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const userId = req.headers?.userId;
    const user = await prisma.user.findFirst({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'User not found!',
      });
    }

    Logger.Info('GET users/me', true);
    return res.send({ user });
  }
}