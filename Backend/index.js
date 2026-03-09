require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const fetch = require('node-fetch');

const db = require('./db');

const app = new Koa();
const router = new Router();

// Global error handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err);
        ctx.status = err.status || 500;
        ctx.body = { error: err.message };
    }
});

app.use(cors());
app.use(bodyParser());


router.get('/', ctx => {
    ctx.body = { status: 'API running' };
});


router.get('/api/workouts', async ctx => {
    try {
        const [rows] = await db.execute('SELECT * FROM workouts');
        ctx.body = rows.length ? rows : []; // Return an empty array if no workouts found
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch workouts' };
    }
});

router.post('/api/workouts', async ctx => {
    const { name, date } = ctx.request.body;
    const [result] = await db.execute(
        'INSERT INTO workouts (name, date) VALUES (?, ?)',
        [name, date]
    );
    ctx.body = { id: result.insertId, name, date };
});


router.get('/api/exercises', async ctx => {
    try {
        const [rows] = await db.execute('SELECT * FROM workout_exercises');
        ctx.body = rows.length ? rows : []; // Return an empty array if no exercises found
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch exercises' };
    }
});
router.post('/api/exercises', async ctx => {
    const { workout_id, name, sets, reps, weight } = ctx.request.body;

    if (!workout_id || !name || !sets || !reps) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields' };
        return;
    }

    const [result] = await db.execute(
        'INSERT INTO workout_exercises (workout_id, name, `sets`, reps, weight) VALUES (?, ?, ?, ?, ?)',
        [workout_id, name, sets, reps, weight]
    );

    ctx.body = { id: result.insertId };
});

router.put('/api/workouts/:id', async ctx => {
    const { name } = ctx.request.body;
    const { id } = ctx.params;
    await db.execute('UPDATE workouts SET name = ? WHERE id = ?', [name, id]);
    ctx.body = { success: true };
});

router.delete('/api/workouts/:id', async ctx => {
    const { id } = ctx.params;
    await db.execute('DELETE FROM workouts WHERE id = ?', [id]);
    ctx.body = { success: true };
});

router.put('/api/exercises/:id', async ctx => {
    const { name, sets, reps, weight } = ctx.request.body;
    const { id } = ctx.params;
    await db.execute(
        'UPDATE workout_exercises SET name = ?, `sets` = ?, reps = ?, weight = ? WHERE id = ?',
        [name, sets, reps, weight, id]
    );
    ctx.body = { success: true };
});

router.delete('/api/exercises/:id', async ctx => {
    const { id } = ctx.params;
    await db.execute('DELETE FROM workout_exercises WHERE id = ?', [id]);
    ctx.body = { success: true };
});


app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});