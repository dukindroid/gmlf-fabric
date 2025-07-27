/**
 * StorageManager - Gestiona el almacenamiento persistente usando localStorage
 * Maneja historial, favoritos, búsquedas, notas y estadísticas
 */

export class StorageManager {
  constructor() {
    this.prefix = 'gmlf_memory_';
    this.keys = {
      history: `${this.prefix}history`,
      favorites: `${this.prefix}favorites`,
      searchHistory: `${this.prefix}search_history`,
      notes: `${this.prefix}notes`,
      stats: `${this.prefix}stats`,
      sessions: `${this.prefix}sessions`
    };
    
    this.maxHistoryItems = 1000;
    this.maxSearchHistory = 500;
  }

  /**
   * Inicializa el storage manager
   */
  async init() {
    try {
      // Verificar disponibilidad de localStorage
      if (!this.isLocalStorageAvailable()) {
        throw new Error('localStorage no está disponible');
      }

      // Inicializar estructuras de datos si no existen
      this.initializeStorage();
      
      console.log('StorageManager inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando StorageManager:', error);
      throw error;
    }
  }

  /**
   * Verifica si localStorage está disponible
   */
  isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Inicializa las estructuras de datos en localStorage
   */
  initializeStorage() {
    const defaultData = {
      [this.keys.history]: [],
      [this.keys.favorites]: {},
      [this.keys.searchHistory]: [],
      [this.keys.notes]: {},
      [this.keys.stats]: {
        totalVisits: 0,
        totalSearches: 0,
        documentVisits: {},
        searchTerms: {},
        createdAt: Date.now()
      },
      [this.keys.sessions]: {}
    };

    Object.entries(defaultData).forEach(([key, defaultValue]) => {
      if (!localStorage.getItem(key)) {
        this.setItem(key, defaultValue);
      }
    });
  }

