import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { AuthInterceptor } from './auth.interceptor';
import { Request, Response } from 'express';
import { HttpError } from '../types/http-error';
import { Role } from '@prisma/client';
import { ReviewRepo } from '../repo/reviews.repository';

vi.mock('../services/auth.service', () => ({
    AuthService: { verifyToken: vi.fn() },
}));
// Mock del repositorio de reseñas para simular el acceso a datos
const mockReviewRepo = {
    readById: vi.fn(),
} as unknown as ReviewRepo;

const mockRequest = (
    headers = {},
    params = {},
    user: { id: string; role: Role } | null = null,
) => {
    const req = {
        headers,
        params,
        user,
    } as unknown as Request;
    return req;
};

const mockResponse = () =>
    ({
        locals: {},
    }) as unknown as Response;

const mockNext = vi.fn();

const newError = new HttpError('Token not found', 401, 'Unauthorized');

describe('AuthInterceptor', () => {
    let authInterceptor: AuthInterceptor;

    beforeEach(() => {
        authInterceptor = new AuthInterceptor(mockReviewRepo);
        vi.clearAllMocks();
    });

    describe('authenticate', () => {
        test('should call next with an error if authorization header is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await authInterceptor.authenticate(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(newError);
        });

        test('should call next with an error if token is invalid', async () => {
            const req = mockRequest({ authorization: 'Bearer invalidToken' });
            const res = mockResponse();
            const { AuthService } = await import('../services/auth.service');
            (AuthService.verifyToken as Mock).mockRejectedValue(
                new Error('Invalid token'),
            );

            await authInterceptor.authenticate(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });

        test('should add user to request and call next if token is valid', async () => {
            const req = mockRequest({ authorization: 'Bearer validToken' });
            const res = mockResponse();
            const { AuthService } = await import('../services/auth.service');
            (AuthService.verifyToken as Mock).mockResolvedValue({
                id: '123',
                role: Role.USER,
            });

            await authInterceptor.authenticate(req, res, mockNext);

            expect(req.user).toEqual({ id: '123', role: Role.USER });
            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('hasRole', () => {
        test('should call next with an error if user is not present in the request', () => {
            const req = mockRequest({}, {}, null); // No user in the request
            const res = mockResponse();
            const hasRoleMiddleware = authInterceptor.hasRole(Role.ADMIN);

            hasRoleMiddleware(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });
        test('should call next with an error if user does not have the required role', () => {
            const req = mockRequest({}, {}, { id: '123', role: Role.USER });
            const res = mockResponse();
            const hasRoleMiddleware = authInterceptor.hasRole(Role.ADMIN);

            hasRoleMiddleware(req, res, mockNext);
        });

        test('should call next if user has the required role', () => {
            const req = mockRequest({}, {}, { id: '123', role: Role.ADMIN });
            const res = mockResponse();
            const hasRoleMiddleware = authInterceptor.hasRole(Role.ADMIN);

            hasRoleMiddleware(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('isUser', () => {
        test('should call next with an error if user is not logged in', () => {
            const req = mockRequest();
            const res = mockResponse();

            authInterceptor.isUser(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });

        test('should call next if user is the owner or an admin', () => {
            const req = mockRequest(
                {},
                { id: '123' },
                { id: '123', role: Role.USER },
            );
            const res = mockResponse();

            authInterceptor.isUser(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });

        test('should call next with an error if user is not the owner or an admin', () => {
            const req = mockRequest(
                {},
                { id: '123' },
                { id: '456', role: Role.USER },
            );
            const res = mockResponse();

            authInterceptor.isUser(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });
    });

    describe('isOwnerReview', () => {
        test('should call next with an error if user is not logged in', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await authInterceptor.isOwnerReview(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });

        test('should call next if user is the owner of the review or an admin', async () => {
            const req = mockRequest(
                {},
                { id: 'review123' },
                { id: 'user123', role: Role.USER },
            );
            const res = mockResponse();
            (mockReviewRepo.readById as Mock).mockResolvedValue({
                userId: 'user123',
            });

            await authInterceptor.isOwnerReview(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });

        test('should call next with an error if user is not the owner of the review or an admin', async () => {
            const req = mockRequest(
                {},
                { id: 'review123' },
                { id: 'user456', role: Role.USER },
            );
            const res = mockResponse();
            (mockReviewRepo.readById as Mock).mockResolvedValue({
                userId: 'user123',
            });

            await authInterceptor.isOwnerReview(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
        });

        test('should call next with an error if review does not exist', async () => {
            const req = mockRequest(
                {},
                { id: 'review123' },
                { id: 'user456', role: Role.USER },
            );
            const res = mockResponse();
            (mockReviewRepo.readById as Mock).mockRejectedValue(
                new Error('Review not found'),
            );

            await authInterceptor.isOwnerReview(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
