import { Request, Response, NextFunction } from 'express';
import AuthService from '@src/services/auth';
import { prisma } from '@src/prisma';

export async function authMiddleware (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): Promise<any> {
  const token = req.headers?.['x-access-token'];
  try {
    const claims = AuthService.decodeToken(token as string);
    req.headers = { userId: claims.sub };
    next();
    // const current_user = await prisma.user.findFirst({
    //   where: { id: Number(claims.sub) },
    //   include: { profile: true, user_type: true }
    // });

    // if(current_user?.user_type?.type === 'Client'){
    //   next();
    // } else {
    //   return res.status?.(422).send({ code: 422, error: 'UNAUTHORIZED' });
    // }
  } catch (err) {
    res.status?.(401).send({ code: 401, error: err.message });
  }
}


