
export interface IPropertyPaneItemLimitProps {
    onChange : (propertyPath: string, newValue: any) => void,
    key: string,
    label:string
    controlId:string;
    value:string;
}