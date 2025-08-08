import express from "express";
import cors from "cors";
import truckRouter from "./routes/truck.routes.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";
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

  socket.on("messageFromAndroid", (data) => {
    console.log("📨 Received from Android:", data);
    socket.emit("messageFromServer", "Hello Android!");
  });
  socket.on("locationUpdate", (data) => {
    console.log("📨 Received from Android:", data);
    socket.emit("messageFromServer", "Hello Android!");
  });

  
  socket.emit("FromUser","Hello can you give me your live location!?");
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
app.get("/test", (req, res) => {
  res.render("test");
});

export { server};
