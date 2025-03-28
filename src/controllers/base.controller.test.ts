import { describe, it, expect, vi, Mock } from 'vitest';
import { notFoundController, notMethodController } from './base.controller';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/http-error';

describe('Base Controller', () => {
    describe('notFoundController', () => {
        it('should call next with a 404 HttpError', () => {
            const req = { url: '/non-existent' } as Request;
            const next = vi.fn();

            notFoundController(req, {} as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(HttpError));
            const error = (next as Mock).mock.calls[0][0] as HttpError;
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Page /non-existent not found');
        });
    });

    describe('notMethodController', () => {
        it('should call next with a 405 HttpError', () => {
            const req = { method: 'POST' } as Request;
            const next = vi.fn() as NextFunction;

            notMethodController(req, {} as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(HttpError));
            const error = (next as Mock).mock.calls[0][0] as HttpError;
            expect(error.statusCode).toBe(405);
            expect(error.message).toBe('Method POST  not allowed');
        });
    });
});
