const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const UserRouter = require('./routes/UserRouter');
const AdminRouter = require('./routes/AdminRouter');
const SuperAdminRouter = require('./routes/SuperAdminRouter');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', UserRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/super-admin', SuperAdminRouter);

app.get('/', (req, res) => {
    return res.json({ "message": "This is server side" });
});

const mongoURL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
mongoose.connect(mongoURL).then(() => {
    console.log('Connected to db');
    httpServer.listen(PORT, () => {
        console.log("App is running on port 3000");
    })
}).catch((err) => {
    console.log(err);
});





