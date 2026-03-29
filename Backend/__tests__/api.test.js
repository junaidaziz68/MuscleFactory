const request = require('supertest');
const app = require('../index');
const db = require('../db');

describe('API Endpoints', () => {
    let server;
    let token;
    let testUserId;

    // Unique test identifiers to prevent database conflicts
    const testUsername = `testapiuser_${Date.now()}`;
    const testEmail = `testapi_${Date.now()}@example.com`;
    const testPassword = 'password123';

    beforeAll(() => {
        server = app.listen(0);
    });

    afterAll(async () => {
        // Clean up test data
        if (testUserId) {
            await db.execute('DELETE FROM workouts WHERE user_id = ?', [testUserId]);
            await db.execute('DELETE FROM users WHERE id = ?', [testUserId]);
        }
        await db.end(); // close db connection pool
        server.close();
    });

    it('should return API running status for GET /', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'API running' });
    });

    describe('Auth flow', () => {
        it('should register a new user', async () => {
            const response = await request(server)
                .post('/api/register')
                .send({
                    username: testUsername,
                    email: testEmail,
                    password: testPassword
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should log in the user and return a token', async () => {
            const response = await request(server)
                .post('/api/login')
                .send({
                    email: testEmail,
                    password: testPassword
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
            expect(response.body.user).toBeDefined();

            token = response.body.token;
            testUserId = response.body.user.id;
        });

        it('should fetch the user profile when authenticated', async () => {
            const response = await request(server)
                .get('/api/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(testEmail);
        });

        it('should deny profile access without token', async () => {
            const response = await request(server).get('/api/profile');
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No token provided');
        });
    });

    describe('Workout endpoints', () => {
        it('should create a new workout', async () => {
            const response = await request(server)
                .post('/api/workouts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Jest Test Workout',
                    date: '2026-03-20'
                });

            expect(response.status).toBe(200);
            expect(response.body.id).toBeDefined();
            expect(response.body.name).toBe('Jest Test Workout');
        });

        it('should list workouts for the user', async () => {
            const response = await request(server)
                .get('/api/workouts')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.some(w => w.name === 'Jest Test Workout')).toBe(true);
        });
    });
});
