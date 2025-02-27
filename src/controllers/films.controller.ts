import { NextFunction, Request, Response } from 'express';
import { AppResponse } from '../types/app-response';
import { Repository } from './models/repository.type.ts';
import { Film } from '@prisma/client';
import { FilmRepo } from '../models/films.repository';

export class FilmsController {
    constructor(private repoFilms:Repository<Film>) {}
    c1 = async (req: Request, res: Response) => {
        const films = await this.repoFilms.read();
        const data: AppResponse<Film> = { results: films, error: '' };
        res.json(data);
    };
    c2 = async (req: Request, res: Response) => {
        const { id } = req.params;
        const film = await repoFilms.readById(id);
        const data: AppResponse<Film> = { results: [film], error: '' };
        res.json(data);
    }; 
    c3 = async (req: Request, res: Response, next: NextFunction) => {
        const newData = req.body;
        try {
            const film = await this.repoFilms.create(newData);
            const data: AppResponse<Film> = { results: [film], error: '' };
            res.json(data);
        } catch (error) {
            next(error);
        }
    };
