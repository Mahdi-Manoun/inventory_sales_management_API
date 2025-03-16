import express from 'express';
import dotenv from 'dotenv';
import { syncDatabase } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/supplier', supplierRoutes);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// sync db before running the server
syncDatabase()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to sync database:', error);
        process.exit(1);  // Exit if DB sync fails
    });