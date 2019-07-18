
import { IListItemsResult } from './../models/IListItemsResult';
import { IQueryBag } from './../models/IQueryBag';
import { IDisplayTemplate } from "../models/IDisplayTemplate";
import { IListField } from "../models/IListField";
import { IListType } from '../models/IListType';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IContentDisplayWebpartProps {
  description: string;
  absoluteUrl: string,
  listName: string,
  layouts: string;
  templateId: string;
  bindings: object;
  hasBindings: boolean;
  onNextPage: (shouldIncludePaging: boolean, page: number) => void;
  onPrevPage: (page: number) => void;
  fetchListItems: (shouldIncludePaging: boolean) => Promise<any[]>;
  template: IDisplayTemplate;
  configuredItems: any[];
  itemLimit: string;
  fetchResult: IListItemsResult;
  queryBag: IQueryBag;
  isFetching: boolean;
  fetchListFields: () => Promise<IListField[]>;
  listFields: IListField[];
  listType: IListType,
  enablePaging: boolean,
  getListType: () => Promise<IListType>;
  graphClient: MSGraphClient;
  siteId: string;
}
