const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const UserRouter = require('./routes/UserRouter');
const AdminRouter = require('./routes/AdminRouter');
const cookieParser = require('cookie-parser');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use('/api/user', UserRouter);
app.use('/api/admin', AdminRouter);

app.get('/', (req, res) => {
    return res.json({ "message": "This is server side" });
});

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL).then(() => {
    console.log('Connected to db');
    app.listen(3000, () => {
        console.log("App is running on port 3000");
    })
}).catch((err) => {
    console.log(err);
});





