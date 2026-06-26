import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/worldnow';

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = {
  conn: null,
  promise: null,
};

export function getSeedData() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'db.json');
    if (!fs.existsSync(dataFile)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(dataFile, 'utf8')) as {
      blogs?: any[];
      categories?: any[];
      regions?: any[];
    };
  } catch (error) {
    console.warn('Seed data fallback unavailable:', error);
    return null;
  }
}

export function writeSeedData(data: Record<string, any>) {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.warn('Unable to write seed data:', error);
    return false;
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => mongoose)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
