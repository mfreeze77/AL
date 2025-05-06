import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ProjectDashboardWebPartStrings';
import { ProjectDashboard } from '../../src/controls/ProjectDashboard/ProjectDashboard';
import { IProjectDashboardProps } from '../../src/controls/ProjectDashboard/IProjectDashboardProps';
import { IProjectCardProps } from '../../src/controls/ProjectCard/IProjectCardProps';

export interface IProjectDashboardWebPartProps {
  projectNumber: string;
  projectName: string;
  clientName: string;
  projectLocation: string;
  projectDescription: string;
  projectType: string;
  sharepointLibraryUrl: string;
}

export default class ProjectDashboardWebPart extends BaseClientSideWebPart<IProjectDashboardWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    // Sample data for the project card
    const projectCardProps: IProjectCardProps = {
      projectNumber: this.properties.projectNumber || "8603",
      title: this.properties.projectName || "Willard Hall Chem-Bio Reno BAS",
      businessName: this.properties.clientName || "University of Delaware",
      estimatedRevenue: "$1,250,000",
      projectType: this.properties.projectType || "Building Automation",
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
      },
      {
        id: "documents",
        name: "Documents",
        files: [
          {
            id: "doc3",
            name: "Technical Specifications.docx",
            path: "/documents/Technical Specifications.docx",
            type: "docx",
            content: "This document contains detailed technical specifications for the project."
          },
          {
            id: "doc4",
            name: "Meeting Minutes.docx",
            path: "/documents/Meeting Minutes.docx",
            type: "docx",
            content: "Minutes from the project kickoff meeting on January 15, 2023."
          }
        ]
      }
    ];

    // Dashboard props
    const dashboardProps: IProjectDashboardProps = {
      projectNumber: this.properties.projectNumber || "8603",
      projectName: this.properties.projectName || "Willard Hall Chem-Bio Reno BAS",
      clientName: this.properties.clientName || "University of Delaware",
      projectLocation: this.properties.projectLocation || "Newark, DE",
      projectDescription: this.properties.projectDescription || "Complete building automation system renovation for the Willard Hall Chemistry and Biology laboratories, including new controllers, sensors, and integration with the campus-wide BAS.",
      projectType: this.properties.projectType || "Building Automation",
      sharepointLibraryUrl: this.properties.sharepointLibraryUrl || "https://contoso.sharepoint.com/sites/projects/8603",
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
        // In a real implementation, you would save this to SharePoint or another storage
      }
    };

    const element: React.ReactElement<IProjectDashboardProps> = React.createElement(
      ProjectDashboard,
      dashboardProps
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('projectNumber', {
                  label: 'Project Number'
                }),
                PropertyPaneTextField('projectName', {
                  label: 'Project Name'
                }),
                PropertyPaneTextField('clientName', {
                  label: 'Client Name'
                }),
                PropertyPaneTextField('projectLocation', {
                  label: 'Project Location'
                })
              ]
            },
            {
              groupName: 'Project Details',
              groupFields: [
                PropertyPaneTextField('projectDescription', {
                  label: 'Project Description',
                  multiline: true,
                  rows: 4
                }),
                PropertyPaneTextField('projectType', {
                  label: 'Project Type'
                }),
                PropertyPaneTextField('sharepointLibraryUrl', {
                  label: 'SharePoint Library URL'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}