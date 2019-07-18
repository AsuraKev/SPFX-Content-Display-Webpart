import { IContentType } from './../../../models/IContentType';
import { ITemplateBinding } from './../../../models/ITemplateBinding';
import { ListService } from '../../../services/ListService';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IListField } from '../../../models/IListField';
import { IListType } from '../../../models/IListType';
import { IListService } from '../../../services/interfaces/IListService';
import TemplateBindingPanel from './TemplateBindingPanel';

export interface IPropertyPaneTemplateBindingProps {
    key: string;
    onChange: (propertyPath: string, newValue: any | any[]) => void;
    template: string;
    getListFields: () => Promise<IListField[]>;
    listName: string;
    siteUrl: string;
    bindings: object;
    contentType:IContentType ;
    getListType:() => Promise<IListType>
}

export interface IPropertyPaneTemplateBindingInternalProps extends IPropertyPaneTemplateBindingProps, IPropertyPaneCustomFieldProps {

}

export default class PropertyPaneTemplateBinding implements IPropertyPaneField<IPropertyPaneTemplateBindingInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneTemplateBindingInternalProps;

    constructor(targetProperty: string, properties: IPropertyPaneTemplateBindingProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onRender: this.render.bind(this),
            onChange: properties.onChange,
            template: properties.template,
            getListFields: properties.getListFields,
            listName: properties.listName,
            siteUrl: properties.siteUrl,
            bindings: properties.bindings,
            contentType: properties.contentType,
            getListType: properties.getListType
        }
    }

    public render(elem: HTMLElement): void {
        const element = React.createElement(TemplateBindingPanel, {
            templateId: this.properties.template,
            getListFields: this.properties.getListFields,
            listName: this.properties.listName,
            siteUrl: this.properties.siteUrl,
            bindings: this.properties.bindings,
            onBindingChange: this.onBindingChange.bind(this),
            contentType: this.properties.contentType,
            getListType:this.properties.getListType
        });
        ReactDom.render(element, elem);
    }

    public onBindingChange(obj: object): void {
        this.properties.onChange(this.targetProperty, obj);
    }

}


