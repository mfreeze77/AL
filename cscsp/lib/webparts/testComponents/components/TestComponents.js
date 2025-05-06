import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './TestComponents.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { ProjectCard } from '../../../controls/ProjectCard/ProjectCard';
import { ProjectDashboard } from '../../../controls/ProjectDashboard/ProjectDashboard';
import { SPHttpClient } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';
// Define a logger for the component
const LOG_SOURCE = 'TestComponents';
// Function to validate the project data schema
const validateProjectData = (data) => {
    // Check required fields
    const requiredFields = [
        'projectNumber',
        'projectName',
        'clientName',
        'startDate',
        'endDate',
        'laborHours',
        'laborTimeline',
        'milestones'
    ];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        const errorMsg = `Missing required fields in JSON data: ${missingFields.join(', ')}`;
        throw new Error(errorMsg);
    }
    // Validate date formats
    try {
        new Date(data.startDate);
        new Date(data.endDate);
    }
    catch (e) {
        const errorMsg = 'Invalid date format in JSON data';
        throw new Error(errorMsg);
    }
    // Validate labor hours
    if (typeof data.laborHours !== 'object' || Object.keys(data.laborHours).length === 0) {
        const errorMsg = 'Invalid laborHours format in JSON data';
        throw new Error(errorMsg);
    }
    // Validate labor timeline
    if (!Array.isArray(data.laborTimeline) || data.laborTimeline.length === 0) {
        const errorMsg = 'Invalid laborTimeline format in JSON data';
        throw new Error(errorMsg);
    }
    // Validate milestones
    if (!Array.isArray(data.milestones) || data.milestones.length === 0) {
        const errorMsg = 'Invalid milestones format in JSON data';
        throw new Error(errorMsg);
    }
};
const TestComponents = (props) => {
    const { jsonUrl, showProjectCard, showProjectDashboard, projectNumber, projectTitle, clientName, isDarkTheme, hasTeamsContext, userDisplayName, context } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [permissionError, setPermissionError] = useState(false);
    useEffect(() => {
        if (!jsonUrl)
            return;
        setIsLoading(true);
        setError(null);
        setPermissionError(false);
        Log.info(LOG_SOURCE, `Loading project data from: ${jsonUrl}`, context.serviceScope);
        // Determine if the URL is a SharePoint URL or an external URL
        const isSharePointUrl = jsonUrl.toLowerCase().indexOf(context.pageContext.web.absoluteUrl.toLowerCase()) !== -1;
        if (isSharePointUrl) {
            // Use SPHttpClient for SharePoint URLs
            context.spHttpClient.get(jsonUrl, SPHttpClient.configurations.v1)
                .then((response) => {
                if (response.status === 403 || response.status === 401) {
                    Log.error(LOG_SOURCE, new Error(`Permission denied: ${response.status}`), context.serviceScope);
                    setPermissionError(true);
                    throw new Error('You do not have permission to access this file.');
                }
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
                .then((data) => {
                // Validate the JSON schema
                validateProjectData(data);
                Log.info(LOG_SOURCE, 'Project data loaded successfully', context.serviceScope);
                setProjectData(data);
                setIsLoading(false);
            })
                .catch(err => {
                Log.error(LOG_SOURCE, err, context.serviceScope);
                setError(`Failed to load project data: ${err.message}`);
                setIsLoading(false);
            });
        }
        else {
            // Use fetch for external URLs
            fetch(jsonUrl)
                .then(response => {
                if (response.status === 403 || response.status === 401) {
                    Log.error(LOG_SOURCE, new Error(`Permission denied: ${response.status}`), context.serviceScope);
                    setPermissionError(true);
                    throw new Error('You do not have permission to access this file.');
                }
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
                .then((data) => {
                // Validate the JSON schema
                validateProjectData(data);
                Log.info(LOG_SOURCE, 'Project data loaded successfully', context.serviceScope);
                setProjectData(data);
                setIsLoading(false);
            })
                .catch(err => {
                Log.error(LOG_SOURCE, err, context.serviceScope);
                setError(`Failed to load project data: ${err.message}`);
                setIsLoading(false);
            });
        }
    }, [jsonUrl, context]);
    // Sample data for the project card
    const projectCardProps = {
        projectNumber: projectNumber,
        title: projectTitle,
        businessName: clientName,
        estimatedRevenue: "$1,250,000",
        projectType: "Building Automation",
        serviceType: "Installation",
        startDate: new Date("2023-01-15"),
        endDate: new Date("2023-12-31"),
        laborHours: {
            "Project Engineering": 450,
            "Design Engineering": 320,
            "Software Engineering": 680,
            "Startup & Checkout": 240,
            "Electrical Install": 520,
            "Pneumatic Install": 180
        },
        laborTimeline: [
            {
                quarter: "Q1 2023",
                "Project Engineering": 120,
                "Design Engineering": 200,
                "Software Engineering": 80,
                "Startup & Checkout": 0,
                "Electrical Install": 40,
                "Pneumatic Install": 0,
                key_activities: [
                    "Initial project planning",
                    "Design specifications",
                    "Preliminary software architecture"
                ]
            },
            {
                quarter: "Q2 2023",
                "Project Engineering": 150,
                "Design Engineering": 120,
                "Software Engineering": 250,
                "Startup & Checkout": 0,
                "Electrical Install": 180,
                "Pneumatic Install": 60,
                key_activities: [
                    "Software development",
                    "Electrical installation begins",
                    "Pneumatic system installation"
                ]
            },
            {
                quarter: "Q3 2023",
                "Project Engineering": 100,
                "Design Engineering": 0,
                "Software Engineering": 250,
                "Startup & Checkout": 80,
                "Electrical Install": 300,
                "Pneumatic Install": 120,
                key_activities: [
                    "Software implementation",
                    "Complete electrical installation",
                    "Begin system testing"
                ]
            },
            {
                quarter: "Q4 2023",
                "Project Engineering": 80,
                "Design Engineering": 0,
                "Software Engineering": 100,
                "Startup & Checkout": 160,
                "Electrical Install": 0,
                "Pneumatic Install": 0,
                key_activities: [
                    "System integration",
                    "Final testing",
                    "Project handover"
                ]
            }
        ],
        milestones: [
            {
                id: "ms1",
                name: "Project Kickoff",
                date: new Date("2023-01-15"),
                type: "start"
            },
            {
                id: "ms2",
                name: "Design Approval",
                date: new Date("2023-03-10"),
                type: "completion"
            },
            {
                id: "ms3",
                name: "Installation Complete",
                date: new Date("2023-09-15"),
                type: "completion"
            },
            {
                id: "ms4",
                name: "System Testing",
                date: new Date("2023-10-20"),
                type: "testing"
            },
            {
                id: "ms5",
                name: "Project Handover",
                date: new Date("2023-12-15"),
                type: "completion"
            }
        ]
    };
    // Sample documents for the dashboard
    const documents = [
        {
            id: "master",
            name: "Master",
            files: [
                {
                    id: "doc1",
                    name: "Project Charter.docx",
                    path: "/master/Project Charter.docx",
                    type: "docx",
                    content: "This is a sample project charter document content."
                },
                {
                    id: "doc2",
                    name: "Requirements.xlsx",
                    path: "/master/Requirements.xlsx",
                    type: "xlsx"
                }
            ]
        },
        {
            id: "drawings",
            name: "Drawings",
            files: [
                {
                    id: "drw1",
                    name: "Floor Plans.pdf",
                    path: "/drawings/Floor Plans.pdf",
                    type: "pdf"
                },
                {
                    id: "drw2",
                    name: "Schematics.pdf",
                    path: "/drawings/Schematics.pdf",
                    type: "pdf"
                }
            ]
        }
    ];
    // Dashboard props
    const dashboardProps = {
        projectNumber: projectNumber,
        projectName: projectTitle,
        clientName: clientName,
        projectLocation: "Newark, DE",
        projectDescription: "Complete building automation system renovation for the Willard Hall Chemistry and Biology laboratories, including new controllers, sensors, and integration with the campus-wide BAS.",
        projectType: "Building Automation",
        sharepointLibraryUrl: "https://contoso.sharepoint.com/sites/projects/8603",
        projectCardProps: projectCardProps,
        documents: documents,
        specifications: {
            specificationFile: "/specifications/BAS Specifications.pdf",
            drawingsFile: "/drawings/BAS Drawings.pdf"
        },
        onFileSelect: (file) => {
            console.log("File selected:", file);
        },
        onNoteSave: (notes) => {
            console.log("Notes saved:", notes);
        }
    };
    // Display loading state
    if (isLoading) {
        return (React.createElement("section", { className: `${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}` },
            React.createElement("div", { className: styles.loading },
                React.createElement("h2", null, "Loading project data..."),
                React.createElement("p", null,
                    "Fetching data from: ",
                    jsonUrl))));
    }
    // Display permission error state
    if (permissionError) {
        return (React.createElement("section", { className: `${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}` },
            React.createElement("div", { className: styles.error },
                React.createElement("h2", null, "Permission Denied"),
                React.createElement("p", null, "You do not have permission to access the project data file."),
                React.createElement("p", null, "Please contact your SharePoint administrator to request access to:"),
                React.createElement("p", null,
                    React.createElement("strong", null, jsonUrl)))));
    }
    // Display error state
    if (error) {
        return (React.createElement("section", { className: `${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}` },
            React.createElement("div", { className: styles.error },
                React.createElement("h2", null, "Error loading project data"),
                React.createElement("p", null, error),
                React.createElement("p", null,
                    "URL: ",
                    jsonUrl))));
    }
    // If no JSON URL is provided, show a configuration message
    if (!jsonUrl) {
        return (React.createElement("section", { className: `${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}` },
            React.createElement("div", { className: styles.welcome },
                React.createElement("h2", null,
                    "Welcome, ",
                    escape(userDisplayName),
                    "!"),
                React.createElement("div", null, "Please configure a Project JSON URL in the web part properties."))));
    }
    // Use data from JSON if available, otherwise use fallback data
    let finalProjectCardProps;
    let finalDashboardProps;
    if (projectData) {
        try {
            // Map JSON data to component props with additional error handling
            finalProjectCardProps = {
                projectNumber: projectData.projectNumber,
                title: projectData.projectName,
                businessName: projectData.clientName,
                estimatedRevenue: projectData.estimatedRevenue || 'N/A',
                projectType: projectData.projectType || 'N/A',
                serviceType: projectData.serviceType || 'N/A',
                startDate: new Date(projectData.startDate),
                endDate: new Date(projectData.endDate),
                progress: projectData.progress,
                laborHours: projectData.laborHours,
                laborTimeline: projectData.laborTimeline.map(item => (Object.assign({}, item))),
                milestones: projectData.milestones.map(milestone => (Object.assign(Object.assign({}, milestone), { date: new Date(milestone.date) })))
            };
            // Handle large datasets for performance
            const paginatedDocuments = projectData.documents ?
                // If there are more than 20 documents per folder, only show the first 20
                projectData.documents.map(folder => (Object.assign(Object.assign({}, folder), { files: folder.files && folder.files.length > 20 ?
                        folder.files.slice(0, 20).concat([{
                                id: 'more',
                                name: `... ${folder.files.length - 20} more files`,
                                path: '',
                                type: 'more'
                            }]) :
                        folder.files }))) :
                [];
            finalDashboardProps = {
                projectNumber: projectData.projectNumber,
                projectName: projectData.projectName,
                clientName: projectData.clientName,
                projectLocation: projectData.projectLocation || 'N/A',
                projectDescription: projectData.projectDescription || 'No description available',
                projectType: projectData.projectType || 'N/A',
                sharepointLibraryUrl: projectData.sharepointLibraryUrl,
                projectCardProps: finalProjectCardProps,
                documents: paginatedDocuments,
                specifications: projectData.specifications || {},
                onFileSelect: (file) => {
                    Log.info(LOG_SOURCE, `File selected: ${file.name}`, context.serviceScope);
                    console.log("File selected:", file);
                },
                onNoteSave: (notes) => {
                    Log.info(LOG_SOURCE, `Notes saved: ${notes.substring(0, 50)}...`, context.serviceScope);
                    console.log("Notes saved:", notes);
                }
            };
            Log.info(LOG_SOURCE, 'Successfully mapped JSON data to component props', context.serviceScope);
        }
        catch (err) {
            Log.error(LOG_SOURCE, new Error(`Error mapping JSON data: ${err.message}`), context.serviceScope);
            setError(`Error processing project data: ${err.message}`);
            // Fall back to hardcoded data
            finalProjectCardProps = projectCardProps;
            finalDashboardProps = dashboardProps;
        }
    }
    else {
        // Use fallback data
        finalProjectCardProps = projectCardProps;
        finalDashboardProps = dashboardProps;
    }
    return (React.createElement("section", { className: `${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}` },
        React.createElement("div", { className: styles.welcome },
            React.createElement("h2", null,
                "Welcome, ",
                escape(userDisplayName),
                "!"),
            React.createElement("div", null, projectData
                ? `Project data loaded from: ${jsonUrl}`
                : "This web part demonstrates the CSC Project Controls components.")),
        React.createElement("div", { className: styles.controlsContainer },
            showProjectCard && (React.createElement("div", { className: styles.componentSection },
                React.createElement("h3", null, "Project Card Component"),
                React.createElement("div", { className: styles.componentContainer },
                    React.createElement(ProjectCard, Object.assign({}, finalProjectCardProps))))),
            showProjectDashboard && (React.createElement("div", { className: styles.componentSection },
                React.createElement("h3", null, "Project Dashboard Component"),
                React.createElement("div", { className: styles.componentContainer },
                    React.createElement(ProjectDashboard, Object.assign({}, finalDashboardProps))))))));
};
export default TestComponents;
//# sourceMappingURL=TestComponents.js.map