import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IDisplayTemplate } from '../../../models/IDisplayTemplate';
import { IPropertyPaneTemplatePickerProps } from './IPropertyPaneTemplatePickerProps';
import TemplatePicker from '../../common/templatePicker/TemplatePicker';

export interface IPropertyPaneTemplatePickerInternalProps extends IPropertyPaneTemplatePickerProps, IPropertyPaneCustomFieldProps {

}

export default class PropertyPaneTemplatePicker implements IPropertyPaneField<IPropertyPaneTemplatePickerInternalProps>{
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneTemplatePickerInternalProps;

    constructor(targetProperty: string, properties: IPropertyPaneTemplatePickerProps) {
        this.targetProperty = targetProperty;

        this.properties = {
            onChange: properties.onChange,
            key: properties.key,
            selectedTemplate: properties.selectedTemplate,
            onRender: this.render.bind(this),
            getTemplates: properties.getTemplates
        }
    }

    public render(elem: HTMLElement): void {
        const templatePicker = React.createElement(TemplatePicker, {
            onChange: this.handleTemplateChange.bind(this),
            selectedTemplate: this.properties.selectedTemplate,
            getTemplates:this.properties.getTemplates
        });
        ReactDom.render(templatePicker, elem);
    }

    private handleTemplateChange(templateId: string) {
        this.properties.onChange(this.targetProperty, templateId);
    }
}