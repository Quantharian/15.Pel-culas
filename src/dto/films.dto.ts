import { Prisma } from '@prisma/client';
import createDebug from 'debug';
const debug = createDebug('films:dto:films');
debug('Loaded module');

import { z } from 'zod';

export const FilmCreateDTO = z.object({
    title: z.string().min(3).nonempty(),
    description: z.string(),
    releaseYear: z.number().int().positive(),
    rating: z.number().min(1).max(10),
    director: z.string().nonempty(),
    duration: z.number().int().positive().min(1),
    poster: z.string().url(),
    // categories: z.array(z.string()).optional(),
}) satisfies z.Schema<Prisma.FilmCreateInput>;
