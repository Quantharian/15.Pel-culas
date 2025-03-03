import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
// import { FilmRepo } from '../models/films.repository.js';
import createDebug from 'debug';

const debug = createDebug('films:router:films');

export const createFilmsRouter = (usersController: UsersController) => {
    debug('Ejecutando createUsersRouter');
    const usersRouter = Router();

    // usersRouter.get('/', usersController.getAll);
    // usersRouter.get('/:id', usersController.getbyID);
    usersRouter.post('/', usersController.create);
    // usersRouter.patch('/:id', usersController.update);
    // usersRouter.delete('/:id', usersController.delete);

    return usersRouter;
};
