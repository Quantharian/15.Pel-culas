import createDebug from 'debug';
// import type { Repository } from './repository.type.js';
import { PrismaClient, User } from '@prisma/client';

const debug = createDebug('films:repository:');

export type UserWithoutPasswd = Omit<User, 'password'>;

export class UserRepo {
    prisma: PrismaClient;
    constructor() {
        debug('Instanciando');
        this.prisma = new PrismaClient();
    }

    async getByEmail(email: string): Promise<UserWithoutPasswd | null> {
        debug('Getting user by email');
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async create(data: Omit<User, 'id'>): Promise<UserWithoutPasswd> {
        const user = await this.prisma.user.create({
            data,
        });

        return user;
    }
}
