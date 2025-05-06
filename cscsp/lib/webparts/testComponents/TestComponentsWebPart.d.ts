import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface ITestComponentsWebPartProps {
    jsonUrl: string;
    showProjectCard: boolean;
    showProjectDashboard: boolean;
    projectNumber: string;
    projectTitle: string;
    clientName: string;
}
export default class TestComponentsWebPart extends BaseClientSideWebPart<ITestComponentsWebPartProps> {
    private _isDarkTheme;
    render(): void;
    protected onInit(): Promise<void>;
    private _getEnvironmentMessage;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=TestComponentsWebPart.d.ts.map