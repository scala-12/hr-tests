import express from 'express';
import lessonsRouter from './routes/lessons';

const app = express();

app.use(express.json());
app.use('/lessons', lessonsRouter);

export default app;
