// config/otpStore.js
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

let redisClient = null;
try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
} catch (e) {
  console.warn("Redis not configured - falling back to in-memory OTP store");
}

// In-memory fallback
const memoryStore = new Map();

// Helper wrappers (get, set with TTL, del)
export const otpSet = async (key, value, ttlSeconds = 300) => {
  if (redisClient) {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
    return;
  }
  memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};

export const otpGet = async (key) => {
  if (redisClient) {
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  }
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
};

export const otpDel = async (key) => {
  if (redisClient) {
    await redisClient.del(key);
    return;
  }
  memoryStore.delete(key);
};
