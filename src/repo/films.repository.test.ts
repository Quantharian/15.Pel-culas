import { PrismaClient } from '@prisma/client';
import { FilmRepo } from './films.repository';
import { vi } from 'vitest';
import { FilmCreateDTO } from '../dto/films.dto';

describe('Given class FilmRepo', () => {
    let filmRepo: FilmRepo;

    beforeAll(() => {
        filmRepo = new FilmRepo();
        filmRepo.prisma = {
            film: {
                findMany: vi.fn().mockResolvedValue([]),
                findUniqueOrThrow: vi.fn().mockResolvedValue({
                    categories: [],
                }),
                create: vi.fn().mockResolvedValue({}),
                update: vi.fn().mockResolvedValue({
                    categories: [],
                }),
                delete: vi.fn().mockResolvedValue({}),
            },
        } as unknown as PrismaClient;
    });
    //Arrange
    describe('When we instantiate it', () => {
        //Act
        test('then it should be defined', () => {
            //Assert
            expect(filmRepo).toBeDefined();
        });
        //Act
        test('then it should be an instance of FilmRepo', () => {
            //Assert
            expect(filmRepo).toBeInstanceOf(FilmRepo);
        });
    });
    describe('When read is called', () => {
        test('then it should return an array of films with 28 elements', async () => {
            const result = await filmRepo.read();
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(0);
            expect(filmRepo.prisma.film.findMany).toHaveBeenCalled();
        });
    });
    describe('When readById is called', () => {
        test('then it should return a film', async () => {
            const result = await filmRepo.readById('1');
            expect(result).toBeInstanceOf(Object);
            expect(filmRepo.prisma.film.findUniqueOrThrow).toHaveBeenCalled();
        });
    });
    describe('When create is called', () => {
        test('then it should return a film', async () => {
            const result = await filmRepo.create({} as FilmCreateDTO);
            expect(result).toStrictEqual({});
            expect(filmRepo.prisma.film.create).toHaveBeenCalled();
        });
    });
    describe('When update is called', () => {
        test('then it should return a film', async () => {
            const result = await filmRepo.update('1', {} as FilmCreateDTO);
            expect(result).toStrictEqual({ categories: [] });
            expect(filmRepo.prisma.film.update).toHaveBeenCalled();
        });
    });
    describe('When delete is called', () => {
        test('then it should return a film', async () => {
            const result = await filmRepo.delete('1');
            expect(result).toStrictEqual({});
            expect(filmRepo.prisma.film.delete).toHaveBeenCalled();
        });
    });
    describe('When toggleCategory is called', () => {
        test('then it should return a film', async () => {
            const result = await filmRepo.toggleCategory('1', '1');
            expect(result).toStrictEqual({ categories: [] });
            expect(filmRepo.prisma.film.update).toHaveBeenCalled();
        });
    });
});
