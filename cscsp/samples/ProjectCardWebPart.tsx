import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ProjectCardWebPartStrings';
import { ProjectCard } from '../../src/controls/ProjectCard/ProjectCard';
import { IProjectCardProps } from '../../src/controls/ProjectCard/IProjectCardProps';

export interface IProjectCardWebPartProps {
  projectNumber: string;
  projectTitle: string;
  businessName: string;
  estimatedRevenue: string;
  projectType: string;
  serviceType: string;
  startDate: string;
  endDate: string;
}

export default class ProjectCardWebPart extends BaseClientSideWebPart<IProjectCardWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    // Sample data for the project card
    const projectData: IProjectCardProps = {
      projectNumber: this.properties.projectNumber || "8603",
      title: this.properties.projectTitle || "Willard Hall Chem-Bio Reno BAS",
      businessName: this.properties.businessName || "University of Delaware",
      estimatedRevenue: this.properties.estimatedRevenue || "$1,250,000",
      projectType: this.properties.projectType || "Building Automation",
      serviceType: this.properties.serviceType || "Installation",
      startDate: new Date(this.properties.startDate || "2023-01-15"),
      endDate: new Date(this.properties.endDate || "2023-12-31"),
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

    const element: React.ReactElement<IProjectCardProps> = React.createElement(
      ProjectCard,
      projectData
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
                PropertyPaneTextField('projectTitle', {
                  label: 'Project Title'
                }),
                PropertyPaneTextField('businessName', {
                  label: 'Business Name'
                }),
                PropertyPaneTextField('estimatedRevenue', {
                  label: 'Estimated Revenue'
                })
              ]
            },
            {
              groupName: 'Project Details',
              groupFields: [
                PropertyPaneDropdown('projectType', {
                  label: 'Project Type',
                  options: [
                    { key: 'Building Automation', text: 'Building Automation' },
                    { key: 'HVAC', text: 'HVAC' },
                    { key: 'Security', text: 'Security' },
                    { key: 'Fire Alarm', text: 'Fire Alarm' }
                  ]
                }),
                PropertyPaneDropdown('serviceType', {
                  label: 'Service Type',
                  options: [
                    { key: 'Installation', text: 'Installation' },
                    { key: 'Maintenance', text: 'Maintenance' },
                    { key: 'Upgrade', text: 'Upgrade' },
                    { key: 'Consulting', text: 'Consulting' }
                  ]
                }),
                PropertyPaneTextField('startDate', {
                  label: 'Start Date (YYYY-MM-DD)'
                }),
                PropertyPaneTextField('endDate', {
                  label: 'End Date (YYYY-MM-DD)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}