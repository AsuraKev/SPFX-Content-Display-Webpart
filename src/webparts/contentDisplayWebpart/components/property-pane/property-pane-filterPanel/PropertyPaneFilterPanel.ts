import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IPropertyPaneFilterPanelProps } from './IPropertyPaneFilterPanelProps';
import { IQueryFilter } from '../../../models/IQueryFilter';
import QueryFilterPanel from '../../queryFilterPanel/QueryFilterPanel';
import { IQueryFilterPanelProps } from '../../queryFilterPanel/QueryFilterPanel';
export interface IPropertyPaneFilterPanelInternalProps extends IPropertyPaneCustomFieldProps, IPropertyPaneFilterPanelProps {

}

export default class PropertyPanelFilterPanel implements IPropertyPaneField<IPropertyPaneFilterPanelInternalProps>{

    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneFilterPanelInternalProps;

    constructor(targetProperty: string, properties: IPropertyPaneFilterPanelProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            onRender: this.Render.bind(this),
            existingfilters: properties.existingfilters,
            loadFilterFields: properties.loadFilterFields,
            fetchPeoplePickerSuggestion: properties.fetchPeoplePickerSuggestion,
            onFilterChange: properties.onFilterChange,
            siteUrl: properties.siteUrl,
            listName: properties.listName
        }
    }

    public Render(elem: HTMLElement): void {

        const element = React.createElement(QueryFilterPanel, {
            existingfilters: this.properties.existingfilters,
            loadFilterFields: this.properties.loadFilterFields,
            fetchPeoplePickerSuggestion: this.properties.fetchPeoplePickerSuggestion,
            onFilterChange: this.handleFilterChange.bind(this),
            siteUrl: this.properties.siteUrl,
            listName: this.properties.listName
        });

        ReactDom.render(element, elem);
    }

    private handleFilterChange(filters: IQueryFilter[]): void {
        this.properties.onFilterChange(this.targetProperty, filters);
    }

}