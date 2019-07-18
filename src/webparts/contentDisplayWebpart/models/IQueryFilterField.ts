import { QueryFilterFieldType } from '../enums/QueryFilterFieldType';

export interface IQueryFilterField {
    internalName: string;
    displayName: string;
    type: QueryFilterFieldType;
}