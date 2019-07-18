import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IPropertyPaneChoiceGroupProps } from './IPropertyPaneChoiceGroupProps';
import ChoiceGroupField from '../../common/ChoiceGroup/ChoiceGroup';
import { IDropdownFieldProps } from '../../common/Dropdown/IDropdownProps';

export interface IPropertyPaneChoiceGroupInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneChoiceGroupProps {

}

export default class PropertyPaneChoiceGroup implements IPropertyPaneField<IPropertyPaneChoiceGroupInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneChoiceGroupInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneChoiceGroupProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onChange: properties.onChange,
            label: properties.label,
            onRender: this.render.bind(this),
            controlId: properties.controlId,
            selectedOption: properties.selectedOption,
            loadOption:properties.loadOption
        }

    }

    public render(elem: HTMLElement): void {
        const element: React.ReactElement<IPropertyPaneChoiceGroupProps> = React.createElement(ChoiceGroupField, {
            onChange: this.onOptionChange.bind(this),
            label: this.properties.label,
            selectedKey: this.properties.selectedOption,
            loadOption: this.properties.loadOption
        })
        ReactDom.render(element, elem);
    }

    public onOptionChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption): void {
        this.properties.onChange(this.targetProperty, option.key);
    }


}