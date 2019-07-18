
import { QueryFilterOperator } from '../enums/QueryFilterOperator';
import { QueryFilterJoin } from '../enums/QueryFilterJoin';
import { IPersonaProps, ITag } from 'office-ui-fabric-react';
import { IListField } from './IListField';

export interface IQueryFilter {
    /**
     * This field is used by when we add or remove a filter from list of filters
     * it tells us the position of the filter
     */
    index: number;

    /**
     * This is the sharepoint list field that we selected
     * it contains the following properties
     *  - Internal names
     *  - Display names
     *  - Type of field. e.g user, text ,lookup etc
     */
    field: IListField;

    /**
     *  This operator tells us which operator to use for the filter e.g eq, neq, contains etc
     */
    operator: QueryFilterOperator;

    /**
     * The actual value user specified for the filter
     */
    value: string | IPersonaProps[] | ITag[] | Date;

    /**
     *  The user may enter expression for the value
     */
    expression?: string;

    /**
     *  This is used when the field type is of datetime
     */
    includeTime?: boolean;

    /**
     *  This is used when the field type is user and filter by me 
     */
    me?: boolean;

    /**
     *  This is query joins e.g And , Or
     */
    join: QueryFilterJoin;

}