import mongoose from 'mongoose';


const connectDB =
    async (DATABASE_URI) =>{
        try {
        const DB_OPTIONS={
            dbName:'knolly' 
        }
        await mongoose.connect(DATABASE_URI,DB_OPTIONS);
        console.log('Connected successfully');
    } catch (err) {
        return console.error(err);
    }
    }

export default connectDB