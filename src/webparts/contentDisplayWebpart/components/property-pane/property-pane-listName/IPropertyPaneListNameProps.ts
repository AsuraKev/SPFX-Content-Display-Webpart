
export interface IPropertyPaneListNameProps {
    onChange: (propertyPath: string, newValue: any) => void,
    key: string,
    label: string
    controlId: string;
    value: string;
    validate:(value:string) => Promise<string>
}