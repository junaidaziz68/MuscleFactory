require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


// MIDDLEWARE FOR PROTECTED ROUTES
const authMiddleware = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid token' };
    }
};

router.get('/api/workouts', authMiddleware, async ctx => {
    try {
        const userId = ctx.state.user.id;
        const { date } = ctx.query;
        let query = 'SELECT * FROM workouts WHERE user_id = ?';
        const params = [userId];
        if (date) {
            query += ' AND date = ?';
            params.push(date);
        }
        const [rows] = await db.execute(query, params);
        ctx.body = rows.length ? rows : []; // Return an empty array if no workouts found
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch workouts' };
    }
});

router.post('/api/workouts', authMiddleware, async ctx => {
    const userId = ctx.state.user.id;
    const { name, date } = ctx.request.body;
    const [result] = await db.execute(
        'INSERT INTO workouts (user_id, name, date) VALUES (?, ?, ?)',
        [userId, name, date]
    );
    ctx.body = { id: result.insertId, name, date };
});


router.get('/api/exercises', authMiddleware, async ctx => {
    try {
        const { workout_id } = ctx.query;
        // Verify user owns the workout before returning exercises
        let query = 'SELECT e.* FROM workout_exercises e JOIN workouts w ON e.workout_id = w.id WHERE w.user_id = ?';
        const params = [ctx.state.user.id];

        if (workout_id) {
            query += ' AND e.workout_id = ?';
            params.push(workout_id);
        }
        const [rows] = await db.execute(query, params);
        ctx.body = rows.length ? rows : []; // Return an empty array if no exercises found
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch exercises' };
    }
});
router.post('/api/exercises', authMiddleware, async ctx => {
    const { workout_id, name, sets, reps, weight } = ctx.request.body;

    if (!workout_id || !name) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields' };
        return;
    }

    const safeSets = Number(sets) || 1;
    const safeReps = Number(reps) || 1;
    const safeWeight = Number(weight) || 0;

    try {
        // Verify user owns the workout
        const [workouts] = await db.execute('SELECT id FROM workouts WHERE id = ? AND user_id = ?', [workout_id, ctx.state.user.id]);
        if (workouts.length === 0) {
            ctx.status = 403;
            ctx.body = { error: 'Unauthorized workout access' };
            return;
        }

        const [result] = await db.execute(
            'INSERT INTO workout_exercises (workout_id, name, `sets`, reps, weight) VALUES (?, ?, ?, ?, ?)',
            [workout_id, name, safeSets, safeReps, safeWeight]
        );
        ctx.body = { id: result.insertId };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
});

router.put('/api/workouts/:id', authMiddleware, async ctx => {
    const { name } = ctx.request.body;
    const { id } = ctx.params;
    try {
        await db.execute('UPDATE workouts SET name = ? WHERE id = ? AND user_id = ?', [name, id, ctx.state.user.id]);
        ctx.body = { success: true };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
});

router.delete('/api/workouts/:id', authMiddleware, async ctx => {
    const { id } = ctx.params;
    try {
        await db.execute('DELETE FROM workouts WHERE id = ? AND user_id = ?', [id, ctx.state.user.id]);
        ctx.body = { success: true };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
});

router.put('/api/exercises/:id', authMiddleware, async ctx => {
    const { name, sets, reps, weight } = ctx.request.body;
    const { id } = ctx.params;

    if (!name) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required field: name' };
        return;
    }

    const safeSets = Number(sets) || 1;
    const safeReps = Number(reps) || 1;
    const safeWeight = Number(weight) || 0;

    try {
        await db.execute(
            'UPDATE workout_exercises e JOIN workouts w ON e.workout_id = w.id SET e.name = ?, e.`sets` = ?, e.reps = ?, e.weight = ? WHERE e.id = ? AND w.user_id = ?',
            [name, safeSets, safeReps, safeWeight, id, ctx.state.user.id]
        );
        ctx.body = { success: true };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
});

router.delete('/api/exercises/:id', authMiddleware, async ctx => {
    const { id } = ctx.params;
    await db.execute('DELETE e FROM workout_exercises e JOIN workouts w ON e.workout_id = w.id WHERE e.id = ? AND w.user_id = ?', [id, ctx.state.user.id]);
    ctx.body = { success: true };
});


// User registration
router.post('/api/register', async ctx => {
    const { username, email, password } = ctx.request.body;
    if (!username || !email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Username, email and password are required' };
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        ctx.body = { success: true };
    } catch (err) {
        console.error('Registration error:', err);
        ctx.status = 500;
        ctx.body = { error: err.message || 'Failed to register user' };
    }
});


// User login

router.post('/api/login', async (ctx) => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
        ctx.status = 400;
        ctx.body = { error: 'Email and password required' };
        return;
    }

    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (rows.length === 0) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid credentials' };
        return;
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid credentials' };
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    ctx.body = { token, user: { id: user.id, email: user.email, username: user.username } };
});

