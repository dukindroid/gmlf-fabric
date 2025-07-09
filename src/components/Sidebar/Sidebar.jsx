import { useState } from 'react';
import SearchComponent from '../SearchComponent/SearchComponent.jsx';
import './Sidebar.css';

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
      <div key={item.id} className="menu-item">
        <div
          className={`menu-item-header ${isSelected ? 'selected' : ''} ${isDocument ? 'document' : ''}`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => handleItemClick(item)}
        >
          <div className="menu-item-content">
            {item.icon && <span className="icon">{item.icon}</span>}
            <span className="title">{item.title}</span>
          </div>
          {hasChildren && (
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▶
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="header">
        <h2>Mining Equipment Documentation</h2>
      </div>
      <div className="search-section">
        <SearchComponent onResultSelect={onItemSelect} />
      </div>
      <div className="menu">
        {menuStructure.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;