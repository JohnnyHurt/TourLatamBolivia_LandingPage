import { prisma } from '../config/prisma.js'; // FIX #5: shared singleton


export interface CreateAuditLogParams {
  userId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PUBLISH' | 'UNPUBLISH';
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export class AuditService {
  static async log(params: CreateAuditLogParams) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId || null,
          details: params.details ? JSON.stringify(params.details) : null,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  static async getLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs: logs.map((log) => ({
        id: log.id,
        userId: log.userId,
        userName: log.user?.name || 'System',
        userEmail: log.user?.email || 'N/A',
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details ? JSON.parse(log.details) : null,
        ipAddress: log.ipAddress,
        timestamp: log.timestamp.toISOString(),
      })),
    };
  }
}
