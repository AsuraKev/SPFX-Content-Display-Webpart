import { QueryFilterFieldType } from '../enums/QueryFilterFieldType';

export interface IListField {
    InternalName: string;
    Title: string;
    TypeAsString: QueryFilterFieldType;
    Hidden:boolean;
    Group:string;
}