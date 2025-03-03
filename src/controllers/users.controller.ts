import { Request, Response, NextFunction } from 'express';
import { AppResponse } from '../types/app-response';
import createDebug from 'debug';
import { AuthService } from '../services/auth.services.js';
import { UserWithoutPasswd, UserRepo } from '../models/users.repository.js';

const debug = createDebug('films:controller:films');

export class UsersController {
    constructor(private repoFilms: UserRepo) {
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
        const newData = req.body;
        newData.password = await AuthService.hashPassword;
        try {
            const film = await this.repoFilms.create(newData);

            res.json(this.makeResponse([film]));
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await this.repoFilms.getByEmail(email);
            // Add your login logic here
        } catch (error) {
            next(error);
        }
    };
}
