import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import DocumentViewer from './components/DocumentViewer/DocumentViewer.jsx'
import { menuStructure } from './data/documentSummaries.js'
import './App.css'

function App() {
  const [selectedItem, setSelectedItem] = useState(null)

  const handleItemSelect = (item) => {
    setSelectedItem(item)
  }

  return (
    <div className="app">
      <div className="layout">
        <Sidebar 
          menuStructure={menuStructure} 
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
        />
        <DocumentViewer selectedItem={selectedItem} />
      </div>
    </div>
  )
}

export default App