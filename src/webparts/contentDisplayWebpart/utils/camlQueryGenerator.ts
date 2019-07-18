
import * as moment from 'moment';
import { Text } from '@microsoft/sp-core-library';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IPersonaProps, ITag } from 'office-ui-fabric-react';
import { IQueryBag } from '../models/IQueryBag';
import { IQueryFilter } from '../models/IQueryFilter';
import { QueryFilterOperator } from '../enums/QueryFilterOperator';
import { QueryFilterJoin } from '../enums/QueryFilterJoin';
import { QueryFilterFieldType } from '../enums/QueryFilterFieldType';
import { IListField } from '../models//IListField';

export default class CamlQueryGenerator {

    /**
     * Generates camlquery
     * @param queryBag 
     * @returns camlquery 
     */
    public static generateCAMLQuery(queryBag: IQueryBag, listType: number, listName: string): string {
        var query = '';
        var clonedFilters: IQueryFilter[] = [];
        clonedFilters = [...queryBag.filters];

        // Generates the Where clause (filters)
        if (clonedFilters) {

            let sortedFilters = clonedFilters
                .sort((a, b) => { return a.index - b.index; })
                .filter((f) => { return !this.isFilterEmpty(f); });

            // if there are content type specified then include content type as filters
            if (queryBag.contentType && queryBag.contentType.Id.StringValue !== 'All') {
                let contentTypeFilter: IQueryFilter = {
                    index: 9999999,
                    field: {
                        InternalName: 'ContentType',
                        TypeAsString: QueryFilterFieldType.ContentTypeId,

                    } as IListField,
                    operator: QueryFilterOperator.Eq,
                    value: queryBag.contentType.Name,
                    expression: null,
                    includeTime: false,
                    me: false,
                    join: QueryFilterJoin.And
                };
                sortedFilters.push(contentTypeFilter);
            }

            let fileViewField = ((listType === 1 && listName.toLowerCase() !== 'site pages') ? '<ViewFields><FieldRef Name="FileRef"></FieldRef> <FieldRef Name="FileLeafRef" /><FieldRef Name="File_x0020_Type" /><FieldRef Name="Author" /><FieldRef Name="Modified" /></ViewFields>' : '');
            let thankYouField = ((listType === 0 && listName.toLowerCase() === 'thank you') ? 
            `<ViewFields>
                <FieldRef Name="Title"/>
                <FieldRef Name="ID"/>
                <FieldRef Name="Details"/>
                <FieldRef Name="To"/>
                <FieldRef Name="From"/>
                <FieldRef Name="Value"/>
            </ViewFields>` : '');

            query += `<Where>${this.generateFilters(sortedFilters)}</Where>`;
            // this wont work with paging so fuck it
            if (queryBag.orderBy) {
                query += `<OrderBy><FieldRef Name="${queryBag.orderBy}" Ascending="${queryBag.orderByDirection === "Asc"}"/></OrderBy>`;
            }
            // Wraps the <Where /> and <OrderBy /> into a <Query /> tag
            query = `<Query>${query}</Query>`;
            query += `<RowLimit>${queryBag.itemLimit ? parseInt(queryBag.itemLimit) : ''}</RowLimit>`;
            query = `<View Scope="Recursive">${thankYouField}${fileViewField}${query}</View>`;
        }
        return query;
    }

    private static isFilterEmpty(filter: IQueryFilter): boolean {
        let isFilterEmpty = false;

        // If the filter has no field
        if (filter.field == null) {
            isFilterEmpty = true;
        }

        // If the filter has a null or empty value
        if (filter.value == null || isEmpty(filter.value.toString())) {

            // And has no date time expression
            if (isEmpty(filter.expression)) {

                // And isn't a [Me] switch
                if (!filter.me) {

                    // And isn't a <IsNull /> or <IsNotNull /> operator
                    if (filter.operator != QueryFilterOperator.IsNull && filter.operator != QueryFilterOperator.IsNotNull) {
                        isFilterEmpty = true;
                    }
                }
            }
        }
        return isFilterEmpty;
    }

    private static generateFilters(filters: IQueryFilter[]): string {

        // Store the generic filter format for later use
        let query = '';
        let filterXml = '';

        // Appends a CAML node for each filter
        let itemCount = 0;

        for (let filter of filters.reverse()) {
            filterXml = '<{0}><FieldRef Name="{1}" /><Value {2} Type="{3}">{4}</Value></{0}>';
            itemCount++;
            let specialAttribute = '';

            // Sets the special attribute if needed
            if (filter.field.TypeAsString === QueryFilterFieldType.DateTime) {
                specialAttribute = `IncludeTimeValue="${filter.includeTime}"`;
            }

            // If it's a <IsNull /> or <IsNotNull> filter
            if (filter.operator === QueryFilterOperator.IsNull || filter.operator === QueryFilterOperator.IsNotNull) {
                query += `<${QueryFilterOperator[filter.operator]}><FieldRef Name="${filter.field.InternalName}" /></${QueryFilterOperator[filter.operator]}>`;

            }

            // If it's a user filter
            else if (filter.field.TypeAsString === QueryFilterFieldType.User) {
                query += this.generateUserFilter(filter);
            }

            // If it's any other kind of filter (Text, DateTime, Lookup, Number etc...)
            else {
                let valueType = (filter.field.TypeAsString === QueryFilterFieldType.Lookup ? QueryFilterFieldType.Text : QueryFilterFieldType[filter.field.TypeAsString]);
                query += Text.format(filterXml, QueryFilterOperator[filter.operator], filter.field.InternalName, specialAttribute, valueType, this.formatFilterValue(filter));
            }

            // Appends the Join tags if needed
            if (itemCount >= 2) {
                query = `<And>` + query;
                query += `</And>`;
            }
        }


        return query;
    }

    private static formatFilterValue(filter: IQueryFilter): string {
        let filterValue = "";
        if (filter.field.TypeAsString === QueryFilterFieldType.DateTime) {
            filterValue = this.formatDateFilterValue(filter.value as string);
        } else {
            return filter.value.toString();
        }
        return filterValue;
    }


    private static generateUserFilter(filter: IQueryFilter): string {

        let filterOutput = '';
        let filterUsers = filter.value as IPersonaProps[];

        // if me is true
        if (filter.me) {
            filterOutput = `<Eq><FieldRef Name='${filter.field.InternalName}' /><Value Type='Integer'><UserID /></Value></Eq>`;
        }
        // if no value is present shouldnt happen tho
        else if (isEmpty(filter.value)) {
            return '';
        }

        else if (filter.operator == QueryFilterOperator.ContainsAny || filterUsers == null) {
            let values = filterUsers != null ? filterUsers.map(x => `<Value Type='Lookup'>${x.text}</Value>`).join('') : '';
            filterOutput = `<In><FieldRef Name='${filter.field.InternalName}' LookupId="True"/><Values>${values}</Values></In>`;
        } else {
            var filterValue = filter.value[0];
            filterOutput = `<${QueryFilterOperator[filter.operator]}><FieldRef Name='${filter.field.InternalName}' /><Value Type='User'>${filterValue.text}</Value></${QueryFilterOperator[filter.operator]}>`;
        }

        return filterOutput;
    }


    /*************************************************************************************************
    * Converts the specified serialized ISO date into the required string format
    * @param dateValue : A valid ISO 8601 date string
    *************************************************************************************************/
    private static formatDateFilterValue(dateValue: string): string {
        let date = moment(dateValue, moment.ISO_8601, true);

        if (date.isValid()) {
            dateValue = date.format("YYYY-MM-DDTHH:mm:ss\\Z");
        }
        return dateValue || '';
    }
}



