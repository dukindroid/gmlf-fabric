import { useState, useEffect } from 'react';
import { documentSummaries } from '../data/documentSummaries';
import styles from './DocumentViewer.module.css';

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
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h1>Mining Equipment Documentation System</h1>
          <p>Select a document from the sidebar to view its details and summary.</p>
          <div className={styles.overviewStats}>
            <div className={styles.stat}>
              <h3>21</h3>
              <p>Total Documents</p>
            </div>
            <div className={styles.stat}>
              <h3>4</h3>
              <p>Equipment Categories</p>
            </div>
            <div className={styles.stat}>
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
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Document not found</h2>
          <p>The selected document data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.documentHeader}>
        <div className={styles.titleSection}>
          <h1>{documentData.title}</h1>
          <div className={styles.metadata}>
            <span className={styles.fileName}>📄 {documentData.fileName}</span>
            <span className={styles.fileSize}>📊 {documentData.size}</span>
            {documentData.pages && (
              <span className={styles.pages}>📖 {documentData.pages} pages</span>
            )}
            {documentData.language && (
              <span className={styles.language}>🌐 {documentData.language}</span>
            )}
          </div>
        </div>
        <button className={styles.downloadButton} onClick={handleDownloadPDF}>
          📥 Open PDF
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>Summary</h2>
          <p>{documentData.summary}</p>
        </div>

        <div className={styles.keyTopics}>
          <h2>Key Topics</h2>
          <ul>
            {documentData.keyTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handleDownloadPDF}>
            📖 View Full Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;