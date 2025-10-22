import express from 'express';
import mainRoute from './api/main';
import { PORT } from './config/env-config';
import { connectToDatabase } from './config/mongodb-config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRoute);

connectToDatabase().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
});