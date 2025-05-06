import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'TestComponentsWebPartStrings';
import TestComponents from './components/TestComponents';
import { ITestComponentsProps } from './components/ITestComponentsProps';

export interface ITestComponentsWebPartProps {
  jsonUrl: string;
  showProjectCard: boolean;
  showProjectDashboard: boolean;
  projectNumber: string;
  projectTitle: string;
  clientName: string;
}

export default class TestComponentsWebPart extends BaseClientSideWebPart<ITestComponentsWebPartProps> {
  private _isDarkTheme: boolean = false;

  public render(): void {
    const element: React.ReactElement<ITestComponentsProps> = React.createElement(
      TestComponents,
      {
        jsonUrl: this.properties.jsonUrl,
        showProjectCard: this.properties.showProjectCard || true,
        showProjectDashboard: this.properties.showProjectDashboard || false,
        projectNumber: this.properties.projectNumber || "8603",
        projectTitle: this.properties.projectTitle || "Willard Hall Chem-Bio Reno BAS",
        clientName: this.properties.clientName || "University of Delaware",
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      // For future use
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
              groupName: "Data Source",
              groupFields: [
                PropertyPaneTextField('jsonUrl', {
                  label: 'Project JSON URL',
                  description: 'URL to the JSON file containing project data'
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('showProjectCard', {
                  label: 'Show Project Card'
                }),
                PropertyPaneToggle('showProjectDashboard', {
                  label: 'Show Project Dashboard'
                }),
                PropertyPaneTextField('projectNumber', {
                  label: 'Project Number (fallback)'
                }),
                PropertyPaneTextField('projectTitle', {
                  label: 'Project Title (fallback)'
                }),
                PropertyPaneTextField('clientName', {
                  label: 'Client Name (fallback)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}