export interface IDisplayTemplate {
    Name: string;
    Id: string,
    Properties: Array<string>,
    Preview: string,
    MockPreview: () => any,
    Render: (mapping: object) => any,
    preferContainerWidth: string
}