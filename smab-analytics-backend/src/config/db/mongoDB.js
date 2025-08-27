import mongoose from 'mongoose';

export default function connectMongoDB() {
    const uri = `${process.env.MONGODB_HOST_SCHEME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`; // Replace 'myDatabase' with your DB name
    console.log("[MURI]", uri);

    mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}
