import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes)

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        name: "Griffitus API",
        status: "online"
    });
});

export default app;