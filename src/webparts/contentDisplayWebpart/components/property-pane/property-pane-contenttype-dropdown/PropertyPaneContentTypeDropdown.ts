
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IPropertyPaneContentTypeDropdownProps } from './IPropertyPaneContentTypeDropdownProps';
import DropdownField from '../../common/Dropdown/Dropdown';
import { IDropdownFieldProps } from '../../common/Dropdown/IDropdownProps';
import { IContentType } from '../../../models/IContentType';

export interface IPropertyPaneContentTypeDropdownInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneContentTypeDropdownProps {

}

export default class PropertyPaneContentTypeDropdown implements IPropertyPaneField<IPropertyPaneContentTypeDropdownInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneContentTypeDropdownInternalProps;
    private elem: HTMLElement;

    constructor(targetProperty: string, properties: IPropertyPaneContentTypeDropdownProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            loadOption: properties.loadOption,
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
            loadOption: this.properties.loadOption,
            onChange: this.onOptionChange.bind(this),
            label: this.properties.label,
            selectedKey: this.properties.selectedKey,
            listName:this.properties.listName,
            siteUrl:this.properties.siteUrl,
        })
        ReactDom.render(element, elem);
    }

    public onOptionChange(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index?: number): void {
        var contentType = {
            Name: option.text,
            Id: {
                StringValue: option.key
            }
        } as IContentType;

        this.properties.onChange(this.targetProperty, contentType);
    }

}