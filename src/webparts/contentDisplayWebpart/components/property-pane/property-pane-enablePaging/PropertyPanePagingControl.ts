import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import SwitchBox from '../../common/SwitchBox/SwitchBoxField';
import { IPropertyPanePagingControlProps } from './IPropertyPanePagingControlProps';

export interface IPropertyPanePagingControlInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPanePagingControlProps {

}

export default class PropertyPanePagingControl implements IPropertyPaneField<IPropertyPanePagingControlInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPanePagingControlInternalProps;

    constructor(targetProperty: string, properties: IPropertyPanePagingControlProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onRender: this.Render.bind(this),
            label: properties.key,
            onSwitchBoxValueChange: properties.onSwitchBoxValueChange,
            checked: properties.checked,
            disabled: properties.disabled
        }
    }

    public Render(elem: HTMLElement): void {

        const element = React.createElement(SwitchBox, {
            label: this.properties.label,
            checked: this.properties.checked,
            onChange: this.handleValueChange.bind(this),
            disabled: this.properties.disabled
        });

        ReactDom.render(element, elem);
    }

    private handleValueChange(event: React.MouseEvent<HTMLElement>, checked?: boolean): void {
        this.properties.onSwitchBoxValueChange(this.targetProperty, checked);
    }

}