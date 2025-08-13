import express from "express";
import cors from "cors";
import truckRouter from "./routes/truck.routes.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { create } from "domain";
import { createUser, loginUser, logoutUser } from "./models/user.model.js";
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
  console.log("🟢 New client connected:", socket.id);

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
app.get("/api/signup", async (req, res) => {
    const { email, password, username } = req.body;
    const {data, error} = await createUser({ email, password, username })
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
})
app.get("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const {data, error} = await loginUser({ email, password });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
})
app.get("/api/logout", async (req, res) => {
    const {data, error} = await logoutUser();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
})
app.get("/test", (req, res) => {
  res.render("test");
});

export { server };
