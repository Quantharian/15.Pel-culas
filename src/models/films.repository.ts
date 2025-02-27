import createDebug from 'debug';
import type { Repository } from './repository.type.js';
import { PrismaClient } from '@prisma/client';
import { Film } from '@prisma/client';

const debug = createDebug('demo:repository:films');

export class FilmRepo implements Repository<Film> {
    prisma: PrismaClient;
    constructor() {
        debug('Instanciando repo for films');
        this.prisma = new PrismaClient();
    }

    private filmRowToFilm(row: unknown): Film {
        return row as Film;
    }

    async read(): Promise<Film[]> {
        const films = await this.prisma.film.findMany();
        debug(films);
        return films;

        // return await this.prisma.film.findMany();
    }

    async readById(id: string): Promise<Film> {
        const film = await this.prisma.film.findUniqueOrThrow({
            where: { id },
        });

        return film;
    }

    async create(data: Omit<Film, 'id'>): Promise<Film> {
        const film = await this.prisma.film.create({
            data,
        });

        return film;
    }

    async update(id: string, data: Partial<Omit<Film, 'id'>>): Promise<Film> {
        debug('Updating film with id:', id);

        const film = await this.prisma.film.update({
            where: { id },
            data,
        });

        return film;
    }

    async delete(id: string): Promise<Film> {
        const film = await this.prisma.film.delete({
            where: {
                id,
            },
        });

        return film;
    }
}
