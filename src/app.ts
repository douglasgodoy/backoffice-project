import express from 'express';
import { routes } from './routes';
const app = express();

app.use(express.json());
// app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));
routes(app);

export default app;
