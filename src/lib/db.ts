import { Redis, RedisConfigNodejs } from '@upstash/redis';

const redisConfig: RedisConfigNodejs = {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
};

export const db = new Redis(redisConfig);
