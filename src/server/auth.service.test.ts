import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';

const authService = new AuthService();
const password = 'password';
const hash = await AuthService.hashPassword(password);
const result = await AuthService.comparePassword(password, hash);
const payload = { id: '1', email: 'email', role: 'admin' };
const sign = jwt.sign(payload, process.env.JWT_SECRET as string);

describe('Given a instance of AuthService', () => {
    describe('When it is created', () => {
        test('Then it should be defined', () => {
            expect(authService).toBeDefined();
        });
    });
});

describe('When comparePassword is called', () => {
    test('Then it should compare a password', async () => {
        expect(result).toBeTruthy();
    });
});

describe('When generateToken is called', () => {
    test('Then it should generate a valid token', async () => {
        const token = await AuthService.generateToken(payload);
        const decoded = jwt.decode(token);
        expect(decoded).toMatchObject(payload);
    });
});

describe('When verifyToken is called', () => {
    test('Then it should verify a valid token', async () => {
        const payload = { id: '1', email: 'email', role: 'admin' };
        const token = await AuthService.generateToken(payload);
        const result = await AuthService.verifyToken(token);
        expect(result).toMatchObject(payload);
    });

    test('Then it should throw an error for an invalid token', async () => {
        const invalidToken = 'invalid.token.value';
        await expect(AuthService.verifyToken(invalidToken)).rejects.toThrow(
            'Token no válido',
        );
    });

    test('Then it should throw an error for an expired token', async () => {
        const secret = process.env.JWT_SECRET as string;
        const expiredToken = jwt.sign(
            { id: '1', email: 'email', role: 'admin' },
            secret,
            { expiresIn: '-1s' },
        );
        await expect(AuthService.verifyToken(expiredToken)).rejects.toThrow();
    });
});
