import { IListItemsResult } from './../models/IListItemsResult';

import { IList } from '../models/IList';
import { IQueryBag } from '../models/IQueryBag';
import { IContentType } from '../models/IContentType';
import { IListField } from '../models/IListField';
import { IListService } from './interfaces/IListService';
import { IListType } from '../models/IListType';
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { Web, CamlQuery } from "@pnp/sp";
import { IContentDisplayWebpartMainProps } from '../ContentDisplayWebpartWebPart';
import CamlQueryGenerator from '../utils/camlQueryGenerator';
import LocalStorageHelper from '../utils/localStorage';
import { isEquivalent } from '../utils/common';


export class ListService implements IListService {

    public _nextPageInfo: string;
    private _siteUrl: string;
    private _listName: string;
    private _queryBag: IQueryBag;
    private _pagingInfo: any;
    private _listType: number;
    private _pageItems: {};

    constructor() {
        this._nextPageInfo = '';
        this._pagingInfo = {
            totalItemCount: 0,
            lastPage: 0,
            start: 0,
            end: 0,
            allItems: []
        }
    }

    /**
     * Gets list content types
     * @returns list content types 
     */
    public async getListContentTypes(listName: string, siteUrl: string): Promise<IContentType[]> {
        var web = new Web(siteUrl);
        var contentTypes = await web.lists.getByTitle(listName).contentTypes.get();
        return contentTypes;
    }

    /**
     * Get a list of fields
     * @returns list fields 
     */
    public async getListFields(listName: string, siteUrl: string): Promise<IListField[]> {
        var web = new Web(siteUrl);
        try {
            var fields = await web.lists.getByTitle(listName).fields.get();
            return fields;
        } catch (error) {
            throw new Error(error.message);
        }

    }

    public async getAllItems(queryBag: IQueryBag, listName: string, siteUrl: string): Promise<any[]> {
        var web = new Web(siteUrl);
        let queryBagClone = { ...queryBag };
        queryBagClone.itemLimit = "";
        try {
            let query: CamlQuery;
            let queryXml = CamlQueryGenerator.generateCAMLQuery(queryBagClone, this._listType, listName);
            query = {
                ViewXml: queryXml
            };
            var items = await web.lists.getByTitle(listName).getItemsByCAMLQuery(query);
            return items;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    private getFormattedRangeDisplay(items: any[], page: number, queryBag: IQueryBag): string {
        let allItems = this._pagingInfo.allItems
        let startIndex, lastIndex;
        startIndex = page;
        lastIndex = (parseInt(queryBag.itemLimit) > allItems.length) ? 1 : (Math.ceil(allItems.length / parseInt(queryBag.itemLimit)));
        return `${startIndex} - ${lastIndex}`;

    }

    private pageExist(key: string): boolean {
        let storage = LocalStorageHelper.getItem('pageItems');
        if (!storage) return false;
        if (storage[key]) return true;
        return false;
    }

    private getPageItems(key: string): any[] {
        let storage = LocalStorageHelper.getItem('pageItems');
        return storage[key];
    }

    public getListItems(queryBag: IQueryBag, listName: string, siteUrl: string, shouldIncludePaging: boolean = false, page: number = 1): Promise<IListItemsResult> {
        return new Promise(async (resolve, reject) => {
            // resets the page info if site url or listname has changed and clear paging information
            if (this._siteUrl !== siteUrl || this._listName !== listName || !isEquivalent(this._queryBag, queryBag)) {
                let listType = await this.getListType(listName, siteUrl);
                let allItems = await this.getAllItems(queryBag, listName, siteUrl);
                let itemCount = allItems.length;
                let lastPage = (parseInt(queryBag.itemLimit) > itemCount) ? 1 : Math.ceil(itemCount / parseInt(queryBag.itemLimit)); // since our page start from 1
                this._listType = listType.BaseType;
                this._pagingInfo.lastPage = lastPage;
                this._pagingInfo.allItems = allItems;
                this._pagingInfo.totalItemCount = itemCount;
                this._nextPageInfo = '';
                this._pageItems = {};
            }
            this._siteUrl = siteUrl;
            this._listName = listName;
            this._queryBag = queryBag;

            var web = new Web(siteUrl);
            var query: any;

            // check if cache as the item to prevent another fetch
            if (this._pageItems[`page${page}`]) {
                let matchedItem = this._pageItems[`page${page}`];
                let output: IListItemsResult = {
                    Items: matchedItem,
                    currentPage: page,
                    hasMore: (this._pagingInfo.lastPage !== page),
                    pageRangeDisplay: this.getFormattedRangeDisplay(matchedItem, page, queryBag)
                };
                resolve(output);

            } else {
                let queryXml = CamlQueryGenerator.generateCAMLQuery(queryBag, this._listType, this._listName);
                if (this._nextPageInfo && shouldIncludePaging) {
                    query = {

                        ViewXml: queryXml,
                        Paging: this._nextPageInfo

                    }
                } else {
                    query = {
                        ViewXml: queryXml
                    }
                }
                var fields = [];

                web.lists.getByTitle(listName).renderListDataAsStream(query).then((r: any) => {
                    console.log(r);
                    // here check if we have read the last item
                    const data = r.Row;
                    const last = data[data.length - 1]; // get the last item
                    if (last) {
                        this._nextPageInfo = `Paged=TRUE&p_ID=${last.ID}&p_Title=${last.Title}`; // store the next page info
                    }
                    let storageItems = {
                        ...this._pageItems,
                        [`page${page}`]: data
                    }
                    this._pageItems = storageItems;
                    resolve({

                        Items: data,
                        currentPage: page,
                        hasMore: (this._pagingInfo.lastPage !== page),
                        pageRangeDisplay: this.getFormattedRangeDisplay(data, page, queryBag)
                    } as IListItemsResult);
                })
            }
        });
    }


    public async getListType(listName: string, siteUrl: string): Promise<IListType> {
        var web = new Web(siteUrl);
        try {
            let list = await web.lists.getByTitle(listName).get();
            return { BaseType: list.BaseType } as IListType;
        } catch (err) {
            throw new Error(err.message);
        }
    }


    public async getList(listName: string, siteUrl: string): Promise<any> {
        try {
            var web = new Web(siteUrl);
            let list = await web.lists.getByTitle(listName).get();
            return list;
        } catch (err) {
            throw new Error(err.message);
        }
    }


}