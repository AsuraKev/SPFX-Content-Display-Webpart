
import * as React from 'react';
import { IQueryBag } from '../../models/IQueryBag';
import { IListField } from '../../models/IListField';
import { IListType } from '../../models/IListType';
import { IListItemsResult } from '../../models/IListItemsResult';
import { isEquivalent } from '../../utils/common';
// HOC internal state which can be pass down to wrapped component
export interface IWithListServiceState {
    fetchResult: IListItemsResult;
    isFetching: boolean;
    listFields: IListField[];
    listType: IListType;
}

// these are the props that will be injected into the wrapped component
export interface InjectedProps {
    onNextPage: (shouldIncludePaging: boolean, page: number) => void;
    onPrevPage: (page: number) => void;
}

// the External Props are used by the HOC itself and is not passed down to wrappedcomponent
/** Note that the original props are read only and if you want to use those props you have to redefine in the HOC props so that it becomes the props of HOC  */
export interface HOCProps {
    fetchListItems: (queryBag: IQueryBag, shouldIncludePaging: boolean, page: number) => Promise<IListItemsResult>;
    absoluteUrl: string;
    listName: string;
    queryBag: IQueryBag;
    fetchListFields: () => Promise<IListField[]>;
    getListType: () => Promise<IListType>;
}

const WithListService = <OriginalProps extends {}>(Component: React.ComponentType<OriginalProps & InjectedProps>) => {

    type ResultProps = OriginalProps & HOCProps; // gets the intersection of the original props and hoc props

    return class ListServiceHOC extends React.Component<ResultProps, IWithListServiceState>{

        constructor(props: ResultProps) {
            super(props);
            this.getListItems = this.getListItems.bind(this);
            this.state = {
                isFetching: false,
                listFields: [],
                listType: {} as IListType,
                fetchResult: {
                    Items:[],
                    currentPage: 1,
                    hasMore:true
                } as IListItemsResult
            };

        }

        public async getListItems(shouldIncludePaging: boolean, page: number): Promise<void> {
            const { fetchListItems, fetchListFields, queryBag, getListType } = this.props;
            this.setState({ isFetching: true });
            let output: IListItemsResult = await fetchListItems(queryBag, shouldIncludePaging, page);
            let fields = await fetchListFields();
            let listType = await getListType();
            this.setState({ fetchResult: output, isFetching: false, listFields: fields, listType: listType });
        }

        public onNextPage(shouldIncludePaging: boolean, page: number): void {
            this.getListItems(shouldIncludePaging, page);
        };

        public onPrevPage(page: number): void {
            this.getListItems(false, page);
        };

        public componentDidMount() {
            this.getListItems(false, 1);
        }

        public componentDidUpdate(prevProps, prevState) {
            if (prevProps.absoluteUrl !== this.props.absoluteUrl || prevProps.listName !== this.props.listName || !isEquivalent(prevProps.queryBag, this.props.queryBag)) {
                this.getListItems(false, 1);
            }
        }

        public render(): React.ReactElement<ResultProps> {
            return <Component {...this.props} {...this.state} onNextPage={this.onNextPage.bind(this)} onPrevPage={this.onPrevPage.bind(this)} />;
        }


    }


}

export default WithListService
