# CSC Project Controls for SharePoint Framework

A library of React components for SharePoint Framework (SPFx) that provides project management UI components based on Fluent UI.

## Components

### ProjectCard

A component that displays project information, labor analysis charts, and milestones in a card format.

### ProjectDashboard

A comprehensive dashboard for project documentation and management, including:
- Project overview
- Timeline and labor analysis
- Document repository
- Specifications viewer
- Progress tracking
- AI assistant integration

## Installation

```bash
npm install csc-project-controls
```

## Usage

### ProjectCard Component

```tsx
import * as React from 'react';
import { ProjectCard } from 'csc-project-controls';

const MyProjectWebPart: React.FC = () => {
  const projectData = {
    projectNumber: "8603",
    title: "Willard Hall Chem-Bio Reno BAS",
    businessName: "University of Delaware",
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

  return (
    <div>
      <ProjectCard {...projectData} />
    </div>
  );
};

export default MyProjectWebPart;
```

### ProjectDashboard Component

```tsx
import * as React from 'react';
import { ProjectDashboard } from 'csc-project-controls';

const MyProjectDashboardWebPart: React.FC = () => {
  // Project card data from above example
  const projectCardProps = { /* ... */ };
  
  const dashboardProps = {
    projectNumber: "8603",
    projectName: "Willard Hall Chem-Bio Reno BAS",
    clientName: "University of Delaware",
    projectLocation: "Newark, DE",
    projectDescription: "Complete building automation system renovation for the Willard Hall Chemistry and Biology laboratories, including new controllers, sensors, and integration with the campus-wide BAS.",
    projectType: "Building Automation",
    sharepointLibraryUrl: "https://contoso.sharepoint.com/sites/projects/8603",
    projectCardProps: projectCardProps,
    documents: [
      {
        id: "master",
        name: "Master",
        files: [
          {
            id: "doc1",
            name: "Project Charter.docx",
            path: "/master/Project Charter.docx",
            type: "docx"
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
    ],
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

  return (
    <div>
      <ProjectDashboard {...dashboardProps} />
    </div>
  );
};

export default MyProjectDashboardWebPart;
```

## JSON-Driven Project Sites

The components now support loading project data from JSON files, enabling reuse across multiple SharePoint project sites.

### Using JSON Data Source

```tsx
import * as React from 'react';
import { TestComponents } from 'csc-project-controls';

const MyProjectWebPart: React.FC<IWebPartProps> = (props) => {
  return (
    <TestComponents
      jsonUrl="https://contoso.sharepoint.com/sites/projects/SiteAssets/project8603.json"
      showProjectCard={true}
      showProjectDashboard={true}
      context={props.context}
    />
  );
};
```

### JSON File Structure

```json
{
  "projectNumber": "8603",
  "projectName": "Willard Hall Chem-Bio Reno",
  "clientName": "University of Delaware",
  "projectLocation": "Newark, DE",
  "projectDescription": "Complete building automation system renovation...",
  "projectType": "Building Automation",
  "serviceType": "Installation",
  "estimatedRevenue": "$1,250,000",
  "startDate": "2023-01-15",
  "endDate": "2023-12-31",
  "progress": 65,
  "laborHours": {
    "Project Engineering": 450,
    "Design Engineering": 320
    // Additional labor categories...
  },
  "laborTimeline": [
    {
      "quarter": "Q1 2023",
      "Project Engineering": 120,
      "Design Engineering": 200,
      // Additional labor data...
    }
    // Additional quarters...
  ],
  "milestones": [
    {
      "id": "ms1",
      "name": "Project Kickoff",
      "date": "2023-01-15",
      "type": "start"
    }
    // Additional milestones...
  ],
  "documents": [
    {
      "id": "master",
      "name": "Master",
      "files": [
        {
          "id": "doc1",
          "name": "Project Charter.docx",
          "path": "/master/Project Charter.docx",
          "type": "docx"
        }
        // Additional files...
      ]
    }
    // Additional folders...
  ]
}
```

### Features

- **Dynamic Data Loading**: Load project data from SharePoint document libraries or external sources
- **Schema Validation**: Robust validation ensures data integrity
- **Error Handling**: Graceful handling of network, permission, and schema errors
- **Performance Optimizations**: Pagination for large document sets
- **Security**: Proper handling of SharePoint permissions

For detailed documentation, see [JSON-Driven Projects](./docs/json-driven-projects.md).

## Development

### Prerequisites

- Node.js v14+
- SharePoint Framework v1.16.1+

### Building the library

```bash
git clone https://github.com/yourusername/csc-project-controls.git
cd csc-project-controls
npm install
gulp build
```

### Testing in SPFx

1. Build the library
2. Copy the output from the `lib` folder to your SPFx project
3. Import the components in your web part

## License

MIT