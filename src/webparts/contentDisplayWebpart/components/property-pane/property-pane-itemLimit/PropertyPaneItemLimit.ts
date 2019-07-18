import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IPropertyPaneItemLimitProps } from './IPropertyPaneItemLimitProps';
import Text from '../../common/TextField/TextField';

export interface IPropertyPaneItemLimitInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneItemLimitProps {

}

export default class PropertyPaneItemLimit implements IPropertyPaneField<IPropertyPaneItemLimitInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneItemLimitInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneItemLimitProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onChange: properties.onChange,
            label: properties.label,
            onRender: this.render.bind(this),
            controlId: properties.controlId,
            value:properties.value
        }
    }

    public render(elem: HTMLElement): void {
        const element: React.ReactElement<IPropertyPaneItemLimitProps> = React.createElement(Text, {
            onChange: this.onInputChange.bind(this),
            label: this.properties.label,
            value:this.properties.value
        })
        ReactDom.render(element, elem);
    }

    public onInputChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.properties.onChange(this.targetProperty, newValue);
    }

}