  /**
   * Métodos de utilidad para localStorage
   */
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error obteniendo ${key}:`, error);
      return null;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error guardando ${key}:`, error);
      return false;
    }
  }

  /**
   * GESTIÓN DE HISTORIAL
   */
  addToHistory(visitData) {
    const history = this.getItem(this.keys.history) || [];
    
    // Remover visita anterior del mismo documento si existe
    const filteredHistory = history.filter(item => item.id !== visitData.id);
    
    // Agregar nueva visita al inicio
    filteredHistory.unshift(visitData);
    
    // Limitar el tamaño del historial
    if (filteredHistory.length > this.maxHistoryItems) {
      filteredHistory.splice(this.maxHistoryItems);
    }
    
    this.setItem(this.keys.history, filteredHistory);
    
    // Actualizar estadísticas
    this.updateVisitStats(visitData.id);
    
    return true;
  }

  getHistory(limit = 50) {
    const history = this.getItem(this.keys.history) || [];
    return history.slice(0, limit);
  }

  clearHistory() {
    this.setItem(this.keys.history, []);
    return true;
  }

  cleanupHistory(cutoffDate) {
    const history = this.getItem(this.keys.history) || [];
    const filteredHistory = history.filter(item => item.timestamp > cutoffDate);
    this.setItem(this.keys.history, filteredHistory);
    return true;
  }

  /**
   * GESTIÓN DE FAVORITOS
   */
  addToFavorites(documentId, documentData) {
    const favorites = this.getItem(this.keys.favorites) || {};
    
    favorites[documentId] = {
      ...documentData,
      addedAt: Date.now()
    };
    
    this.setItem(this.keys.favorites, favorites);
    return true;
  }

  removeFromFavorites(documentId) {
    const favorites = this.getItem(this.keys.favorites) || {};
    delete favorites[documentId];
    this.setItem(this.keys.favorites, favorites);
    return true;
  }

  getFavorites() {
    return this.getItem(this.keys.favorites) || {};
  }

  isFavorite(documentId) {
    const favorites = this.getFavorites();
    return documentId in favorites;
  }

  getFavoriteCount() {
    const favorites = this.getFavorites();
    return Object.keys(favorites).length;
  }

  /**
   * GESTIÓN DE HISTORIAL DE BÚSQUEDAS
   */
  addToSearchHistory(query) {
    if (!query || query.trim().length === 0) return false;
    
    const searchHistory = this.getItem(this.keys.searchHistory) || [];
    const normalizedQuery = query.trim().toLowerCase();
    
    // Remover búsqueda anterior si existe
    const filteredHistory = searchHistory.filter(
      item => item.query.toLowerCase() !== normalizedQuery
    );
    
    // Agregar nueva búsqueda al inicio
    filteredHistory.unshift({
      query: query.trim(),
      timestamp: Date.now()
    });
    
    // Limitar el tamaño
    if (filteredHistory.length > this.maxSearchHistory) {
      filteredHistory.splice(this.maxSearchHistory);
    }
    
    this.setItem(this.keys.searchHistory, filteredHistory);
    
    // Actualizar estadísticas
    this.updateSearchStats(normalizedQuery);
    
    return true;
  }

  getSearchHistory(limit = 20) {
    const searchHistory = this.getItem(this.keys.searchHistory) || [];
    return searchHistory.slice(0, limit);
  }

  getSearchSuggestions(partialQuery) {
    if (!partialQuery || partialQuery.length < 2) return [];
    
    const searchHistory = this.getSearchHistory(100);
    const normalizedPartial = partialQuery.toLowerCase();
    
    return searchHistory
      .filter(item => 
        item.query.toLowerCase().includes(normalizedPartial) &&
        item.query.toLowerCase() !== normalizedPartial
      )
      .map(item => item.query)
      .slice(0, 5);
  }

  cleanupSearchHistory(cutoffDate) {
    const searchHistory = this.getItem(this.keys.searchHistory) || [];
    const filteredHistory = searchHistory.filter(item => item.timestamp > cutoffDate);
    this.setItem(this.keys.searchHistory, filteredHistory);
    return true;
  }

  /**
   * GESTIÓN DE NOTAS
   */
  addNote(noteData) {
    const notes = this.getItem(this.keys.notes) || {};
    
    if (!notes[noteData.documentId]) {
      notes[noteData.documentId] = [];
    }
    
    notes[noteData.documentId].push(noteData);
    this.setItem(this.keys.notes, notes);
    
    return true;
  }

  getNotes(documentId) {
    const notes = this.getItem(this.keys.notes) || {};
    return notes[documentId] || [];
  }

  getAllNotes() {
    return this.getItem(this.keys.notes) || {};
  }

  removeNote(noteId) {
    const notes = this.getItem(this.keys.notes) || {};
    
    Object.keys(notes).forEach(documentId => {
      notes[documentId] = notes[documentId].filter(note => note.id !== noteId);
      if (notes[documentId].length === 0) {
        delete notes[documentId];
      }
    });
    
    this.setItem(this.keys.notes, notes);
    return true;
  }

  /**
   * GESTIÓN DE ESTADÍSTICAS
   */
  updateVisitStats(documentId) {
    const stats = this.getItem(this.keys.stats) || {};
    
    stats.totalVisits = (stats.totalVisits || 0) + 1;
    
    if (!stats.documentVisits) {
      stats.documentVisits = {};
    }
    
    stats.documentVisits[documentId] = (stats.documentVisits[documentId] || 0) + 1;
    
    this.setItem(this.keys.stats, stats);
  }

  updateSearchStats(query) {
    const stats = this.getItem(this.keys.stats) || {};
    
    stats.totalSearches = (stats.totalSearches || 0) + 1;
    
    if (!stats.searchTerms) {
      stats.searchTerms = {};
    }
    
    stats.searchTerms[query] = (stats.searchTerms[query] || 0) + 1;
    
    this.setItem(this.keys.stats, stats);
  }

  getTotalVisits() {
    const stats = this.getItem(this.keys.stats) || {};
    return stats.totalVisits || 0;
  }

  getTotalSearches() {
    const stats = this.getItem(this.keys.stats) || {};
    return stats.totalSearches || 0;
  }

  getMostVisitedDocuments(limit = 10) {
    const stats = this.getItem(this.keys.stats) || {};
    const documentVisits = stats.documentVisits || {};
    
    return Object.entries(documentVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([documentId, visits]) => ({ documentId, visits }));
  }

  getMostSearchedTerms(limit = 10) {
    const stats = this.getItem(this.keys.stats) || {};
    const searchTerms = stats.searchTerms || {};
    
    return Object.entries(searchTerms)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([term, count]) => ({ term, count }));
  }

  /**
   * GESTIÓN DE SESIONES
   */
  updateSessionStats(sessionId) {
    const sessions = this.getItem(this.keys.sessions) || {};
    
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        startTime: Date.now(),
        visits: 0,
        searches: 0,
        documentsViewed: new Set()
      };
    }
    
    sessions[sessionId].visits += 1;
    sessions[sessionId].lastActivity = Date.now();
    
    this.setItem(this.keys.sessions, sessions);
  }

  getSessionStats(sessionId) {
    const sessions = this.getItem(this.keys.sessions) || {};
    return sessions[sessionId] || null;
  }

  /**
   * UTILIDADES DE IMPORTACIÓN/EXPORTACIÓN
   */
  importHistory(historyData) {
    this.setItem(this.keys.history, historyData);
  }

  importFavorites(favoritesData) {
    this.setItem(this.keys.favorites, favoritesData);
  }

  importSearchHistory(searchHistoryData) {
    this.setItem(this.keys.searchHistory, searchHistoryData);
  }

  importNotes(notesData) {
    this.setItem(this.keys.notes, notesData);
  }

  /**
   * UTILIDADES GENERALES
   */
  getSize() {
    let totalSize = 0;
    
    Object.values(this.keys).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    
    return {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024 * 100) / 100,
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }

  clearAllData() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
    
    this.initializeStorage();
    return true;
  }

  getStorageInfo() {
    return {
      keys: this.keys,
      sizes: Object.fromEntries(
        Object.entries(this.keys).map(([name, key]) => [
          name,
          localStorage.getItem(key)?.length || 0
        ])
      ),
      totalSize: this.getSize()
    };
  }
}

export default StorageManager;
