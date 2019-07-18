import { IDisplayTemplate } from './../../../models/IDisplayTemplate';

export interface IPropertyPaneTemplatePickerProps{
    onChange: (propertyPath: string, newValue: any | any[]) => void;
    key: string;
    selectedTemplate: string;
    getTemplates:() => IDisplayTemplate[];
}