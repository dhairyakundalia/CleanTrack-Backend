import dotenv from "dotenv"
import { app } from "./app.js"

dotenv.config({
    path: "./.env"
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})