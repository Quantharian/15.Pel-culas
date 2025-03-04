import { Prisma } from '@prisma/client';
import createDebug from 'debug';
const debug = createDebug('films:dto:users');
debug('Loaded module');

import { z } from 'zod';

export const UserCreateDTO = z.object({
    email: z.string().email().nonempty(),
    handleName: z.string().min(3),
    password: z.string().min(6).nonempty(),
    firstName: z.string().min(3).nonempty(),
    lastName: z.string().min(3).nonempty(),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

export const UserLoginDTO = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
}) satisfies z.Schema<Pick<Prisma.UserCreateInput, 'email' | 'password'>>;

//extract the inferred type
export type UserCreateDTO = z.infer<typeof UserCreateDTO>;
export type UserLoginDTO = z.infer<typeof UserLoginDTO>;
