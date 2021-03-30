import { Request } from "express";
import { user } from '@prisma/client'
import { prisma } from '../prisma';

export abstract class BaseController{

  protected async current_user (req: Request) : Promise<user | null>{
    const userId = req.headers?.userId;

    const current_user = await prisma.user.findFirst({ 
      where: { id: Number(userId) },
      include: { profile: true, user_type: true }
    });


    return current_user;
  }
}