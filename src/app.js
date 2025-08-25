import express from "express";
import cors from "cors";
import truckRouter from "./routes/truck.routes.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { createUser, loginUser, logoutUser } from "./models/user.model.js";
import { truckSocketHandler } from "./controllers/truck.controller.js";
import { ApiError } from "./utils/apiError.js";
import { userSocketHandler } from "./controllers/user.controller.js";
import { selectGeofences } from "./models/user.model.js";
import { count } from "console";
// import { create } from "domain";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO logic
io.on("connection", (socket) => {
    const { role } = socket.handshake.query;
    console.log("🟢 New client connected:", socket.id);

    if (role === "truck")
        truckSocketHandler(socket);
    else if (role === "user")
        userSocketHandler(socket);

    socket.on("join", (roomId, role) => {
        socket.join(roomId);
        socket.to(roomId).emit("messageFromServer", `You joined as ${role}`);
    })

    socket.on("messageFromAndroid", (data) => {
        console.log("📨 Received from Android:", data);
        socket.emit("messageFromServer", "Hello Android!");
    });
    socket.on("locationUpdate", (data) => {
        console.log("📨 Received from Android:", data);
        socket.to("Users").emit("TruckLocation", data);
        socket.emit("messageFromServer", "Hello Truck");
    });

    socket.on("disconnect", () => {
        console.log("🔌 Client disconnected:", socket.id);
    });
});

const getIO = () => {
    if (!io) return new ApiError(500, "Socket.IO not initialized");
    return io;
}

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src/views"));

// Routes
app.use("/api/truck", truckRouter);
app.post("/api/signup", async (req, res) => {
     console.log("signup request comes...")
    const { email, password, username } = req.body;
    const { data, error } = await createUser({ email, password, username })
    // console.log(error);
    if (error) return res.status(500).json({ error: error.message });
    //  console.log(data);
    return res.status(200).json({
        email: data.email,
        username: data.username,
        role: data.role,
        user_id: data.user_id
    });
})
app.post("/api/login", async (req, res) => {
    console.log("login request comes...")
    const { email, password } = req.body;
    const { data, error } = await loginUser({ email, password });
    console.log(error);
    console.log(data);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({
        email: data.email,
        username: data.username,
        role: data.role,
        user_id: data.user_id
    });
})
app.get("/api/logout", async (req, res) => {
    const { data, error } = await logoutUser();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
})

app.post("/api/select-geofences", async (req, res) =>{
    const { user_id, geofences } = req.body;
    const { dataArray, error } = await selectGeofences({ user_id, geofences });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(dataArray);
})
app.get("/test", (req, res) => {
    res.render("test");
});

export { server, getIO };
