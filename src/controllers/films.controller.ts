import { Request, Response, NextFunction } from 'express';
import { Film } from '@prisma/client';
import { Repository } from '../models/repository.type.js';
import { AppResponse } from '../types/app-response';
import createDebug from 'debug';

const debug = createDebug('films:controller:films');

export class FilmsController {
    constructor(private repoFilms: Repository<Film>) {
        debug('Instanciando');
    }

    private makeResponse(results: Film[]) {
        const data: AppResponse<Film> = {
            results,
            error: '',
            a,
        };
        return data;
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const films = await this.repoFilms.read();
            // const data: AppResponse<Film> = {
            //     results: films,
            //     error: '',
            // };
            res.json(this.makeResponse(films));
        } catch (error) {
            next(error);
        }
    };
    getbyID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const film = await this.repoFilms.readById(id);
            // const data: AppResponse<Film> = {
            //     results: [film],
            //     error: '',
            // };
            res.json(this.makeResponse([film]));
        } catch (error) {
            next(error);
        }
    };
    create = async (req: Request, res: Response, next: NextFunction) => {
        const newData = req.body;
        try {
            const film = await this.repoFilms.create(newData);
            // const data: AppResponse<Film> = {
            //     results: [film],
            //     error: '',
            // };
            res.json(this.makeResponse([film]));
        } catch (error) {
            next(error);
        }
    };
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const newData = req.body;

            const film = await this.repoFilms.update(id, newData);
            // const data: AppResponse<Film> = {
            //     results: [film],
            //     error: '',
            // };
            res.json(this.makeResponse([film]));
        } catch (error) {
            next(error);
        }
    };
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const film = await this.repoFilms.delete(id);
            // const data: AppResponse<Film> = {
            //     results: [film],
            //     error: '',
            // };
            res.json(this.makeResponse([film]));
        } catch (error) {
            next(error);
        }
    };
}
