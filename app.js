import "express-async-errors"
import * as dotenv from "dotenv"
import express from "express"
import xss from "xss-clean"
import cors from "cors"
import helmet from "helmet"
import rateLimiter from "express-rate-limit"
import authRoutes from "./routes/auth.route.js"
import connectDB from "./db/connect.js"
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

dotenv.config()

// app initialization
const app = express()

// middleware
app.set('trus proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

app.use(xss())
app.use(express.json())
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello Jimoh sodiq')
})

// use routes here
app.use("/api/v1/auth", authRoutes)

// error handlers here
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// database connection here
const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()