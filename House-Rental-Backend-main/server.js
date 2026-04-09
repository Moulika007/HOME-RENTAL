const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('./routes/userRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const renterRoutes = require('./routes/renterRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const billRoutes = require('./routes/billRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

app.use('/api/houses', houseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/renters', renterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bills', billRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found on this server.`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));