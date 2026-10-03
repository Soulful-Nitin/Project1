import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/messmeter';
  const forceMemory = process.env.USE_MEMORY_DB === 'true';

  if (forceMemory) {
    console.log('🔄 USE_MEMORY_DB is set. Initializing in-memory MongoDB...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Connected to In-Memory MongoDB at ${memoryUri}`);
    return;
  }

  try {
    // Attempt connecting to provided URI with a 4-second timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ Connected to MongoDB Database: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err: any) {
    console.warn(`⚠️ Could not connect to local MongoDB (${mongoUri}): ${err.message}`);
    console.log('🚀 Seamlessly falling back to In-Memory MongoDB Server for instant out-of-the-box operation...');
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to fallback In-Memory MongoDB at ${memoryUri}`);
    } catch (memErr: any) {
      console.error('❌ Failed to initialize in-memory MongoDB:', memErr);
      throw memErr;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
