const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const ip = require('ip');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// --- Serve Frontend (Production) ---
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/api/ip', (req, res) => {
    res.json({ ip: ip.address() });
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    io.emit('new-image', { url: imageUrl, id: Date.now() });

    res.json({ success: true, url: imageUrl });
});

// Handle React Routing (SPA) - Must be last
app.get(/(.*)/, (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        // res.sendFile(indexPath); // Causing issues
        const html = fs.readFileSync(indexPath, 'utf8');
        res.send(html);
    } else {
        console.error('Index file not found at:', indexPath);
        res.status(404).send('Not found');
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('clear-images', () => {
        io.emit('clear-images');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Local IP: http://${ip.address()}:${PORT}`);
});
