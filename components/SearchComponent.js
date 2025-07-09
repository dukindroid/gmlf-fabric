import { useState, useEffect } from 'react';
import { documentSummaries } from '../data/documentSummaries';
import styles from './SearchComponent.module.css';

const SearchComponent = ({ onResultSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      const results = performSearch(searchTerm);
      setSearchResults(results);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  const performSearch = (term) => {
    const results = [];
    const searchLower = term.toLowerCase();
    
    const searchInDocument = (doc, docId, category) => {
      const titleMatch = doc.title.toLowerCase().includes(searchLower);
      const summaryMatch = doc.summary.toLowerCase().includes(searchLower);
      const topicsMatch = doc.keyTopics.some(topic => topic.toLowerCase().includes(searchLower));
      const fileNameMatch = doc.fileName.toLowerCase().includes(searchLower);
      
      if (titleMatch || summaryMatch || topicsMatch || fileNameMatch) {
        results.push({
          id: docId,
          title: doc.title,
          fileName: doc.fileName,
          category: category,
          relevance: (titleMatch ? 3 : 0) + (summaryMatch ? 2 : 0) + (topicsMatch ? 1 : 0) + (fileNameMatch ? 1 : 0)
        });
      }
    };

    // Search in equipment manuals
    const equipment = documentSummaries.equipmentManuals;
    
    // Primary crushers
    Object.entries(equipment.primaryCrushers).forEach(([model, docs]) => {
      Object.entries(docs).forEach(([docType, doc]) => {
        const docId = `${model}-${docType.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        searchInDocument(doc, docId, `Primary Crushers > ${model}`);
      });
    });
    
    // Material handling
    Object.entries(equipment.materialHandling).forEach(([type, systems]) => {
      Object.entries(systems).forEach(([system, docs]) => {
        if (docs.title) {
          searchInDocument(docs, system, `Material Handling > ${type}`);
        } else {
          Object.entries(docs).forEach(([docType, doc]) => {
            searchInDocument(doc, docType, `Material Handling > ${type}`);
          });
        }
      });
    });

    // Technical drawings
    Object.entries(documentSummaries.technicalDrawings).forEach(([category, docs]) => {
      Object.entries(docs).forEach(([docId, doc]) => {
        searchInDocument(doc, docId, `Technical Drawings > ${category}`);
      });
    });

    // Operation & maintenance
    Object.entries(documentSummaries.operationMaintenance).forEach(([lang, docs]) => {
      Object.entries(docs).forEach(([docId, doc]) => {
        searchInDocument(doc, docId, `Operation & Maintenance > ${lang}`);
      });
    });

    // Installation documentation
    Object.entries(documentSummaries.installationDocumentation).forEach(([docId, doc]) => {
      searchInDocument(doc, docId, 'Installation Documentation');
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 8);
  };

  const handleResultClick = (result) => {
    onResultSelect({ id: result.id, type: 'document' });
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search documentation..."
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      
      {isOpen && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          {searchResults.map((result) => (
            <div
              key={result.id}
              className={styles.searchResult}
              onClick={() => handleResultClick(result)}
            >
              <div className={styles.resultTitle}>{result.title}</div>
              <div className={styles.resultCategory}>{result.category}</div>
              <div className={styles.resultFileName}>📄 {result.fileName}</div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && searchResults.length === 0 && searchTerm.trim().length > 2 && (
        <div className={styles.searchResults}>
          <div className={styles.noResults}>
            No documents found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;