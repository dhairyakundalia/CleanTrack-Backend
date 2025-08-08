import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import {server} from "./src/app.js";

// Create HTTP server and bind with Socket.IO


// Start the server
// const PORT = process.env.PORT || 3030;
server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on http://localhost:${process.env.PORT}`);
});
