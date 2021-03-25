import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '@src/services/auth';

/**
 * Classe de manipulação há acesso de usuários
 * a API
 * 
 */
@Controller('auth')
export class AuthController {

    /**
     * Autentica o usuário para acessar a api
     * 
     * @param {Request} req
     * @param {Response} res 
     * @return token
     */
    @Post('')
    public async authenticate(req: Request, res: Response): Promise<Response> {
        try {
            const { user, password } = req.body;
            
            if (user == process.env.API_USER) {
                const api_password: any = process.env.API_PASSWORD;

                const comparePassword = await AuthService.comparePasswords(password, api_password);

                Logger.Info('POST authenticate user api', true);
                if (comparePassword) {
                    const token = AuthService.generateToken(String(process.env.SECRET_CODE));
                    
                    return res.status(StatusCodes.OK).json({
                        ok: true,
                        token: token
                    });
                } else {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        code: 401,
                        message: 'Authentication failed!',
                    });
                }
                
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    code: 401,
                    message: 'Authentication failed!',
                });
            }
        } catch (error) {
            Logger.Err(error.message, true)
            return res.json({ msg: error.message });
        }
    }
}
