import { useState, useEffect } from 'react';
import { documentSummaries } from '../../data/documentSummaries.js';
import './DocumentViewer.css';

const DocumentViewer = ({ selectedItem }) => {
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    if (selectedItem) {
      const docData = getDocumentData(selectedItem.id);
      setDocumentData(docData);
    }
  }, [selectedItem]);

  const getDocumentData = (itemId) => {
    const idToDataMap = {
      '2254830-owner': documentSummaries.equipmentManuals.primaryCrushers['2254830'].ownerManual,
      '2254830-parts': documentSummaries.equipmentManuals.primaryCrushers['2254830'].partsManual,
      '2254831-owner': documentSummaries.equipmentManuals.primaryCrushers['2254831'].ownerManual,
      '2254831-parts': documentSummaries.equipmentManuals.primaryCrushers['2254831'].partsManual,
      'p250-general': documentSummaries.equipmentManuals.primaryCrushers['P-250'].generalArrangement,
      'p250-structural': documentSummaries.equipmentManuals.primaryCrushers['P-250'].structuralAssembly,
      'p250-walkway': documentSummaries.equipmentManuals.primaryCrushers['P-250'].walkwayArrangement,
      'tf-series': documentSummaries.equipmentManuals.materialHandling.grizzlyFeeders.tfSeries,
      'tf4016387': documentSummaries.equipmentManuals.materialHandling.grizzlyFeeders.tf4016387,
      'bt48x9': documentSummaries.equipmentManuals.materialHandling.beltConveyors.bt48x9,
      'skid616': documentSummaries.technicalDrawings.installationPlans.skid616,
      'primary-crushing-spanish': documentSummaries.operationMaintenance.spanish.primaryCrushing,
      'installation-overview': documentSummaries.installationDocumentation.overview
    };

    return idToDataMap[itemId] || null;
  };

  const handleDownloadPDF = () => {
    if (documentData?.fileName) {
      const pdfUrl = `/docs/${documentData.fileName}`;
      window.open(pdfUrl, '_blank');
    }
  };

  if (!selectedItem) {
    return (
      <div className="container">
        <div className="welcome">
          <h1>Mining Equipment Documentation System</h1>
          <p>Select a document from the sidebar to view its details and summary.</p>
          <div className="overview-stats">
            <div className="stat">
              <h3>21</h3>
              <p>Total Documents</p>
            </div>
            <div className="stat">
              <h3>4</h3>
              <p>Equipment Categories</p>
            </div>
            <div className="stat">
              <h3>2</h3>
              <p>Languages</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="container">
        <div className="error">
          <h2>Document not found</h2>
          <p>The selected document data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="document-header">
        <div className="title-section">
          <h1>{documentData.title}</h1>
          <div className="metadata">
            <span className="filename">📄 {documentData.fileName}</span>
            <span className="filesize">📊 {documentData.size}</span>
            {documentData.pages && (
              <span className="pages">📖 {documentData.pages} pages</span>
            )}
            {documentData.language && (
              <span className="language">🌐 {documentData.language}</span>
            )}
          </div>
        </div>
        <button className="download-button" onClick={handleDownloadPDF}>
          📥 Open PDF
        </button>
      </div>

      <div className="content">
        <div className="summary">
          <h2>Summary</h2>
          <p>{documentData.summary}</p>
        </div>

        <div className="key-topics">
          <h2>Key Topics</h2>
          <ul>
            {documentData.keyTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

        <div className="actions">
          <button className="primary-button" onClick={handleDownloadPDF}>
            📖 View Full Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;