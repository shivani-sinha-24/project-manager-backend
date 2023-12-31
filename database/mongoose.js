import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const mongo_url = process.env.MONGO_URI;

const conf = () => {
    
    //mongoose.connect('mongodb://localhost/admissionjockey');
    mongoose.set("strictQuery", false);
    mongoose.connect(mongo_url);
    // mongoose.connect('mongodb://localhost/edudb');
    const db= mongoose.connection;
    db.on('error',console.error.bind('Unable to connect to the database'));
    db.once("open",function calback(){
        console.log("Connection has been established successfully!!");
     
    })
}

export default conf;
    

