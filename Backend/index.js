
const Koa= require('koa');
const app = new Koa();



app.use(async ctx => {
    ctx.body = 'Muscle Factory Backend Running';
});


app.listen  (3000, () => {  console.log('Server running on port 3000'); });