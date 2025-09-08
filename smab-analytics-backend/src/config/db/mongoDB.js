import mongoose from 'mongoose';

export default function connectMongoDB() {
  const {
    MONGODB_HOST_SCHEME,   // e.g., mongodb://localhost
    MONGODB_PORT,          // e.g., 27077
    MONGODB_AUTH_DB,       // e.g., admin
    MONGODB_USERNAME,      // e.g., admin
    MONGODB_PASSWORD,      // e.g., "Pa***************rd"
    MONGODB_DB_NAME        // e.g., myDatabase
  } = process.env;

  const credentials = MONGODB_USERNAME && MONGODB_PASSWORD
    ? `${MONGODB_USERNAME}:${encodeURIComponent(MONGODB_PASSWORD)}@`
    : '';

  const host = MONGODB_HOST_SCHEME.replace('mongodb://', ''); // strip scheme for manual URI build

  const uri = process.env.NODE_ENV !== 'development' 
                ? `mongodb://${credentials}${host}:${MONGODB_PORT}/${MONGODB_DB_NAME}?authSource=${MONGODB_AUTH_DB}`
                : `mongodb://${host}:${MONGODB_PORT}/${MONGODB_DB_NAME}`;

  console.log('[MongoDB URI]', uri); // Optional: remove in production

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Optional: exit on failure
  });
}
