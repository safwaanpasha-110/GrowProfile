import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Redis from 'ioredis'

/**
 * GET /api/health
 * 
 * Health check endpoint — verifies database and Redis connectivity.
 */
export async function GET() {
  const health: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {},
  }

  // Check PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`
    health.services.database = { status: 'connected' }
  } catch (error: any) {
    health.services.database = { status: 'error', message: error.message }
    health.status = 'degraded'
  }

  // Check Redis
  try {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    })
    await redis.connect()
    await redis.ping()
    await redis.disconnect()
    health.services.redis = { status: 'connected' }
  } catch (error: any) {
    health.services.redis = { status: 'error', message: error.message }
    health.status = 'degraded'
  }

  const httpStatus = health.status === 'ok' ? 200 : 503
  return NextResponse.json(health, { status: httpStatus })
}
