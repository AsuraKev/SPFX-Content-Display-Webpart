import { IDisplayTemplate } from './../../../models/IDisplayTemplate';

export interface ITemplatePickerProps {
    selectedTemplate: string;
    onChange: (templateId: string) => void;
    getTemplates: () => IDisplayTemplate[];
} 