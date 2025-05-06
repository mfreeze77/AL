declare interface ITestComponentsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
}

declare module 'TestComponentsWebPartStrings' {
  const strings: ITestComponentsWebPartStrings;
  export = strings;
}