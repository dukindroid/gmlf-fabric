/**
 * MemoryBank - Sistema principal de banco de memoria para el proyecto GMLF-Fabric
 * Gestiona el almacenamiento persistente, caché, historial y preferencias del usuario
 */

import { StorageManager } from './StorageManager.js';
import { CacheManager } from './CacheManager.js';
import { SearchIndex } from './SearchIndex.js';
import { UserPreferences } from './UserPreferences.js';

export class MemoryBank {
  constructor() {
    this.storage = new StorageManager();
    this.cache = new CacheManager();
    this.searchIndex = new SearchIndex();
    this.preferences = new UserPreferences();
    
    this.initialized = false;
    this.listeners = new Map();
    
    this.init();
  }

  /**
   * Inicializa el banco de memoria
   */
  async init() {
    try {
      await this.storage.init();
      await this.cache.init();
      await this.searchIndex.init();
      await this.preferences.init();
      
      this.initialized = true;
      this.emit('initialized');
      
      console.log('MemoryBank inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando MemoryBank:', error);
    }
  }

  /**
   * Registra la visita a un documento
   */
  visitDocument(documentId, documentData) {
    if (!this.initialized) return;

    const visitData = {
      id: documentId,
      timestamp: Date.now(),
      data: documentData,
      sessionId: this.getSessionId()
    };

    // Agregar al historial
    this.storage.addToHistory(visitData);
    
    // Actualizar caché
    this.cache.cacheDocument(documentId, documentData);
    
    // Actualizar índice de búsqueda
    this.searchIndex.indexDocument(documentId, documentData);
    
    // Emitir evento
    this.emit('documentVisited', visitData);
  }

  /**
   * Obtiene el historial de documentos visitados
   */
  getHistory(limit = 50) {
    return this.storage.getHistory(limit);
  }

  /**
   * Obtiene documentos favoritos
   */
  getFavorites() {
    return this.storage.getFavorites();
  }

  /**
   * Agrega un documento a favoritos
   */
  addToFavorites(documentId, documentData) {
    const result = this.storage.addToFavorites(documentId, documentData);
    this.emit('favoriteAdded', { documentId, documentData });
    return result;
  }

  /**
   * Remueve un documento de favoritos
   */
  removeFromFavorites(documentId) {
    const result = this.storage.removeFromFavorites(documentId);
    this.emit('favoriteRemoved', { documentId });
    return result;
  }

  /**
   * Verifica si un documento está en favoritos
   */
  isFavorite(documentId) {
    return this.storage.isFavorite(documentId);
  }

  /**
   * Realiza una búsqueda con memoria
   */
  search(query, options = {}) {
    // Registrar búsqueda
    this.storage.addToSearchHistory(query);
    
    // Realizar búsqueda
    const results = this.searchIndex.search(query, options);
    
    // Emitir evento
    this.emit('searchPerformed', { query, results, options });
    
    return results;
  }

  /**
   * Obtiene el historial de búsquedas
   */
  getSearchHistory(limit = 20) {
    return this.storage.getSearchHistory(limit);
  }

  /**
   * Obtiene sugerencias de búsqueda basadas en el historial
   */
  getSearchSuggestions(partialQuery) {
    return this.storage.getSearchSuggestions(partialQuery);
  }

  /**
   * Agrega una nota a un documento
   */
  addNote(documentId, note) {
    const noteData = {
      id: this.generateId(),
      documentId,
      content: note,
      timestamp: Date.now()
    };
    
    const result = this.storage.addNote(noteData);
    this.emit('noteAdded', noteData);
    return result;
  }

  /**
   * Obtiene las notas de un documento
   */
  getNotes(documentId) {
    return this.storage.getNotes(documentId);
  }

  /**
   * Obtiene estadísticas de uso
   */
  getUsageStats() {
    return {
      totalVisits: this.storage.getTotalVisits(),
      totalSearches: this.storage.getTotalSearches(),
      mostVisitedDocuments: this.storage.getMostVisitedDocuments(10),
      mostSearchedTerms: this.storage.getMostSearchedTerms(10),
      favoriteCount: this.storage.getFavoriteCount(),
      sessionStats: this.getSessionStats()
    };
  }

  /**
   * Obtiene estadísticas de la sesión actual
   */
  getSessionStats() {
    const sessionId = this.getSessionId();
    return this.storage.getSessionStats(sessionId);
  }

  /**
   * Obtiene recomendaciones de documentos
   */
  getRecommendations(currentDocumentId, limit = 5) {
    const history = this.getHistory(100);
    const favorites = this.getFavorites();
    
    // Algoritmo simple de recomendaciones basado en patrones de uso
    const recommendations = this.searchIndex.getRelatedDocuments(
      currentDocumentId, 
      history, 
      favorites, 
      limit
    );
    
    return recommendations;
  }

  /**
   * Limpia datos antiguos
   */
  cleanup(daysToKeep = 30) {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    this.storage.cleanupHistory(cutoffDate);
    this.storage.cleanupSearchHistory(cutoffDate);
    this.cache.cleanup();
    
    this.emit('cleanupCompleted', { daysToKeep });
  }

  /**
   * Exporta todos los datos del usuario
   */
  exportUserData() {
    return {
      history: this.getHistory(),
      favorites: this.getFavorites(),
      searchHistory: this.getSearchHistory(),
      notes: this.storage.getAllNotes(),
      preferences: this.preferences.getAll(),
      stats: this.getUsageStats(),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Importa datos del usuario
   */
  importUserData(data) {
    try {
      if (data.history) this.storage.importHistory(data.history);
      if (data.favorites) this.storage.importFavorites(data.favorites);
      if (data.searchHistory) this.storage.importSearchHistory(data.searchHistory);
      if (data.notes) this.storage.importNotes(data.notes);
      if (data.preferences) this.preferences.importAll(data.preferences);
      
      this.emit('dataImported', data);
      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  }

  /**
   * Sistema de eventos
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener de evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * Utilidades
   */
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene el estado del banco de memoria
   */
  getStatus() {
    return {
      initialized: this.initialized,
      storageSize: this.storage.getSize(),
      cacheSize: this.cache.getSize(),
      sessionId: this.getSessionId(),
      uptime: Date.now() - (this.initTime || Date.now())
    };
  }
}

// Instancia singleton
let memoryBankInstance = null;

export const getMemoryBank = () => {
  if (!memoryBankInstance) {
    memoryBankInstance = new MemoryBank();
  }
  return memoryBankInstance;
};

export default MemoryBank;
