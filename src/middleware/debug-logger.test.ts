import { describe, it, vi, expect, Mock } from 'vitest';
import { debugLogger } from './debug-logger';
import type { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';

vi.mock('debug', () => ({
    default: vi.fn(() => vi.fn()),
}));

describe('debugLogger middleware', () => {
    it('should call debug with the correct method and URL', () => {
        const mockDebug = vi.fn();
        (createDebug as unknown as Mock).mockReturnValue(mockDebug);

        const req = { method: 'GET', url: '/test' } as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        const middleware = debugLogger('testLogger');
        middleware(req, res, next);

        expect(createDebug).toHaveBeenCalledWith('movies:testLogger');
        expect(mockDebug).toHaveBeenCalledWith('GET', '/test');
        expect(next).toHaveBeenCalled();
    });

    it('should use default logger name if none is provided', () => {
        const mockDebug = vi.fn();
        (createDebug as unknown as Mock).mockReturnValue(mockDebug);

        const req = { method: 'POST', url: '/default' } as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        const middleware = debugLogger();
        middleware(req, res, next);

        expect(createDebug).toHaveBeenCalledWith('movies:logger');
        expect(mockDebug).toHaveBeenCalledWith('POST', '/default');
        expect(next).toHaveBeenCalled();
    });
});
