require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI?.substring(0, 50) + '...');

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
      connectTimeoutMS: 30000,
      keepAlive: true
    });

    if (connection.connection.readyState === 1) {
      console.log('MongoDB connection successful!');
      
      // Test database access
      const collections = await connection.connection.db.collections();
      console.log('Available collections:', collections.map(c => c.collectionName));
      
      // Test basic operations
      const testCollection = connection.connection.db.collection('test');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      console.log('Test document inserted successfully');
      
      await testCollection.deleteOne({ test: true });
      console.log('Test document deleted successfully');
    } else {
      console.log('Connection state:', connection.connection.readyState);
      throw new Error('Failed to establish connection');
    }

    await mongoose.connection.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  } finally {
    process.exit();
  }
}

// Add error handlers
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

testConnection(); 