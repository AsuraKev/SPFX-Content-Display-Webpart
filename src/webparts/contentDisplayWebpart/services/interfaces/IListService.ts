import { IList } from '../../models/IList';
import { IContentType } from '../../models/IContentType';
import { IListField } from '../../models/IListField';
import { IQueryBag } from '../../models/IQueryBag';
import { IListType } from '../../models/IListType';
import { IListItemsResult } from '../../models/IListItemsResult';
export interface IListService {
    getListContentTypes: (listName: string, siteUrl: string) => Promise<IContentType[]>
    getListFields: (listName: string, siteUrl: string) => Promise<IListField[]>
    getListItems: (queryBag: IQueryBag, listName: string, siteUrl: string, shouldIncludePaging:boolean, page: number) => Promise<IListItemsResult>
    getListType: (listName: string, siteUrl: string) => Promise<IListType>
    getList:(listName:string, siteUrl:string) => Promise<any>
    getAllItems:(queryBag: IQueryBag, listName: string, siteUrl: string) => Promise<any[]>
}