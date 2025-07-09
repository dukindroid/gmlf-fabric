import { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import DocumentViewer from '../components/DocumentViewer';
import { menuStructure } from '../data/documentSummaries';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Mining Equipment Documentation System</title>
        <meta name="description" content="Mining equipment manuals and documentation system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.layout}>
        <Sidebar 
          menuStructure={menuStructure} 
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
        />
        <DocumentViewer selectedItem={selectedItem} />
      </div>
    </div>
  );
}
