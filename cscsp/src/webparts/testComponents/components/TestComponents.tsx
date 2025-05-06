import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './TestComponents.module.scss';
import { ITestComponentsProps } from './ITestComponentsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ProjectCard } from '../../../controls/ProjectCard/ProjectCard';
import { ProjectDashboard } from '../../../controls/ProjectDashboard/ProjectDashboard';
import { IProjectCardProps } from '../../../controls/ProjectCard/IProjectCardProps';
import { IProjectDashboardProps } from '../../../controls/ProjectDashboard/IProjectDashboardProps';
import { SPHttpClient, SPHttpClientResponse, HttpClientResponse } from '@microsoft/sp-http';
import { Log } from '@microsoft/sp-core-library';

// Define a logger for the component
const LOG_SOURCE: string = 'TestComponents';

// Schema validation interface
interface IProjectData {
  projectNumber: string;
  projectName: string;
  clientName: string;
  projectLocation: string;
  projectDescription: string;
  projectType: string;
  serviceType: string;
  estimatedRevenue: string;
  startDate: string;
  endDate: string;
  progress?: number;
  sharepointLibraryUrl?: string;
  laborHours: Record<string, number>;
  laborTimeline: any[];
  milestones: any[];
  documents: any[];
  specifications: {
    specificationFile?: string;
    drawingsFile?: string;
  };
}

// Function to validate the project data schema
const validateProjectData = (data: any): void => {
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
  } catch (e) {
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

const TestComponents: React.FC<ITestComponentsProps> = (props) => {
  const {
    jsonUrl,
    showProjectCard,
    showProjectDashboard,
    projectNumber,
    projectTitle,
    clientName,
    isDarkTheme,
    hasTeamsContext,
    userDisplayName,
    context
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<IProjectData | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  useEffect(() => {
    if (!jsonUrl) return;

    setIsLoading(true);
    setError(null);
    setPermissionError(false);

    Log.info(LOG_SOURCE, `Loading project data from: ${jsonUrl}`, context.serviceScope);

    // Determine if the URL is a SharePoint URL or an external URL
    const isSharePointUrl = jsonUrl.toLowerCase().indexOf(context.pageContext.web.absoluteUrl.toLowerCase()) !== -1;

    if (isSharePointUrl) {
      // Use SPHttpClient for SharePoint URLs
      context.spHttpClient.get(
        jsonUrl,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
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
      .then((data: IProjectData) => {
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
    } else {
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
        .then((data: IProjectData) => {
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
    const projectCardProps: IProjectCardProps = {
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
    const dashboardProps: IProjectDashboardProps = {
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
      return (
        <section className={`${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}`}>
          <div className={styles.loading}>
            <h2>Loading project data...</h2>
            <p>Fetching data from: {jsonUrl}</p>
          </div>
        </section>
      );
    }

    // Display permission error state
    if (permissionError) {
      return (
        <section className={`${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}`}>
          <div className={styles.error}>
            <h2>Permission Denied</h2>
            <p>You do not have permission to access the project data file.</p>
            <p>Please contact your SharePoint administrator to request access to:</p>
            <p><strong>{jsonUrl}</strong></p>
          </div>
        </section>
      );
    }

    // Display error state
    if (error) {
      return (
        <section className={`${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}`}>
          <div className={styles.error}>
            <h2>Error loading project data</h2>
            <p>{error}</p>
            <p>URL: {jsonUrl}</p>
          </div>
        </section>
      );
    }

    // If no JSON URL is provided, show a configuration message
    if (!jsonUrl) {
      return (
        <section className={`${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}`}>
          <div className={styles.welcome}>
            <h2>Welcome, {escape(userDisplayName)}!</h2>
            <div>Please configure a Project JSON URL in the web part properties.</div>
          </div>
        </section>
      );
    }

    // Use data from JSON if available, otherwise use fallback data
    let finalProjectCardProps: IProjectCardProps;
    let finalDashboardProps: IProjectDashboardProps;

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
          laborTimeline: projectData.laborTimeline.map(item => ({
            ...item,
            // Ensure dates are properly parsed if needed
          })),
          milestones: projectData.milestones.map(milestone => ({
            ...milestone,
            date: new Date(milestone.date)
          }))
        };

        // Handle large datasets for performance
        const paginatedDocuments = projectData.documents ?
          // If there are more than 20 documents per folder, only show the first 20
          projectData.documents.map(folder => ({
            ...folder,
            files: folder.files && folder.files.length > 20 ?
              folder.files.slice(0, 20).concat([{
                id: 'more',
                name: `... ${folder.files.length - 20} more files`,
                path: '',
                type: 'more'
              }]) :
              folder.files
          })) :
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
      } catch (err) {
        Log.error(LOG_SOURCE, new Error(`Error mapping JSON data: ${err.message}`), context.serviceScope);
        setError(`Error processing project data: ${err.message}`);
        // Fall back to hardcoded data
        finalProjectCardProps = projectCardProps;
        finalDashboardProps = dashboardProps;
      }
    } else {
      // Use fallback data
      finalProjectCardProps = projectCardProps;
      finalDashboardProps = dashboardProps;
    }

    return (
      <section className={`${styles.testComponents} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Welcome, {escape(userDisplayName)}!</h2>
          <div>
            {projectData
              ? `Project data loaded from: ${jsonUrl}`
              : "This web part demonstrates the CSC Project Controls components."}
          </div>
        </div>
        
        <div className={styles.controlsContainer}>
          {showProjectCard && (
            <div className={styles.componentSection}>
              <h3>Project Card Component</h3>
              <div className={styles.componentContainer}>
                <ProjectCard {...finalProjectCardProps} />
              </div>
            </div>
          )}
          
          {showProjectDashboard && (
            <div className={styles.componentSection}>
              <h3>Project Dashboard Component</h3>
              <div className={styles.componentContainer}>
                <ProjectDashboard {...finalDashboardProps} />
              </div>
            </div>
          )}
        </div>
      </section>
    );
};

export default TestComponents;