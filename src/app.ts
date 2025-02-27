import express, { Request, Response } from 'express';
import createDebug from 'debug';
import { resolve } from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { debugLogger } from './middleware/debug-logger.js';
import {
    notFoundController,
    notMethodController,
} from './controllers/base.controller.js';

import { errorManager } from './controllers/errors.controller.js';
import { Film } from '@prisma/client';
import { FilmRepo } from './models/films.repository.js';
import { Repository } from './models/repository.type.js';
import { AppResponse } from './types/app-response.js';
import { FilmsController } from './controllers/films.controller.js';

// import { createProductsRouter } from './routers/products.router.js';
// import { HomePage } from './views/pages/home-page.js';

const debug = createDebug('films:app');
debug('Loaded module');

export const createApp = () => {
    debug('Iniciando App...');

    const app = express();
    const __dirname = resolve();
    const publicPath = resolve(__dirname, 'public');

    app.disable('x-powered-by');

    debug('Registrando Middleware...');

    // Middlewares
    app.use(cors());
    if (!process.env.DEBUG) {
        app.use(morgan('dev'));
    }
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(debugLogger('debug-logger'));
    app.use(express.static(publicPath));

    // Routes

    const repoFilms: Repository<Film> = new FilmRepo();
    const filmsController = new FilmsController();

    // const filmsController = new FilmsController(filmModel);
    // app.use('/api/films', createFilmsRouter(filmsController));

    app.get('/api/films', filmsController.c1);
    app.get('/api/films/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const film = await repoFilms.readById(id);
        const data: AppResponse<Film> = { results: [film], error: '' };
        res.json(data);
    });
    app.post('/api/films', 
    });
    app.patch('/api/films/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const newData = req.body;
        const film = await repoFilms.update(id, newData);
        const data: AppResponse<Film> = { results: [film], error: '' };
        res.json(data);
    });
    app.delete('/api/films/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const film = await repoFilms.delete(id);
        const data: AppResponse<Film> = { results: [film], error: '' };
        res.json(data);
    });

    app.get('*', notFoundController);
    app.use('*', notMethodController);

    app.use(errorManager);

    return app;
};
