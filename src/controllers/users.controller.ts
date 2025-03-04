import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import type { AppResponse } from '../types/app-response';
import { UsersRepo, UserWithoutPasswd } from '../models/users.repository.js';
import { AuthService } from '../services/auth.services.js';
import { HttpError } from '../types/http-error.js';
import { UserCreateDTO, UserLoginDTO } from '../dto/users.dto.js';
const debug = createDebug('films:controllers:users');

export class UsersController {
    constructor(private repoUsers: UsersRepo) {
        debug('Instanciando');
    }

    private makeResponse(results: UserWithoutPasswd[]) {
        const data: AppResponse<UserWithoutPasswd> = {
            results,
            error: '',
        };
        return data;
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        debug('create');
        try {
            const newData = req.body;
            UserCreateDTO.parse(newData);
            newData.password = await AuthService.hashPassword(newData.password);
            const user = await this.repoUsers.create(newData);
            res.json(this.makeResponse([user]));
        } catch (error) {
            next(error);
        }
    };

    async login(req: Request, res: Response, next: NextFunction) {
        const error = new HttpError(
            'User or password not valid',
            401,
            'Unauthorized',
        );

        try {
            const { email, password: clientPassword } = req.body;

            if (!email || !clientPassword) {
                throw error;
            }

            try {
                UserLoginDTO.parse({ email, password: clientPassword });
            } catch (error) {}

            const user = await this.repoUsers.getByEmail(email);
            if (user === null) {
                throw error;
            }
            // password; // cliente -> sin encriptar
            // user.password; // base de datos -> encriptado

            const { password: hashedPassword, ...userWithoutPasswd } = user;
            const isValid = await AuthService.comparePassword(
                clientPassword,
                hashedPassword,
            );
            if (!isValid) {
                throw error;
            }
            res.json(this.makeResponse([userWithoutPasswd]));
        } catch (error) {
            next(error);
        }
    }
}
