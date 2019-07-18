import { IQueryFilter } from './IQueryFilter';
import { IContentType } from './IContentType';

export interface IQueryBag {
    itemLimit: string;
    recursiveEnabled: boolean;
    filters: IQueryFilter[];
    contentType: IContentType;
    orderBy: string;
    orderByDirection: string;
}