router.get('/api/profile', authMiddleware, async (ctx) => {
    ctx.body = { message: 'Protected route', user: ctx.state.user };
});

// --- DIET PLAN ROUTES ---

// Get all diet plans for the authenticated user
router.get('/api/diet-plans', authMiddleware, async (ctx) => {
    const userId = ctx.state.user.id;
    try {
        const [plans] = await db.execute('SELECT * FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        // Enhance plans with their meals
        for (let plan of plans) {
            const [meals] = await db.execute('SELECT * FROM diet_plan_meals WHERE diet_plan_id = ?', [plan.id]);
            plan.meals = meals.map(meal => ({
                ...meal,
                ingredients: JSON.parse(meal.ingredients),
                macros: JSON.parse(meal.macros)
            }));
        }

        ctx.body = plans;
    } catch (err) {
        console.error('Error fetching diet plans:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch diet plans' };
    }
});

// Save a new diet plan
router.post('/api/diet-plans', authMiddleware, async (ctx) => {
    const userId = ctx.state.user.id;
    const { name, diet_style, meals_count, meals } = ctx.request.body;

    if (!name || !diet_style || !meals_count || !meals || !Array.isArray(meals)) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required diet plan data' };
        return;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert the Diet Plan
        const [planResult] = await connection.execute(
            'INSERT INTO diet_plans (user_id, name, diet_style, meals_count) VALUES (?, ?, ?, ?)',
            [userId, name, diet_style, meals_count]
        );
        const planId = planResult.insertId;

        // 2. Insert the Meals
        for (const meal of meals) {
            await connection.execute(
                'INSERT INTO diet_plan_meals (diet_plan_id, name, ingredients, calories, macros) VALUES (?, ?, ?, ?, ?)',
                [
                    planId,
                    meal.name,
                    JSON.stringify(meal.ingredients),
                    meal.calories,
                    JSON.stringify(meal.macros)
                ]
            );
        }

        await connection.commit();
        ctx.body = { success: true, id: planId };
    } catch (err) {
        await connection.rollback();
        console.error('Error saving diet plan:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to save diet plan' };
    } finally {
        connection.release();
    }
});


// --- FOOD LOGS ROUTES ---

router.get('/api/food-logs', authMiddleware, async (ctx) => {
    const userId = ctx.state.user.id;
    const { date } = ctx.query;

    if (!date) {
        ctx.status = 400;
        ctx.body = { error: 'Date parameter is required' };
        return;
    }

    try {
        const [logs] = await db.execute(
            'SELECT * FROM food_logs WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
            [userId, date]
        );
        ctx.body = logs;
    } catch (err) {
        console.error('Error fetching food logs:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch food logs' };
    }
});

router.post('/api/food-logs', authMiddleware, async (ctx) => {
    const userId = ctx.state.user.id;
    const { date, meal_type, name, amount, unit, calories, protein, carbs, fats } = ctx.request.body;

    if (!date || !meal_type || !name || amount === undefined || !unit || calories === undefined || protein === undefined || carbs === undefined || fats === undefined) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required food log data' };
        return;
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO food_logs (user_id, date, meal_type, name, amount, unit, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, date, String(meal_type).toLowerCase(), name, amount, unit, calories, protein, carbs, fats]
        );
        ctx.body = { success: true, id: result.insertId };
    } catch (err) {
        console.error('Error saving food log:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to save food log' };
    }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});