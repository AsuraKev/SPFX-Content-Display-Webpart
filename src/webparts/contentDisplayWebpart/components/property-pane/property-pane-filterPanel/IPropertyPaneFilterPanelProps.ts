import { IWebPartContext } from '@microsoft/sp-webpart-base';

import { IQueryFilter } from '../../../models/IQueryFilter';
import { IListField } from '../../../models/IListField';
import { IPersonaProps, IBasePickerSuggestionsProps, Label } from 'office-ui-fabric-react';

export interface IPropertyPaneFilterPanelProps {
    key: string;
    existingfilters: IQueryFilter[];
    loadFilterFields: () => Promise<IListField[]>;
    fetchPeoplePickerSuggestion: (filterText: string, currentPersonas: any[], limitResults?: number) => Promise<any[]>;
    onFilterChange: (targetProperty: string, newValue: any | any[]) => {};
    siteUrl:string;
    listName:string;
}