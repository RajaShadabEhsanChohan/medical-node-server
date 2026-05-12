import mongoose from "mongoose"

const Connection = async (USERNAME, PASSWORD) => {


    // const DB = `mongodb+srv://${USERNAME}:${PASSWORD}@medical-data.oljw1fj.mongodb.net/?retryWrites=true&w=majority` 
    const DB = "mongodb://127.0.0.1:27017/Medical"

    try {
        await mongoose.connect(DB,{
            //  useUnifiedTopology: true, useNewUrlParser: true
        })
        console.log("Database Connected")
    } catch (error) {
        console.log("Database Not Connected || ",error )
    }
}

export default Connection
