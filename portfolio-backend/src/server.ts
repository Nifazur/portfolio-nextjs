/* eslint-disable no-console */
import http, { Server } from 'http';
import app from './app';
import { config } from './config';
import { prisma } from './config/db';

let server: Server | null = null;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectToDB();

    server = http.createServer(app);

    server.listen(config.port, () => {
      console.log('🚀 ========================================');
      console.log(`🚀 Server running in ${config.nodeEnv} mode`);
      console.log(`🚀 Server URL: http://localhost:${config.port}`);
      console.log(`🚀 Health Check: http://localhost:${config.port}/health`);
      console.log('🚀 ========================================');
    });

    handleProcessEvents();
  } catch (error) {
    console.error('❌ Error during server startup:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.warn(`\n🔄 Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log('✅ HTTP server closed.');

      try {
        await prisma.$disconnect();
        console.log('✅ Database connection closed.');
        console.log('✅ Server shutdown complete.');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('⚠️ Forcing server shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

function handleProcessEvents() {
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
}

// Start the application
startServer();