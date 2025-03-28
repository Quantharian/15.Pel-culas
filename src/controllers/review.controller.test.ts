import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { ReviewsController } from './reviews.controller';
import { Request, Response } from 'express';
import { ReviewRepo } from '../repo/reviews.repository';
import { Review } from '@prisma/client';
import { ReviewCreateDTO, ReviewUpdateDTO } from '../dto/reviews.dto';

vi.mock('../dto/reviews.dto', () => ({
    ReviewCreateDTO: { parse: vi.fn() },
    ReviewUpdateDTO: { parse: vi.fn() },
}));

const mockReviewRepo = {
    read: vi.fn() as Mock,
    readById: vi.fn() as Mock,
    create: vi.fn() as Mock,
    update: vi.fn(),
    delete: vi.fn() as Mock, // Ensure delete is mocked as a jest.Mock
} as unknown as ReviewRepo;

const mockRequest = (params = {}, body = {}, user = null) => {
    return {
        params,
        body,
        user,
    } as unknown as Request;
};

const mockResponse = () => {
    const res = {
        json: vi.fn(),
    } as unknown as Response;
    return res;
};

const mockNext = vi.fn();

describe('ReviewsController', () => {
    let reviewsController: ReviewsController;

    beforeEach(() => {
        reviewsController = new ReviewsController(mockReviewRepo);
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        test('should return all reviews', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const reviews: Review[] = [
                { id: '1', content: 'Great movie!' } as Review,
            ];
            (mockReviewRepo.read as Mock).mockResolvedValue(reviews);

            await reviewsController.getAll(req, res, mockNext);

            expect(mockReviewRepo.read).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                results: reviews,
                error: '',
            });
        });

        test('should call next with an error if repo fails', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');
            (mockReviewRepo.read as Mock).mockRejectedValue(error);

            await reviewsController.getAll(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        test('should return a review by ID', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            const review: Review = {
                id: '1',
                content: 'Great movie!',
            } as Review;
            (mockReviewRepo.readById as Mock).mockResolvedValue(review);

            await reviewsController.getById(req, res, mockNext);

            expect(mockReviewRepo.readById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [review],
                error: '',
            });
        });

        test('should call next with an error if repo fails', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            const error = new Error('Database error');
            (mockReviewRepo.readById as Mock).mockRejectedValue(error);

            await reviewsController.getById(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('create', () => {
        test('should create a new review', async () => {
            const req = mockRequest(
                {},
                { content: 'Amazing!' },
                { id: 'user1' },
            );
            const res = mockResponse();
            const review: Review = { id: '1', content: 'Amazing!' } as Review;
            (mockReviewRepo.create as Mock).mockResolvedValue(review);

            await reviewsController.create(req, res, mockNext);

            expect(ReviewCreateDTO.parse).toHaveBeenCalledWith(req.body);
            expect(mockReviewRepo.create).toHaveBeenCalledWith({
                content: 'Amazing!',
                userId: 'user1',
            });
            expect(res.json).toHaveBeenCalledWith({
                results: [review],
                error: '',
            });
        });

        test('should call next with an error if validation fails', async () => {
            const req = mockRequest({}, { content: 'Invalid' });
            const res = mockResponse();
            const error = new Error('Validation error');
            (ReviewCreateDTO.parse as Mock).mockImplementation(() => {
                throw error;
            });

            await reviewsController.create(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        test('should update a review', async () => {
            const req = mockRequest(
                { id: '1' },
                { content: 'Updated content' },
            );
            const res = mockResponse();
            const review: Review = {
                id: '1',
                content: 'Updated content',
            } as Review;
            mockReviewRepo.update.mockResolvedValue(review);

            await reviewsController.update(req, res, mockNext);

            expect(ReviewUpdateDTO.parse).toHaveBeenCalledWith(req.body);
            expect(mockReviewRepo.update).toHaveBeenCalledWith('1', {
                content: 'Updated content',
            });
            expect(res.json).toHaveBeenCalledWith({
                results: [review],
                error: '',
            });
        });

        test('should call next with an error if validation fails', async () => {
            const req = mockRequest({ id: '1' }, { content: 'Invalid' });
            const res = mockResponse();
            const error = new Error('Validation error');
            (ReviewUpdateDTO.parse as Mock).mockImplementation(() => {
                throw error;
            });

            await reviewsController.update(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('delete', () => {
        test('should delete a review', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            const review: Review = {
                id: '1',
                content: 'To be deleted',
            } as Review;
            mockReviewRepo.delete.mockResolvedValue(review);

            await reviewsController.delete(req, res, mockNext);

            expect(mockReviewRepo.delete).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [review],
                error: '',
            });
        });

        test('should call next with an error if repo fails', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();
            const error = new Error('Database error');
            mockReviewRepo.delete.mockRejectedValue(error);

            await reviewsController.delete(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
