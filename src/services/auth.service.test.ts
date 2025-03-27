import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Mock, vi } from 'vitest';
import { AuthService } from './auth.service';

vi.mock('bcryptjs', () => ({
    hash: vi.fn().mockResolvedValue('Soy un hash'),
    compare: vi.fn().mockResolvedValue(true),
}));

vi.mock('jsonwebtoken');

const token = 'Este es el token';
const payload = {
    id: 'id',
    email: 'email',
    role: 'role',
};

describe('Given the class AuthService', () => {
    // const jwt = {
    //     sign: vi.fn(),
    //     verify: vi.fn(),
    // };

    describe('When hashPassword is called', () => {
        test('Then it should call hash from bcrypt', async () => {
            // Arrange
            const passwd = 'password original';
            // Act
            const result = await AuthService.hashPassword(passwd);
            // Assert
            expect(hash).toHaveBeenCalledWith(passwd, 10);
            expect(result).toBe('Soy un hash');
        });
    });
    describe('When comparePassword is called', () => {
        test('Then it should call compare from bcrypt', async () => {
            // Arrange
            const passwd = 'password original';
            const hash = 'hash de la password';
            // Act
            const result = await AuthService.comparePassword(passwd, hash);
            // Assert
            expect(compare).toHaveBeenCalledWith(passwd, hash);
            expect(result).toBe(true);
        });
    });
    describe('When generateToken is called', () => {
        test('Then it should call jwt.sign for generate a token', async () => {
            // Arrange

            // jwt.sign = vi.fn().mockReturnValue(token);
            (jwt.sign as Mock).mockReturnValue(token);
            // Act
            const result = await AuthService.generateToken(payload);
            // Assert
            expect(jwt.sign).toHaveBeenCalledWith(
                payload,
                process.env.JWT_SECRET as string,
            );
            expect(result).toBe(token);
        });
    });
    describe('When verifyToken is called', () => {
        test('Then it should verify a valid token', async () => {
            // Arrange
            (jwt.verify as Mock).mockReturnValue(payload);
            // Act
            const result = AuthService.verifyToken(token);
            // Assert
            expect(jwt.verify).toHaveBeenCalledWith(
                token,
                process.env.JWT_SECRET as string,
            );
            expect(result).toEqual(payload);
        });

        test('Then it should verify a valid token', async () => {
            // Arrange
            (jwt.verify as Mock).mockReturnValue('No soy un token válido');
            // Act
            // Assert
            expect(AuthService.verifyToken(token)).rejects.toThrowError(
                'Token no válido',
            );

            expect(jwt.verify).toHaveBeenCalledWith(
                token,
                process.env.JWT_SECRET as string,
            );
        });
    });
});
