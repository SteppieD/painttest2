/**
 * Entity Locking System
 * 
 * Prevents race conditions in concurrent quote updates and other critical operations
 * Implements optimistic locking with automatic retry and timeout mechanisms
 */

import { EntityLock, LockResult } from './database-types';

export interface LockOptions {
  timeout?: number; // Lock timeout in seconds (default: 30)
  retryAttempts?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in ms (default: 1000)
  operation: 'read' | 'write' | 'delete';
}

export interface TransactionOptions {
  lockTimeout?: number;
  maxRetries?: number;
  entityLocks?: {
    entityType: 'quote' | 'customer' | 'company';
    entityId: number | string;
    operation: 'read' | 'write' | 'delete';
  }[];
}

export class EntityLockManager {
  private locks: Map<string, EntityLock> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired locks every 10 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredLocks();
    }, 10000);
  }

  /**
   * Acquire a lock on an entity
   */
  async acquireLock(
    entityType: 'quote' | 'customer' | 'company',
    entityId: number | string,
    sessionId: string,
    options: LockOptions = { operation: 'write' }
  ): Promise<LockResult> {
    const {
      timeout = 30,
      retryAttempts = 3,
      retryDelay = 1000,
      operation
    } = options;

    const lockKey = this.getLockKey(entityType, entityId);
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      // Check if entity is already locked
      const existingLock = this.locks.get(lockKey);
      
      if (existingLock) {
        // Check if lock is expired
        if (new Date(existingLock.expires_at) <= new Date()) {
          this.locks.delete(lockKey);
        } else {
          // Check if same session (can upgrade lock)
          if (existingLock.locked_by === sessionId) {
            // Can upgrade read lock to write lock
            if (existingLock.operation === 'read' && operation === 'write') {
              existingLock.operation = 'write';
              existingLock.expires_at = new Date(Date.now() + timeout * 1000).toISOString();
              return {
                success: true,
                lock: existingLock
              };
            }
            // Same or lesser operation, extend timeout
            existingLock.expires_at = new Date(Date.now() + timeout * 1000).toISOString();
            return {
              success: true,
              lock: existingLock
            };
          }

          // Different session - check if read locks can coexist
          if (existingLock.operation === 'read' && operation === 'read') {
            // Multiple read locks are allowed
            const newLock: EntityLock = {
              entity_type: entityType,
              entity_id: entityId.toString(),
              locked_by: sessionId,
              locked_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + timeout * 1000).toISOString(),
              operation
            };

            // Store with session-specific key for read locks
            const readLockKey = `${lockKey}:${sessionId}`;
            this.locks.set(readLockKey, newLock);

            return {
              success: true,
              lock: newLock
            };
          }

          // Lock conflict - wait and retry
          if (attempt < retryAttempts) {
            await this.sleep(retryDelay);
            continue;
          }

          return {
            success: false,
            error: `Entity is locked by another session`,
            retry_after: Math.floor((new Date(existingLock.expires_at).getTime() - Date.now()) / 1000)
          };
        }
      }

      // Acquire new lock
      const lock: EntityLock = {
        entity_type: entityType,
        entity_id: entityId.toString(),
        locked_by: sessionId,
        locked_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + timeout * 1000).toISOString(),
        operation
      };

      this.locks.set(lockKey, lock);

      return {
        success: true,
        lock
      };
    }

    return {
      success: false,
      error: 'Failed to acquire lock after maximum retries'
    };
  }

  /**
   * Release a lock on an entity
   */
  async releaseLock(
    entityType: 'quote' | 'customer' | 'company',
    entityId: number | string,
    sessionId: string
  ): Promise<boolean> {
    const lockKey = this.getLockKey(entityType, entityId);
    const lock = this.locks.get(lockKey);

    if (lock && lock.locked_by === sessionId) {
      this.locks.delete(lockKey);
      return true;
    }

    // Check for read locks with session-specific keys
    const readLockKey = `${lockKey}:${sessionId}`;
    const readLock = this.locks.get(readLockKey);
    if (readLock && readLock.locked_by === sessionId) {
      this.locks.delete(readLockKey);
      return true;
    }

    return false;
  }

  /**
   * Release all locks for a session
   */
  async releaseAllLocks(sessionId: string): Promise<number> {
    let releasedCount = 0;

    for (const [key, lock] of this.locks.entries()) {
      if (lock.locked_by === sessionId) {
        this.locks.delete(key);
        releasedCount++;
      }
    }

    return releasedCount;
  }

  /**
   * Check if an entity is locked
   */
  isLocked(
    entityType: 'quote' | 'customer' | 'company',
    entityId: number | string,
    operation: 'read' | 'write' | 'delete' = 'write'
  ): {
    isLocked: boolean;
    lock?: EntityLock;
    canProceed: boolean;
  } {
    const lockKey = this.getLockKey(entityType, entityId);
    const lock = this.locks.get(lockKey);

    if (!lock) {
      return {
        isLocked: false,
        canProceed: true
      };
    }

    // Check if expired
    if (new Date(lock.expires_at) <= new Date()) {
      this.locks.delete(lockKey);
      return {
        isLocked: false,
        canProceed: true
      };
    }

    // Read operations can proceed if existing lock is also read
    const canProceed = operation === 'read' && lock.operation === 'read';

    return {
      isLocked: true,
      lock,
      canProceed
    };
  }

  /**
   * Execute a function with automatic locking
   */
  async withLock<T>(
    entityType: 'quote' | 'customer' | 'company',
    entityId: number | string,
    sessionId: string,
    operation: 'read' | 'write' | 'delete',
    fn: () => Promise<T>,
    options: LockOptions = { operation }
  ): Promise<T> {
    const lockResult = await this.acquireLock(entityType, entityId, sessionId, options);
    
    if (!lockResult.success) {
      throw new Error(lockResult.error || 'Failed to acquire lock');
    }

    try {
      const result = await fn();
      return result;
    } finally {
      await this.releaseLock(entityType, entityId, sessionId);
    }
  }

  /**
   * Execute a transaction with multiple entity locks
   */
  async withTransaction<T>(
    sessionId: string,
    entityLocks: {
      entityType: 'quote' | 'customer' | 'company';
      entityId: number | string;
      operation: 'read' | 'write' | 'delete';
    }[],
    fn: () => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    const {
      lockTimeout = 30,
      maxRetries = 3
    } = options;

    const acquiredLocks: string[] = [];

    try {
      // Acquire all locks in order (prevents deadlocks by consistent ordering)
      const sortedLocks = entityLocks.sort((a, b) => {
        const aKey = this.getLockKey(a.entityType, a.entityId);
        const bKey = this.getLockKey(b.entityType, b.entityId);
        return aKey.localeCompare(bKey);
      });

      for (const lockSpec of sortedLocks) {
        const lockResult = await this.acquireLock(
          lockSpec.entityType,
          lockSpec.entityId,
          sessionId,
          {
            operation: lockSpec.operation,
            timeout: lockTimeout,
            retryAttempts: maxRetries,
            retryDelay: 1000
          }
        );

        if (!lockResult.success) {
          throw new Error(`Failed to acquire lock for ${lockSpec.entityType}:${lockSpec.entityId}: ${lockResult.error}`);
        }

        acquiredLocks.push(this.getLockKey(lockSpec.entityType, lockSpec.entityId));
      }

      // Execute the transaction
      const result = await fn();
      return result;

    } finally {
      // Release all acquired locks
      for (const lockKey of acquiredLocks) {
        const [entityType, entityId] = this.parseLockKey(lockKey);
        await this.releaseLock(entityType as any, entityId, sessionId);
      }
    }
  }

  /**
   * Get lock status for debugging
   */
  getLockStatus(): {
    totalLocks: number;
    locksByType: Record<string, number>;
    expiredLocks: number;
    activeLocks: EntityLock[];
  } {
    const now = new Date();
    const activeLocks: EntityLock[] = [];
    const locksByType: Record<string, number> = {};
    let expiredLocks = 0;

    for (const lock of this.locks.values()) {
      if (new Date(lock.expires_at) <= now) {
        expiredLocks++;
      } else {
        activeLocks.push(lock);
        locksByType[lock.entity_type] = (locksByType[lock.entity_type] || 0) + 1;
      }
    }

    return {
      totalLocks: this.locks.size,
      locksByType,
      expiredLocks,
      activeLocks
    };
  }

  /**
   * Force release all locks (emergency use only)
   */
  forceReleaseAllLocks(): number {
    const count = this.locks.size;
    this.locks.clear();
    return count;
  }

  /**
   * Clean up expired locks
   */
  private cleanupExpiredLocks(): void {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, lock] of this.locks.entries()) {
      if (new Date(lock.expires_at) <= now) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.locks.delete(key);
    }

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired locks`);
    }
  }

  /**
   * Generate lock key
   */
  private getLockKey(entityType: string, entityId: number | string): string {
    return `${entityType}:${entityId}`;
  }

  /**
   * Parse lock key back to entity type and ID
   */
  private parseLockKey(lockKey: string): [string, string] {
    const [entityType, entityId] = lockKey.split(':');
    return [entityType, entityId];
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.locks.clear();
  }
}

// Singleton instance
export const entityLockManager = new EntityLockManager();

// Middleware for Express routes to automatically handle locking
export function withEntityLock(
  entityType: 'quote' | 'customer' | 'company',
  entityIdParam: string, // e.g., 'id' or 'quoteId'
  operation: 'read' | 'write' | 'delete' = 'write',
  options: LockOptions = { operation }
) {
  return async (req: any, res: any, next: any) => {
    const entityId = req.params[entityIdParam];
    const sessionId = req.sessionID || req.headers['x-session-id'] || `session-${Date.now()}`;

    if (!entityId) {
      return res.status(400).json({
        success: false,
        error: `Missing ${entityIdParam} parameter`
      });
    }

    try {
      const lockResult = await entityLockManager.acquireLock(
        entityType,
        entityId,
        sessionId,
        options
      );

      if (!lockResult.success) {
        return res.status(409).json({
          success: false,
          error: lockResult.error,
          retry_after: lockResult.retry_after
        });
      }

      // Store lock info for cleanup
      res.locals.entityLock = {
        entityType,
        entityId,
        sessionId
      };

      // Cleanup lock when response finishes
      res.on('finish', async () => {
        await entityLockManager.releaseLock(entityType, entityId, sessionId);
      });

      next();

    } catch (error) {
      console.error('Lock acquisition error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to acquire entity lock'
      });
    }
  };
}

// Optimistic locking for database updates
export interface OptimisticLockResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  conflictedFields?: string[];
  currentVersion?: number;
}

export async function withOptimisticLock<T>(
  tableName: string,
  entityId: number | string,
  expectedVersion: number,
  updateFn: (currentData: any) => Promise<T>,
  db: any
): Promise<OptimisticLockResult<T>> {
  try {
    // Get current data with version
    const currentData = await db.get(
      `SELECT *, updated_at FROM ${tableName} WHERE id = ?`,
      [entityId]
    );

    if (!currentData) {
      return {
        success: false,
        error: 'Entity not found'
      };
    }

    // Check if data has been modified (simple timestamp check)
    const currentTimestamp = new Date(currentData.updated_at).getTime();
    const expectedTimestamp = expectedVersion;

    if (currentTimestamp > expectedTimestamp) {
      return {
        success: false,
        error: 'Entity has been modified by another process',
        currentVersion: currentTimestamp
      };
    }

    // Perform update
    const result = await updateFn(currentData);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('Optimistic lock error:', error);
    return {
      success: false,
      error: 'Update failed'
    };
  }
}