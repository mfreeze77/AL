import * as React from 'react';
import { useState, useEffect } from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { IProjectDashboardProps, IDocument, IFolder } from './IProjectDashboardProps';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import styles from './ProjectDashboard.module.scss';

export const ProjectDashboard: React.FC<IProjectDashboardProps> = (props) => {
  const {
    projectNumber,
    projectName,
    clientName,
    projectLocation,
    projectDescription,
    projectType,
    sharepointLibraryUrl,
    projectCardProps,
    documents,
    specifications,
    className,
    onFileSelect,
    onNoteSave
  } = props;

  // State for active section
  const [activeSection, setActiveSection] = useState<string>('introduction');
  
  // State for project notes
  const [notes, setNotes] = useState<string>('');
  
  // State for document modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  
  // State for folder open/close
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'master-folder': true,
    'pending-changes-folder': false,
    'sales-folder': false,
    'booking-folder': false,
    'drawings-folder': false,
    'documents-folder': false,
    'communications-folder': false,
    'pictures-folder': false
  });
  
  // State for AI section
  const [selectedAiDocument, setSelectedAiDocument] = useState<string>('');
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiResults, setAiResults] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  // Handle navigation click
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };
  
  // Toggle folder open/close
  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  // Handle file click
  const handleFileClick = (file: IDocument) => {
    setSelectedDocument(file);
    setIsModalOpen(true);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };
  
  // Handle notes save
  const handleSaveNotes = () => {
    if (onNoteSave) {
      onNoteSave(notes);
    }
  };
  
  // Handle AI document analysis
  const handleAnalyzeDocument = () => {
    if (!selectedAiDocument) return;
    
    setIsAiLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiResults(`Analysis of document: ${selectedAiDocument}\n\nThis document contains information about the project specifications and requirements. Key points include:\n\n1. Project scope definition\n2. Technical requirements\n3. Timeline expectations\n4. Budget constraints`);
      setIsAiLoading(false);
    }, 2000);
  };
  
  // Handle AI document summarization
  const handleSummarizeDocument = () => {
    if (!selectedAiDocument) return;
    
    setIsAiLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiResults(`Summary of document: ${selectedAiDocument}\n\nThis document outlines the project specifications for ${projectName}, including scope, technical requirements, timeline, and budget. The project aims to deliver a comprehensive solution for ${clientName} at ${projectLocation}.`);
      setIsAiLoading(false);
    }, 2000);
  };
  
  // Handle AI question
  const handleAskQuestion = () => {
    if (!selectedAiDocument || !aiQuestion) return;
    
    setIsAiLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiResults(`Answer to: "${aiQuestion}"\n\nBased on the document ${selectedAiDocument}, the answer is that the project timeline is expected to be completed within 6 months from the start date, with key milestones at months 2, 4, and 6.`);
      setIsAiLoading(false);
    }, 2000);
  };

  return (
    <div className={`${styles.projectDashboard} ${className || ''}`}>
      {/* Header with Logo */}
      <div className={styles.headerContainer}>
        <img 
          src="https://controlservice.com/wp-content/uploads/2018/07/CSC-logo_noInc_white-black_072318_175x146.png" 
          alt="Control Service Company" 
          className={styles.cscLogo}
        />
        <h1 className={styles.headerSubtitle}>
          A comprehensive guide for {projectNumber} {projectName}
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className={styles.mainNavigation}>
        <a 
          href="#introduction" 
          className={`${styles.navItem} ${activeSection === 'introduction' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('introduction');
          }}
        >
          Introduction
        </a>
        <a 
          href="#timeline" 
          className={`${styles.navItem} ${activeSection === 'timeline' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('timeline');
          }}
        >
          Project Timeline
        </a>
        <a 
          href="#documents" 
          className={`${styles.navItem} ${activeSection === 'documents' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('documents');
          }}
        >
          Documentation
        </a>
        <a 
          href="#specifications" 
          className={`${styles.navItem} ${activeSection === 'specifications' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('specifications');
          }}
        >
          Specifications
        </a>
        <a 
          href="#progress" 
          className={`${styles.navItem} ${activeSection === 'progress' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('progress');
          }}
        >
          Progress
        </a>
        <a 
          href="#ai-assistant" 
          className={`${styles.navItem} ${activeSection === 'ai-assistant' ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('ai-assistant');
          }}
        >
          AI Assistant
        </a>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="🔍 Search files..." />
        </div>
      </nav>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Introduction Section */}
        <section 
          id="introduction" 
          className={`${styles.section} ${activeSection === 'introduction' ? styles.active : ''}`}
        >
          <h2 className={styles.sectionTitle}>Introduction</h2>
          <div className={styles.projectOverview}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>Project Details</h3>
                <ul>
                  <li><strong>Project Name:</strong> {projectNumber} {projectName}</li>
                  <li><strong>Client:</strong> {clientName}</li>
                  <li><strong>Location:</strong> {projectLocation}</li>
                </ul>
              </div>
              <div className={styles.infoCard}>
                <h3>Project Overview</h3>
                <p>{projectDescription}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section 
          id="timeline" 
          className={`${styles.section} ${activeSection === 'timeline' ? styles.active : ''}`}
        >
          <h2 className={styles.sectionTitle}>Project Timeline & Labor Analysis</h2>
          <div className={styles.embeddedTimelineContainer}>
            <ProjectCard {...projectCardProps} />
          </div>
        </section>

        {/* Documents Section */}
        <section 
          id="documents" 
          className={`${styles.section} ${activeSection === 'documents' ? styles.active : ''}`}
        >
          <h2 className={styles.sectionTitle}>Project Documentation</h2>
          
          {/* SharePoint Document Library Status */}
          <div className={styles.sharepointStatus}>
            <p>SharePoint Document Library: <span>{sharepointLibraryUrl || 'Not configured'}</span></p>
            <p>
              {sharepointLibraryUrl 
                ? 'SharePoint integration is available.' 
                : 'SharePoint integration is not configured.'}
            </p>
          </div>
          
          {/* File browser container */}
          <div className={styles.repoSection}>
            {/* File operations UI */}
            <div className={`${styles.fileOperations} ${!sharepointLibraryUrl ? styles.extensionPlaceholder : ''}`}>
              {sharepointLibraryUrl ? (
                <>
                  <PrimaryButton>View Files</PrimaryButton>
                  <DefaultButton>Submit Changes</DefaultButton>
                  <DefaultButton>Approve Changes</DefaultButton>
                </>
              ) : (
                <>
                  <div className={styles.fileBtnPlaceholder}>View Files</div>
                  <div className={styles.fileBtnPlaceholder}>Submit Changes</div>
                  <div className={styles.fileBtnPlaceholder}>Approve Changes</div>
                  <p className={styles.placeholderMessage}>
                    Install the CSC Project Extension to enable document operations.
                  </p>
                </>
              )}
            </div>
            
            {/* File browser */}
            <div className={styles.folderStructure} data-drive-id={projectNumber}>
              {/* Render folders */}
              {['master', 'pending-changes', 'sales', 'booking', 'drawings', 'documents', 'communications', 'pictures'].map((folderName) => {
                const folderId = `${folderName}-folder`;
                return (
                  <div 
                    key={folderId} 
                    className={`${styles.folder} ${openFolders[folderId] ? styles.open : ''}`}
                    data-real-folder={folderName}
                  >
                    <div 
                      className={styles.folderHeader} 
                      onClick={() => toggleFolder(folderId)}
                    >
                      <div>
                        <span className={styles.folderIcon}>📁</span>
                        <span>{folderName.charAt(0).toUpperCase() + folderName.slice(1).replace('-', ' ')}</span>
                      </div>
                      <span className={styles.arrow}>▼</span>
                    </div>
                    <div className={styles.folderContent} id={`${folderName}-content`}>
                      {documents && documents.filter(f => f.id === folderName).length > 0 ? (
                        documents.filter(f => f.id === folderName)[0].files.map((file) => (
                          <div 
                            key={file.id} 
                            className={styles.file}
                            onClick={() => handleFileClick(file)}
                          >
                            <span className={styles.fileIcon}>📄</span>
                            <span>{file.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.loading}>
                          {`Loading ${folderName.replace('-', ' ')} files...`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Specifications Section */}
        <section 
          id="specifications" 
          className={`${styles.section} ${activeSection === 'specifications' ? styles.active : ''}`}
        >
          <h2 className={styles.sectionTitle}>Project Specifications</h2>
          <div className={styles.specsContainer}>
            <div className={styles.specsCard}>
              <h3>{projectType} Specifications</h3>
              <p>View the project specifications and requirements.</p>
              <button 
                className={styles.viewSpecsBtn}
                onClick={() => {
                  if (specifications?.specificationFile) {
                    // Handle file viewing
                    console.log('View specifications:', specifications.specificationFile);
                  }
                }}
              >
                View Specifications
              </button>
            </div>
            <div className={styles.specsCard}>
              <h3>Drawings</h3>
              <p>View the project drawings and plans.</p>
              <button 
                className={styles.viewSpecsBtn}
                onClick={() => {
                  if (specifications?.drawingsFile) {
                    // Handle file viewing
                    console.log('View drawings:', specifications.drawingsFile);
                  }
                }}
              >
                View Drawings
              </button>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section 
          id="progress" 
          className={`${styles.section} ${activeSection === 'progress' ? styles.active : ''}`}
        >
          <h2 className={styles.sectionTitle}>Project Progress</h2>
          <div className={styles.progressContainer}>
            <div className={styles.progressCard}>
              <h3>Project Notes</h3>
              <TextField
                multiline
                rows={10}
                value={notes}
                onChange={(_, newValue) => setNotes(newValue || '')}
                placeholder="Add your project notes here..."
              />
              <PrimaryButton onClick={handleSaveNotes}>Save Notes</PrimaryButton>
            </div>
            <div className={styles.progressCard}>
              <h3>File Viewer</h3>
              <div className={styles.fileViewer}>
                <p>Select a file from the Documents section to view it here.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Assistant Section */}
        <section 
          id="ai-assistant" 
          className={`${styles.section} ${activeSection === 'ai-assistant' ? styles.active : ''}`}
        >
          <div className={styles.sectionHeaderContainer}>
            <h2 className={styles.sectionTitle}>AI Assistant</h2>
            <div id="extension-status-container"></div>
          </div>
          <div className={`${styles.aiContainer} ${styles.aiGridContainer}`}>
            <div className={`${styles.aiCard} ${styles.aiGridItem}`}>
              <h3>Document Analysis</h3>
              <p>Select a document to analyze with AI:</p>
              <select 
                value={selectedAiDocument}
                onChange={(e) => setSelectedAiDocument(e.target.value)}
              >
                <option value="">-- Select a document --</option>
                {documents?.reduce((acc, folder) => {
                  return [
                    ...acc,
                    ...folder.files.map(file => (
                      <option key={file.id} value={file.path}>
                        {file.name}
                      </option>
                    ))
                  ];
                }, [] as React.ReactNode[])}
              </select>
              <div className={styles.aiActions}>
                <PrimaryButton 
                  onClick={handleAnalyzeDocument}
                  disabled={!selectedAiDocument}
                >
                  Analyze Document
                </PrimaryButton>
                <DefaultButton 
                  onClick={handleSummarizeDocument}
                  disabled={!selectedAiDocument}
                >
                  Summarize Document
                </DefaultButton>
              </div>
            </div>
            <div className={`${styles.aiCard} ${styles.aiGridItem}`}>
              <h3>Ask a Question</h3>
              <p>Ask a question about the selected document:</p>
              <TextField
                value={aiQuestion}
                onChange={(_, newValue) => setAiQuestion(newValue || '')}
                placeholder="Enter your question..."
                disabled={!selectedAiDocument}
              />
              <PrimaryButton 
                onClick={handleAskQuestion}
                disabled={!selectedAiDocument || !aiQuestion}
              >
                Ask Question
              </PrimaryButton>
            </div>
            <div className={`${styles.aiCard} ${styles.aiResultCard} ${styles.aiGridFull}`}>
              <h3>AI Results</h3>
              {isAiLoading ? (
                <div className={styles.aiLoading}>
                  <div className={styles.spinner}></div>
                  <p>Processing your request...</p>
                </div>
              ) : (
                <div id="ai-results">
                  {aiResults ? (
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {aiResults}
                    </pre>
                  ) : (
                    <p>Select a document and use one of the AI features to see results here.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Document Viewer Modal */}
      <Dialog
        hidden={!isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: selectedDocument?.name || 'Document Viewer'
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: '80%', width: '80%', maxHeight: '80vh' } }
        }}
      >
        <div style={{ minHeight: '300px', maxHeight: '60vh', overflow: 'auto' }}>
          {selectedDocument?.content || 'No content available for this document.'}
        </div>
        <DialogFooter>
          <PrimaryButton onClick={() => setIsModalOpen(false)}>Close</PrimaryButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProjectDashboard;