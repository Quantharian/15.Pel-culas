import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CategoriesController } from './categories.controller';
import { Request, Response, NextFunction } from 'express';
import { Repository } from '../repo/repository.type';
import { Category } from '@prisma/client';

describe('CategoriesController', () => {
    let mockRepo: Repository<Category>;
    let controller: CategoriesController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRepo = {
            read: vi.fn(),
            create: vi.fn(),
        } as unknown as Repository<Category>;

        controller = new CategoriesController(mockRepo);

        mockRequest = {};
        mockResponse = {
            json: vi.fn(),
        };
        mockNext = vi.fn();
    });

    describe('getAll', () => {
        it('should return all categories', async () => {
            const categories: Category[] = [
                { id: '1', name: 'Action' },
                { id: '2', name: 'Comedy' },
            ];
            (mockRepo.read as Mock).mockResolvedValue(categories);

            await controller.getAll(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockRepo.read).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                results: categories,
                error: '',
            });
        });

        it('should call next with an error if repo.read fails', async () => {
            const error = new Error('Database error');
            (mockRepo.read as Mock).mockRejectedValue(error);

            await controller.getAll(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockRepo.read).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('create', () => {
        it('should create a new category and return it', async () => {
            const newCategory: Omit<Category, 'id'> = { name: 'Drama' };
            const createdCategory: Category = { id: '3', name: 'Drama' };
            (mockRepo.create as Mock).mockResolvedValue(createdCategory);

            mockRequest.body = newCategory;

            await controller.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockRepo.create).toHaveBeenCalledWith(newCategory);
            expect(mockResponse.json).toHaveBeenCalledWith({
                results: [createdCategory],
                error: '',
            });
        });

        it('should call next with an error if repo.create fails', async () => {
            const error = new Error('Database error');
            (mockRepo.create as Mock).mockRejectedValue(error);

            mockRequest.body = { name: 'Drama' };

            await controller.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockRepo.create).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
