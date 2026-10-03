import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/database.js';
import { seedDatabaseIfEmpty } from './scripts/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database has 0 users so the app is always fully populated & functional
    await seedDatabaseIfEmpty();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 MessMeter Server is running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`📊 Analytics:  http://localhost:${PORT}/api/analytics/overview`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
