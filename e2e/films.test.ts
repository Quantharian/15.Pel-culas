import request from 'supertest';
import { createApp } from '../src/app';
import { describe, test, expect } from 'vitest';

let filmId = '';
let newFilmId = '';

const app = createApp();
const urlApi = '/api/films';
app.listen(3000, () => ({}));

describe('GET /api/films', () => {
    test('should return 200', async () => {
        const response = await request(app).get(urlApi);
        expect(response.status).toBe(200);
        filmId = response.body.results[0].id;
    });
});

describe('GET /api/films/:id', () => {
    test('should return 404 if ID not found', async () => {
        const url = `${urlApi}/${crypto.randomUUID()}`;
        const response = await request(app).get(url);
        expect(response.status).toBe(404);
    });
    test('should return 200 if ID found', async () => {
        const url = `${urlApi}/${filmId}`;
        const response = await request(app).get(url);
        expect(response.status).toBe(200);
    });
});

describe('POST /api/films', () => {
    const newFilm = {
        title: 'New Film',
        description: 'Text description',
        releaseYear: 2003,
        rating: 5,
        director: 'Director Name',
        duration: 120,
        poster: 'http://example.com/poster.jpg',
    };

    test('should return 401 Unauthorized', async () => {
        const response = await request(app).post(urlApi).send(newFilm);
        expect(response.status).toBe(401);
    });

    test('should return 201 Created', async () => {
        const response = await request(app)
            .post(urlApi)
            .set('Authorization', `Bearer <your-token-here>`)
            .send(newFilm);
        newFilmId = response.body.results[0].id;
        expect(response.status).toBe(201);
        expect(response.body.results[0].title).toBe(newFilm.title);
    });
});
