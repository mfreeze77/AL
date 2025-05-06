# JSON-Driven Project Sites

This document explains how to use the JSON-driven project sites feature with the ProjectCard and ProjectDashboard components.

## Overview

The ProjectCard and ProjectDashboard components can now be configured to load project data from a JSON file. This allows you to reuse the same components across multiple SharePoint project sites, with each site providing its own project-specific data.

## Deployment Readiness

Before deploying to production, ensure:

1. The solution package (.sppkg) is built and deployed to your SharePoint App Catalog
2. The web part is added to the App Catalog with appropriate permissions
3. The web part is tested in a real SharePoint site, not just the local workbench
4. JSON loading works within SharePoint's context using SPHttpClient
5. Cross-domain requests are properly handled if JSON files are hosted externally

## Configuration

### Web Part Configuration

1. Add the TestComponents web part to your SharePoint page
2. Edit the web part properties
3. In the "Data Source" section, enter the URL to your project JSON file in the "Project JSON URL" field
4. Configure which components to display (ProjectCard, ProjectDashboard, or both)
5. Save your changes

### JSON File Structure

Your JSON file should follow this structure:

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
  "sharepointLibraryUrl": "https://contoso.sharepoint.com/sites/projects/8603",
  
  "laborHours": {
    "Project Engineering": 450,
    "Design Engineering": 320,
    "Software Engineering": 680,
    "Startup & Checkout": 240,
    "Electrical Install": 520,
    "Pneumatic Install": 180
  },
  
  "laborTimeline": [
    {
      "quarter": "Q1 2023",
      "Project Engineering": 120,
      "Design Engineering": 200,
      "Software Engineering": 80,
      "Startup & Checkout": 0,
      "Electrical Install": 40,
      "Pneumatic Install": 0,
      "key_activities": [
        "Initial project planning",
        "Design specifications",
        "Preliminary software architecture"
      ]
    },
    // Additional quarters...
  ],
  
  "milestones": [
    {
      "id": "ms1",
      "name": "Project Kickoff",
      "date": "2023-01-15",
      "type": "start"
    },
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
          "type": "docx",
          "content": "This is a sample project charter document content."
        }
        // Additional files...
      ]
    }
    // Additional folders...
  ],
  
  "specifications": {
    "specificationFile": "/specifications/BAS Specifications.pdf",
    "drawingsFile": "/drawings/BAS Drawings.pdf"
  }
}
```

### Required Fields

The following fields are required:

- `projectNumber`: The project number
- `projectName`: The project name
- `clientName`: The client name
- `startDate`: The project start date (in ISO format)
- `endDate`: The project end date (in ISO format)
- `laborHours`: An object containing labor hours by category
- `laborTimeline`: An array of objects representing labor hours by quarter
- `milestones`: An array of milestone objects

### Optional Fields

The following fields are optional:

- `projectLocation`: The project location
- `projectDescription`: A description of the project
- `projectType`: The type of project
- `serviceType`: The type of service
- `estimatedRevenue`: The estimated revenue
- `progress`: The project progress (0-100)
- `sharepointLibraryUrl`: The URL to the SharePoint document library
- `documents`: An array of document folder objects
- `specifications`: An object containing specification file paths

## Hosting Your JSON File

You can host your JSON file in several locations:

1. **SharePoint Document Library**: Upload your JSON file to a document library in your SharePoint site and use the URL to that file.
   Example: `https://contoso.sharepoint.com/sites/projects/Shared%20Documents/project8603.json`

2. **SharePoint Site Assets**: Upload your JSON file to the Site Assets library.
   Example: `https://contoso.sharepoint.com/sites/projects/SiteAssets/project8603.json`

3. **External Web Server**: Host your JSON file on an external web server that allows CORS.
   Example: `https://api.example.com/projects/8603.json`

### Security & Permissions

When storing JSON files in SharePoint:

1. **Access Control**:
   - Store JSON files in libraries with appropriate permissions
   - Ensure users who need to view the web part have at least Read access to the JSON file
   - Consider using a dedicated library with controlled permissions for project data

2. **Permission Handling**:
   - The web part handles permission errors gracefully
   - Users without access to the JSON file will see a clear permission error message
   - The error message includes instructions to contact the SharePoint administrator

3. **Best Practices**:
   - Use read-only permissions for most users to prevent accidental modifications
   - Consider using approval workflows if JSON files need to be updated frequently
   - Document the permission requirements in your SharePoint governance documentation

## Schema Validation

The implementation includes robust schema validation to ensure data integrity:

1. **Required Fields Validation**:
   - The web part checks for all required fields in the JSON data
   - Missing required fields trigger a clear error message
   - The validation prevents runtime errors from incomplete data

2. **Data Type Validation**:
   - Date fields are validated to ensure they can be parsed correctly
   - Object and array structures are validated for correct format
   - Numeric values are handled appropriately

3. **Fallback Values**:
   - Optional fields have fallback values if not provided
   - For example, missing descriptions show "No description available"
   - This ensures the UI remains intact even with partial data

## Component Scalability

The implementation includes optimizations for handling large datasets:

1. **Document Pagination**:
   - Folders with more than 20 files are automatically paginated
   - A "more files" indicator shows the number of additional files
   - This prevents performance issues with large document libraries

2. **Performance Considerations**:
   - JSON data is loaded asynchronously to prevent UI blocking
   - Loading states provide feedback during data retrieval
   - Error states handle failures gracefully

3. **Large Project Support**:
   - The components can handle projects with extensive labor categories
   - Timeline visualizations scale appropriately with large datasets
   - Memory usage is optimized for SharePoint's environment

## Error Handling & Diagnostics

The components include comprehensive error handling and logging:

1. **Error Types**:
   - Network errors (JSON URL is invalid or inaccessible)
   - Permission errors (user lacks access to the JSON file)
   - Schema errors (JSON file is malformed or missing required fields)
   - Runtime errors (errors during data processing or rendering)

2. **Logging**:
   - All errors are logged using SharePoint's logging system
   - Success events are also logged for diagnostics
   - Log entries include contextual information for troubleshooting

3. **User Feedback**:
   - Clear error messages are displayed to the user
   - Different error types have specific error messages
   - Error messages include guidance on how to resolve the issue

## Sample JSON File

A sample JSON file is included in the project at:
`/src/webparts/testComponents/assets/sampleProject.json`

You can use this as a template for creating your own project JSON files.

## Testing

To test the JSON-driven functionality:

1. Upload the sample JSON file to your SharePoint site
2. Add the TestComponents web part to a page
3. Configure the web part to use the URL to your uploaded JSON file
4. Verify that the components display the data from the JSON file

## Multiple Component Support

The implementation supports both ProjectCard and ProjectDashboard components:

1. **Component Selection**:
   - The web part allows selecting which components to display
   - You can show ProjectCard, ProjectDashboard, or both
   - Each component uses the same JSON data source

2. **Data Sharing**:
   - The ProjectDashboard component includes the ProjectCard
   - Both components share the same data model
   - Updates to the JSON file affect both components consistently

3. **Independent Configuration**:
   - Each component can be styled independently
   - The web part properties control visibility of each component
   - This allows for flexible page layouts

## Troubleshooting

If you encounter issues:

1. Check that your JSON file is accessible from the SharePoint page
2. Verify that your JSON file follows the required structure
3. Check the browser console for any error messages
4. Ensure that dates are in ISO format (YYYY-MM-DD)
5. Verify that you have appropriate permissions to the JSON file
6. Check SharePoint logs for detailed error information
7. Try using the sample JSON file to verify the web part is working correctly
8. If using an external JSON source, ensure CORS is properly configured