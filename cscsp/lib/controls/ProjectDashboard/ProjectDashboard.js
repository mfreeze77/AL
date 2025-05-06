import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import styles from './ProjectDashboard.module.scss';
export const ProjectDashboard = (props) => {
    const { projectNumber, projectName, clientName, projectLocation, projectDescription, projectType, sharepointLibraryUrl, projectCardProps, documents, specifications, className, onFileSelect, onNoteSave } = props;
    // State for active section
    const [activeSection, setActiveSection] = useState('introduction');
    // State for project notes
    const [notes, setNotes] = useState('');
    // State for document modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    // State for folder open/close
    const [openFolders, setOpenFolders] = useState({
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
    const [selectedAiDocument, setSelectedAiDocument] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiResults, setAiResults] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    // Handle navigation click
    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
    };
    // Toggle folder open/close
    const toggleFolder = (folderId) => {
        setOpenFolders(prev => (Object.assign(Object.assign({}, prev), { [folderId]: !prev[folderId] })));
    };
    // Handle file click
    const handleFileClick = (file) => {
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
        if (!selectedAiDocument)
            return;
        setIsAiLoading(true);
        // Simulate AI processing
        setTimeout(() => {
            setAiResults(`Analysis of document: ${selectedAiDocument}\n\nThis document contains information about the project specifications and requirements. Key points include:\n\n1. Project scope definition\n2. Technical requirements\n3. Timeline expectations\n4. Budget constraints`);
            setIsAiLoading(false);
        }, 2000);
    };
    // Handle AI document summarization
    const handleSummarizeDocument = () => {
        if (!selectedAiDocument)
            return;
        setIsAiLoading(true);
        // Simulate AI processing
        setTimeout(() => {
            setAiResults(`Summary of document: ${selectedAiDocument}\n\nThis document outlines the project specifications for ${projectName}, including scope, technical requirements, timeline, and budget. The project aims to deliver a comprehensive solution for ${clientName} at ${projectLocation}.`);
            setIsAiLoading(false);
        }, 2000);
    };
    // Handle AI question
    const handleAskQuestion = () => {
        if (!selectedAiDocument || !aiQuestion)
            return;
        setIsAiLoading(true);
        // Simulate AI processing
        setTimeout(() => {
            setAiResults(`Answer to: "${aiQuestion}"\n\nBased on the document ${selectedAiDocument}, the answer is that the project timeline is expected to be completed within 6 months from the start date, with key milestones at months 2, 4, and 6.`);
            setIsAiLoading(false);
        }, 2000);
    };
    return (React.createElement("div", { className: `${styles.projectDashboard} ${className || ''}` },
        React.createElement("div", { className: styles.headerContainer },
            React.createElement("img", { src: "https://controlservice.com/wp-content/uploads/2018/07/CSC-logo_noInc_white-black_072318_175x146.png", alt: "Control Service Company", className: styles.cscLogo }),
            React.createElement("h1", { className: styles.headerSubtitle },
                "A comprehensive guide for ",
                projectNumber,
                " ",
                projectName)),
        React.createElement("nav", { className: styles.mainNavigation },
            React.createElement("a", { href: "#introduction", className: `${styles.navItem} ${activeSection === 'introduction' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('introduction');
                } }, "Introduction"),
            React.createElement("a", { href: "#timeline", className: `${styles.navItem} ${activeSection === 'timeline' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('timeline');
                } }, "Project Timeline"),
            React.createElement("a", { href: "#documents", className: `${styles.navItem} ${activeSection === 'documents' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('documents');
                } }, "Documentation"),
            React.createElement("a", { href: "#specifications", className: `${styles.navItem} ${activeSection === 'specifications' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('specifications');
                } }, "Specifications"),
            React.createElement("a", { href: "#progress", className: `${styles.navItem} ${activeSection === 'progress' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('progress');
                } }, "Progress"),
            React.createElement("a", { href: "#ai-assistant", className: `${styles.navItem} ${activeSection === 'ai-assistant' ? styles.active : ''}`, onClick: (e) => {
                    e.preventDefault();
                    handleNavClick('ai-assistant');
                } }, "AI Assistant"),
            React.createElement("div", { className: styles.searchContainer },
                React.createElement("input", { type: "text", placeholder: "\uD83D\uDD0D Search files..." }))),
        React.createElement("div", { className: styles.contentContainer },
            React.createElement("section", { id: "introduction", className: `${styles.section} ${activeSection === 'introduction' ? styles.active : ''}` },
                React.createElement("h2", { className: styles.sectionTitle }, "Introduction"),
                React.createElement("div", { className: styles.projectOverview },
                    React.createElement("div", { className: styles.infoGrid },
                        React.createElement("div", { className: styles.infoCard },
                            React.createElement("h3", null, "Project Details"),
                            React.createElement("ul", null,
                                React.createElement("li", null,
                                    React.createElement("strong", null, "Project Name:"),
                                    " ",
                                    projectNumber,
                                    " ",
                                    projectName),
                                React.createElement("li", null,
                                    React.createElement("strong", null, "Client:"),
                                    " ",
                                    clientName),
                                React.createElement("li", null,
                                    React.createElement("strong", null, "Location:"),
                                    " ",
                                    projectLocation))),
                        React.createElement("div", { className: styles.infoCard },
                            React.createElement("h3", null, "Project Overview"),
                            React.createElement("p", null, projectDescription))))),
            React.createElement("section", { id: "timeline", className: `${styles.section} ${activeSection === 'timeline' ? styles.active : ''}` },
                React.createElement("h2", { className: styles.sectionTitle }, "Project Timeline & Labor Analysis"),
                React.createElement("div", { className: styles.embeddedTimelineContainer },
                    React.createElement(ProjectCard, Object.assign({}, projectCardProps)))),
            React.createElement("section", { id: "documents", className: `${styles.section} ${activeSection === 'documents' ? styles.active : ''}` },
                React.createElement("h2", { className: styles.sectionTitle }, "Project Documentation"),
                React.createElement("div", { className: styles.sharepointStatus },
                    React.createElement("p", null,
                        "SharePoint Document Library: ",
                        React.createElement("span", null, sharepointLibraryUrl || 'Not configured')),
                    React.createElement("p", null, sharepointLibraryUrl
                        ? 'SharePoint integration is available.'
                        : 'SharePoint integration is not configured.')),
                React.createElement("div", { className: styles.repoSection },
                    React.createElement("div", { className: `${styles.fileOperations} ${!sharepointLibraryUrl ? styles.extensionPlaceholder : ''}` }, sharepointLibraryUrl ? (React.createElement(React.Fragment, null,
                        React.createElement(PrimaryButton, null, "View Files"),
                        React.createElement(DefaultButton, null, "Submit Changes"),
                        React.createElement(DefaultButton, null, "Approve Changes"))) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: styles.fileBtnPlaceholder }, "View Files"),
                        React.createElement("div", { className: styles.fileBtnPlaceholder }, "Submit Changes"),
                        React.createElement("div", { className: styles.fileBtnPlaceholder }, "Approve Changes"),
                        React.createElement("p", { className: styles.placeholderMessage }, "Install the CSC Project Extension to enable document operations.")))),
                    React.createElement("div", { className: styles.folderStructure, "data-drive-id": projectNumber }, ['master', 'pending-changes', 'sales', 'booking', 'drawings', 'documents', 'communications', 'pictures'].map((folderName) => {
                        const folderId = `${folderName}-folder`;
                        return (React.createElement("div", { key: folderId, className: `${styles.folder} ${openFolders[folderId] ? styles.open : ''}`, "data-real-folder": folderName },
                            React.createElement("div", { className: styles.folderHeader, onClick: () => toggleFolder(folderId) },
                                React.createElement("div", null,
                                    React.createElement("span", { className: styles.folderIcon }, "\uD83D\uDCC1"),
                                    React.createElement("span", null, folderName.charAt(0).toUpperCase() + folderName.slice(1).replace('-', ' '))),
                                React.createElement("span", { className: styles.arrow }, "\u25BC")),
                            React.createElement("div", { className: styles.folderContent, id: `${folderName}-content` }, documents && documents.filter(f => f.id === folderName).length > 0 ? (documents.filter(f => f.id === folderName)[0].files.map((file) => (React.createElement("div", { key: file.id, className: styles.file, onClick: () => handleFileClick(file) },
                                React.createElement("span", { className: styles.fileIcon }, "\uD83D\uDCC4"),
                                React.createElement("span", null, file.name))))) : (React.createElement("div", { className: styles.loading }, `Loading ${folderName.replace('-', ' ')} files...`)))));
                    })))),
            React.createElement("section", { id: "specifications", className: `${styles.section} ${activeSection === 'specifications' ? styles.active : ''}` },
                React.createElement("h2", { className: styles.sectionTitle }, "Project Specifications"),
                React.createElement("div", { className: styles.specsContainer },
                    React.createElement("div", { className: styles.specsCard },
                        React.createElement("h3", null,
                            projectType,
                            " Specifications"),
                        React.createElement("p", null, "View the project specifications and requirements."),
                        React.createElement("button", { className: styles.viewSpecsBtn, onClick: () => {
                                if (specifications === null || specifications === void 0 ? void 0 : specifications.specificationFile) {
                                    // Handle file viewing
                                    console.log('View specifications:', specifications.specificationFile);
                                }
                            } }, "View Specifications")),
                    React.createElement("div", { className: styles.specsCard },
                        React.createElement("h3", null, "Drawings"),
                        React.createElement("p", null, "View the project drawings and plans."),
                        React.createElement("button", { className: styles.viewSpecsBtn, onClick: () => {
                                if (specifications === null || specifications === void 0 ? void 0 : specifications.drawingsFile) {
                                    // Handle file viewing
                                    console.log('View drawings:', specifications.drawingsFile);
                                }
                            } }, "View Drawings")))),
            React.createElement("section", { id: "progress", className: `${styles.section} ${activeSection === 'progress' ? styles.active : ''}` },
                React.createElement("h2", { className: styles.sectionTitle }, "Project Progress"),
                React.createElement("div", { className: styles.progressContainer },
                    React.createElement("div", { className: styles.progressCard },
                        React.createElement("h3", null, "Project Notes"),
                        React.createElement(TextField, { multiline: true, rows: 10, value: notes, onChange: (_, newValue) => setNotes(newValue || ''), placeholder: "Add your project notes here..." }),
                        React.createElement(PrimaryButton, { onClick: handleSaveNotes }, "Save Notes")),
                    React.createElement("div", { className: styles.progressCard },
                        React.createElement("h3", null, "File Viewer"),
                        React.createElement("div", { className: styles.fileViewer },
                            React.createElement("p", null, "Select a file from the Documents section to view it here."))))),
            React.createElement("section", { id: "ai-assistant", className: `${styles.section} ${activeSection === 'ai-assistant' ? styles.active : ''}` },
                React.createElement("div", { className: styles.sectionHeaderContainer },
                    React.createElement("h2", { className: styles.sectionTitle }, "AI Assistant"),
                    React.createElement("div", { id: "extension-status-container" })),
                React.createElement("div", { className: `${styles.aiContainer} ${styles.aiGridContainer}` },
                    React.createElement("div", { className: `${styles.aiCard} ${styles.aiGridItem}` },
                        React.createElement("h3", null, "Document Analysis"),
                        React.createElement("p", null, "Select a document to analyze with AI:"),
                        React.createElement("select", { value: selectedAiDocument, onChange: (e) => setSelectedAiDocument(e.target.value) },
                            React.createElement("option", { value: "" }, "-- Select a document --"), documents === null || documents === void 0 ? void 0 :
                            documents.reduce((acc, folder) => {
                                return [
                                    ...acc,
                                    ...folder.files.map(file => (React.createElement("option", { key: file.id, value: file.path }, file.name)))
                                ];
                            }, [])),
                        React.createElement("div", { className: styles.aiActions },
                            React.createElement(PrimaryButton, { onClick: handleAnalyzeDocument, disabled: !selectedAiDocument }, "Analyze Document"),
                            React.createElement(DefaultButton, { onClick: handleSummarizeDocument, disabled: !selectedAiDocument }, "Summarize Document"))),
                    React.createElement("div", { className: `${styles.aiCard} ${styles.aiGridItem}` },
                        React.createElement("h3", null, "Ask a Question"),
                        React.createElement("p", null, "Ask a question about the selected document:"),
                        React.createElement(TextField, { value: aiQuestion, onChange: (_, newValue) => setAiQuestion(newValue || ''), placeholder: "Enter your question...", disabled: !selectedAiDocument }),
                        React.createElement(PrimaryButton, { onClick: handleAskQuestion, disabled: !selectedAiDocument || !aiQuestion }, "Ask Question")),
                    React.createElement("div", { className: `${styles.aiCard} ${styles.aiResultCard} ${styles.aiGridFull}` },
                        React.createElement("h3", null, "AI Results"),
                        isAiLoading ? (React.createElement("div", { className: styles.aiLoading },
                            React.createElement("div", { className: styles.spinner }),
                            React.createElement("p", null, "Processing your request..."))) : (React.createElement("div", { id: "ai-results" }, aiResults ? (React.createElement("pre", { style: { whiteSpace: 'pre-wrap', fontFamily: 'inherit' } }, aiResults)) : (React.createElement("p", null, "Select a document and use one of the AI features to see results here.")))))))),
        React.createElement(Dialog, { hidden: !isModalOpen, onDismiss: () => setIsModalOpen(false), dialogContentProps: {
                type: DialogType.normal,
                title: (selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.name) || 'Document Viewer'
            }, modalProps: {
                isBlocking: false,
                styles: { main: { maxWidth: '80%', width: '80%', maxHeight: '80vh' } }
            } },
            React.createElement("div", { style: { minHeight: '300px', maxHeight: '60vh', overflow: 'auto' } }, (selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.content) || 'No content available for this document.'),
            React.createElement(DialogFooter, null,
                React.createElement(PrimaryButton, { onClick: () => setIsModalOpen(false) }, "Close")))));
};
export default ProjectDashboard;
//# sourceMappingURL=ProjectDashboard.js.map