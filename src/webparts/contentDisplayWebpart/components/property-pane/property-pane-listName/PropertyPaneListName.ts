import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IPropertyPaneListNameProps } from './IPropertyPaneListNameProps';
import Text from '../../common/TextField/TextField';
export interface IPropertyPaneSiteUrlInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneListNameProps {

}

export default class PropertyPaneListName implements IPropertyPaneField<IPropertyPaneSiteUrlInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneSiteUrlInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneListNameProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onChange: properties.onChange,
            label: properties.label,
            onRender: this.render.bind(this),
            controlId: properties.controlId,
            value:properties.value,
            validate:properties.validate
        }
    }

    public render(elem: HTMLElement): void {
        const element: React.ReactElement<IPropertyPaneListNameProps> = React.createElement(Text, {
            onChange: this.onInputChange.bind(this),
            label: this.properties.label,
            value:this.properties.value,
            validate:this.properties.validate
        })
        ReactDom.render(element, elem);
    }

    public onInputChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.properties.onChange(this.targetProperty, newValue);
    }

}