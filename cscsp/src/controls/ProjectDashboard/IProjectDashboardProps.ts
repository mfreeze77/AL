import { IProjectCardProps } from '../ProjectCard/IProjectCardProps';

export interface IDocument {
  id: string;
  name: string;
  path: string;
  type: string;
  content?: string;
}

export interface IFolder {
  id: string;
  name: string;
  files: IDocument[];
  subFolders?: IFolder[];
}

export interface IProjectDashboardProps {
  projectNumber: string;
  projectName: string;
  clientName: string;
  projectLocation: string;
  projectDescription: string;
  projectType: string;
  sharepointLibraryUrl?: string;
  projectCardProps: IProjectCardProps;
  documents?: IFolder[];
  specifications?: {
    specificationFile?: string;
    drawingsFile?: string;
  };
  className?: string;
  onFileSelect?: (file: IDocument) => void;
  onNoteSave?: (notes: string) => void;
}