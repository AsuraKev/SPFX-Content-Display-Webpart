
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IPropertyPaneOrderByDirectionProps } from './IPropertyPaneOrderByDirectionProps';
import DropdownField from '../../common/Dropdown/Dropdown';
import { IDropdownFieldProps } from '../../common/Dropdown/IDropdownProps';

export interface IPropertyPaneOrderByDirectionDropdownInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneOrderByDirectionProps {

}

export default class PropertyPaneOrderByDirectionDropdown implements IPropertyPaneField<IPropertyPaneOrderByDirectionDropdownInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneOrderByDirectionDropdownInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneOrderByDirectionProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onChange: properties.onChange,
            label: properties.label,
            onRender: this.render.bind(this),
            selectedKey: properties.selectedKey,
            listName:properties.listName,
            siteUrl:properties.siteUrl,
        }

    }

    public render(elem: HTMLElement): void {
        const element: React.ReactElement<IDropdownFieldProps> = React.createElement(DropdownField, {
            loadOption: null,
            onChange: this.onOptionChange.bind(this),
            label: this.properties.label,
            selectedKey: this.properties.selectedKey,
            listName:this.properties.listName,
            siteUrl:this.properties.siteUrl,
            defaultOptions: [{ text: 'Ascending', key: 'Asc' }, { text: 'Descending', key: 'Desc' }]
        })
        ReactDom.render(element, elem);
    }

    public onOptionChange(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index?: number): void {
        this.properties.onChange(this.targetProperty, option.key);
    }

}