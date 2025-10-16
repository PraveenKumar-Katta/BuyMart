const mongoose=require("mongoose")
let productionURL=process.env.MONGO_URI

const connectDB=async(req,res)=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Buymart")
        console.log("DB Connected")
    } catch (error) {
        console.log("Error While Connecting Db",error.message)
    }
}

module.exports=connectDB