import { Controller, Get, Post, Put, Middleware, Delete, ClassMiddleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '@src/prisma';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from './index';

@Controller('profile')
@ClassMiddleware(authMiddleware)
export class ProfileController extends BaseController {

  @Get('')
  public async index(_: Request, res: Response): Promise<Response> {
    const profiles = await prisma.profile.findMany({include: {address: true, user: true}});

    Logger.Info('GET profile index', true)
    return res.status(StatusCodes.OK).json(profiles);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.current_user(req);
      const { 
        name,
        cpf,
        cnpj,
        phone,
        image,
        plan_id,
       } = req.body;

       const profile = await prisma.profile.create({
         data: {
          name: name,
          cpf: cpf,
          cnpj: cnpj,
          phone: phone,
          image: image,
          plan_id: plan_id,
          user_id: Number(user?.id),
         }
       })
      
      Logger.Info('POST create profile ', true);
      return res.status(StatusCodes.CREATED).json(profile);
    } catch (error) {
      Logger.Err(error.message, true)
      return res.json({msg: error.message });
    }
  }

  @Put(':id')
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      let profile = await prisma.profile.findFirst({ where: { id: Number(id)} })

      if (!profile) {
        return res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'User not found!',
        });
      }

      const profile_data = req.body;

      profile = await prisma.profile.update({ 
        where: { id: profile.id }, 
        data: profile_data, 
        include: {
          address: true, 
          user: true
        }
      })

      Logger.Info('PUT profile/update', true);
      return res.send({ profile });
    } catch (err) {
      Logger.Info(err.message, true);
      return res.send({ code: 422, message: err });
    }
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.body
    const profile = await prisma.profile.findFirst({ where: { id: id }});

    if (!profile) {
      Logger.Warn('DELETE profile/:id profile not found', true);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: 401,
        message: 'Profile not found!',
        description: 'Try verifying id.',
      });
    }

    await prisma.profile.delete({where: { id: profile.id }})

    Logger.Info('DELETE profile/:id', true);
    return res.json({ code: 200, message: 'Profile Deleted !'});
  }

  @Get(':id')
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.body;
    const profile = await prisma.profile.findFirst({ where: { id: id } });

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Profile not found!',
      });
    }

    Logger.Info('GET profile/:id', true);
    return res.send({ profile });
  }
}