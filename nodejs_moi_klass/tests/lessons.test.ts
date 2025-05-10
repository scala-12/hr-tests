import request from 'supertest';
import app from '../src/app';
import knex from '../src/db/knex';

afterAll(async () => {
    await knex.destroy();
});

describe('GET /lessons', () => {
    test('должен вернуть 200 и массив занятий [1]', async () => {
        const response = await request(app).get('/lessons').query({ date: '2019-09-03' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body) && response.body.length).toBe(1);
    });

    test('должен вернуть 200 и массив занятий [2]', async () => {
        const response = await request(app).get('/lessons').query({ date: '2019-09-01,2019-09-02' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body) && response.body.length).toBe(2);
    });

    test('некорректный date=2024-99-01', async () => {
        const response = await request(app).get('/lessons').query({ date: '2024-99-01' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(expect.stringMatching(/date/));
    });

    test('некорректный date=2024-99-01,2019-09-02', async () => {
        const response = await request(app).get('/lessons').query({ date: '2024-99-01,2019-09-02' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(expect.stringMatching(/date/));
    });

    test('некорректный studentsCount=abc должен вернуть 400', async () => {
        const response = await request(app).get('/lessons').query({ studentsCount: 'abc' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual(expect.stringMatching(/studentsCount/));
    });

    test('studentsCount=0 должен вернуть 200 и массив занятий [1]', async () => {
        const response = await request(app).get('/lessons').query({ studentsCount: '0' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body) && response.body.length).toBe(1);
    });

    test('studentsCount=0,2&lessonsPerPage=10 должен вернуть 200 и массив занятий [7]', async () => {
        const response = await request(app).get('/lessons').query({ studentsCount: '0,2', lessonsPerPage: 10 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body) && response.body.length).toBe(7);
    });

    test('фильтрация по status = 1', async () => {
        const response = await request(app).get('/lessons').query({ status: '1' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('должен вернуть первую страницу с 2 занятиями', async () => {
        const response = await request(app).get('/lessons?lessonsPerPage=2&page=1');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeLessThanOrEqual(2);
    });

    test('вторая страница также работает', async () => {
        const response = await request(app).get('/lessons?lessonsPerPage=2&page=2');
        expect(response.status).toBe(200);
    });

    test('фильтрация по teacherIds', async () => {
        const response = await request(app).get('/lessons?teacherIds=1');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
