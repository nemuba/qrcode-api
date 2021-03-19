import { Controller, Get, Post, ClassMiddleware, Middleware } from '@overnightjs/core';
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
  public async index(req: Request, res: Response): Promise<Response> {
    const users = await prisma.users.findMany();
    return res.status(StatusCodes.OK).json(users);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
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
      
      res.status(201).json(user);
    } catch (error) {
      res.json({msg: error.message });
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const user = await prisma.users.findFirst({ where: { email: req.body.email } });
    if (!user) {
      return res.json({
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }
    if (
      !(await AuthService.comparePasswords(req.body.password, user.password))
    ) {
      return res.json({
        code: 401,
        message: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(String(user.id));

    return res.json({ ...user, ...{ token } });
  }


}