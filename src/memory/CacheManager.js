/**
 * CacheManager - Gestiona el caché en memoria para optimizar el rendimiento
 * Implementa estrategias LRU (Least Recently Used) y TTL (Time To Live)
 */

export class CacheManager {
  constructor() {
    this.cache = new Map();
    this.accessTimes = new Map();
    this.maxSize = 100; // Máximo número de documentos en caché
    this.defaultTTL = 30 * 60 * 1000; // 30 minutos en milisegundos
    this.cleanupInterval = 5 * 60 * 1000; // Limpiar cada 5 minutos
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      cleanups: 0
    };
  }

  /**
   * Inicializa el cache manager
   */
  async init() {
    try {
      // Iniciar limpieza automática
      this.startCleanupTimer();
      
      console.log('CacheManager inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando CacheManager:', error);
      throw error;
    }
  }

  /**
   * Almacena un documento en caché
   */
  cacheDocument(documentId, documentData, ttl = this.defaultTTL) {
    const now = Date.now();
    
    // Crear entrada de caché
    const cacheEntry = {
      data: documentData,
      timestamp: now,
      ttl: ttl,
      expiresAt: now + ttl,
      accessCount: 1,
      lastAccessed: now
    };
    
    // Si el caché está lleno, remover el elemento menos usado
    if (this.cache.size >= this.maxSize && !this.cache.has(documentId)) {
      this.evictLeastRecentlyUsed();
    }
    
    // Agregar al caché
    this.cache.set(documentId, cacheEntry);
    this.accessTimes.set(documentId, now);
    
    return true;
  }

  /**
   * Obtiene un documento del caché
   */
  getDocument(documentId) {
    const cacheEntry = this.cache.get(documentId);
    
    if (!cacheEntry) {
      this.stats.misses++;
      return null;
    }
    
    const now = Date.now();
    
    // Verificar si ha expirado
    if (now > cacheEntry.expiresAt) {
      this.cache.delete(documentId);
      this.accessTimes.delete(documentId);
      this.stats.misses++;
      return null;
    }
    
    // Actualizar estadísticas de acceso
    cacheEntry.lastAccessed = now;
    cacheEntry.accessCount++;
    this.accessTimes.set(documentId, now);
    this.stats.hits++;
    
    return cacheEntry.data;
  }

  /**
   * Verifica si un documento está en caché y es válido
   */
  hasDocument(documentId) {
    const cacheEntry = this.cache.get(documentId);
    
    if (!cacheEntry) {
      return false;
    }
    
    // Verificar si ha expirado
    if (Date.now() > cacheEntry.expiresAt) {
      this.cache.delete(documentId);
      this.accessTimes.delete(documentId);
      return false;
    }
    
    return true;
  }

  /**
   * Remueve un documento específico del caché
   */
  removeDocument(documentId) {
    const removed = this.cache.delete(documentId);
    this.accessTimes.delete(documentId);
    return removed;
  }

  /**
   * Actualiza el TTL de un documento en caché
   */
  refreshDocument(documentId, newTTL = this.defaultTTL) {
    const cacheEntry = this.cache.get(documentId);
    
    if (cacheEntry) {
      const now = Date.now();
      cacheEntry.expiresAt = now + newTTL;
      cacheEntry.lastAccessed = now;
      this.accessTimes.set(documentId, now);
      return true;
    }
    
    return false;
  }

  /**
   * Precarga documentos relacionados
   */
  preloadRelatedDocuments(relatedDocuments) {
    const preloadPromises = relatedDocuments.map(doc => {
      return new Promise((resolve) => {
        // Simular carga asíncrona
        setTimeout(() => {
          if (!this.hasDocument(doc.id)) {
            this.cacheDocument(doc.id, doc.data, this.defaultTTL / 2); // TTL más corto para preload
          }
          resolve();
        }, 100);
      });
    });
    
    return Promise.all(preloadPromises);
  }

  /**
   * Estrategia LRU - Remueve el elemento menos recientemente usado
   */
  evictLeastRecentlyUsed() {
    let oldestTime = Date.now();
    let oldestKey = null;
    
    for (const [key, time] of this.accessTimes) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessTimes.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Limpia documentos expirados
   */
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [documentId, cacheEntry] of this.cache) {
      if (now > cacheEntry.expiresAt) {
        this.cache.delete(documentId);
        this.accessTimes.delete(documentId);
        cleanedCount++;
      }
    }
    
    this.stats.cleanups++;
    
    console.log(`Cache cleanup: ${cleanedCount} documentos expirados removidos`);
    return cleanedCount;
  }

  /**
   * Inicia el timer de limpieza automática
   */
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Detiene el timer de limpieza automática
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Limpia todo el caché
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.accessTimes.clear();
    
    console.log(`Cache cleared: ${size} documentos removidos`);
    return size;
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      currentSize: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Estima el uso de memoria del caché
   */
  getMemoryUsage() {
    let totalSize = 0;
    
    for (const [key, entry] of this.cache) {
      // Estimación aproximada del tamaño en bytes
      totalSize += JSON.stringify(entry).length;
      totalSize += key.length * 2; // Aproximación para strings UTF-16
    }
    
    return {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024 * 100) / 100,
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  /**
   * Obtiene información detallada del caché
   */
  getCacheInfo() {
    const entries = [];
    
    for (const [documentId, entry] of this.cache) {
      entries.push({
        documentId,
        timestamp: entry.timestamp,
        expiresAt: entry.expiresAt,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        isExpired: Date.now() > entry.expiresAt,
        timeToExpiry: Math.max(0, entry.expiresAt - Date.now())
      });
    }
    
    // Ordenar por último acceso (más reciente primero)
    entries.sort((a, b) => b.lastAccessed - a.lastAccessed);
    
    return {
      entries,
      stats: this.getStats(),
      config: {
        maxSize: this.maxSize,
        defaultTTL: this.defaultTTL,
        cleanupInterval: this.cleanupInterval
      }
    };
  }

  /**
   * Configura parámetros del caché
   */
  configure(options = {}) {
    if (options.maxSize && options.maxSize > 0) {
      this.maxSize = options.maxSize;
    }
    
    if (options.defaultTTL && options.defaultTTL > 0) {
      this.defaultTTL = options.defaultTTL;
    }
    
    if (options.cleanupInterval && options.cleanupInterval > 0) {
      this.cleanupInterval = options.cleanupInterval;
      
      // Reiniciar timer con nuevo intervalo
      this.stopCleanupTimer();
      this.startCleanupTimer();
    }
    
    return this.getCacheInfo().config;
  }

  /**
   * Obtiene el tamaño actual del caché
   */
  getSize() {
    return {
      count: this.cache.size,
      maxCount: this.maxSize,
      usage: this.getMemoryUsage()
    };
  }

  /**
   * Obtiene documentos más accedidos
   */
  getMostAccessedDocuments(limit = 10) {
    const entries = [];
    
    for (const [documentId, entry] of this.cache) {
      entries.push({
        documentId,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      });
    }
    
    return entries
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  /**
   * Destructor - limpia recursos
   */
  destroy() {
    this.stopCleanupTimer();
    this.clear();
    console.log('CacheManager destruido');
  }
}

export default CacheManager;
