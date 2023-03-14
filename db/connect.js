import mongoose from "mongoose"

const connectDB = async (url) => {
    mongoose.set('strictQuery', false)
    return mongoose.connect(url)
}


export default connectDB