const mongoose=require("mongoose")

const connectDB=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("Error While Connecting Db",error.message)
    }
}

module.exports=connectDB