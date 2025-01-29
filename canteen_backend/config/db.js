import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://maanusam11:Rajsam333@cluster0.uh9tp.mongodb.net/canteen').then(()=>{console.log("DB Connected")});
}
