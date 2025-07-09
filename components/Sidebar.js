import { useState } from 'react';
import SearchComponent from './SearchComponent';
import styles from './Sidebar.module.css';

const Sidebar = ({ menuStructure, onItemSelect, selectedItem }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpand = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item) => {
    if (item.type === 'document') {
      onItemSelect(item);
    } else if (item.children) {
      toggleExpand(item.id);
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedItem?.id === item.id;
    const isDocument = item.type === 'document';

    return (
      <div key={item.id} className={styles.menuItem}>
        <div
          className={`${styles.menuItemHeader} ${isSelected ? styles.selected : ''} ${isDocument ? styles.document : ''}`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => handleItemClick(item)}
        >
          <div className={styles.menuItemContent}>
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.title}>{item.title}</span>
          </div>
          {hasChildren && (
            <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
              ▶
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.submenu}>
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Mining Equipment Documentation</h2>
      </div>
      <div className={styles.searchSection}>
        <SearchComponent onResultSelect={onItemSelect} />
      </div>
      <div className={styles.menu}>
        {menuStructure.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;