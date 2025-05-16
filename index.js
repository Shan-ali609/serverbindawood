import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet'
import connectDB from './config/connectiondb.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import uploadRouterImage from './routes/uploadimage.route.js';
import subcategoryRouter from './routes/subcategory.route.js';
import productRouter from './routes/product.route.js';
//second step
dotenv.config();
// first step
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

//third step to convert all the response into json
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    //without it when front and backend on different port it will ahow error know it is false it not show an error
    crossOriginResourcePolicy : false
}))

//for checking our server running on browser
app.get("/",(req,res)=>{
    //server to client
     res.json({
        message : "server is running on port "+ PORT
     })
})


app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory',  subcategoryRouter)
app.use('/file', uploadRouterImage)
app.use('/api/product',productRouter)

const PORT = 8080 || process.env.PORT    
connectDB().then(()=>{
    // fourth step
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})
// fourth step




