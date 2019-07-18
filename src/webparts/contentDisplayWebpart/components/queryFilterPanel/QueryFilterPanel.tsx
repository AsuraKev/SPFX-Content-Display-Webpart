
import * as React from 'react';
import { IPersonaProps, IBasePickerSuggestionsProps, Label, isRelativeUrl } from 'office-ui-fabric-react';
import { IListField } from '../../models/IListField';
import { QueryFilterOperator } from '../../enums/QueryFilterOperator';
import { QueryFilterJoin } from '../../enums/QueryFilterJoin';
import { QueryFilterFieldType } from '../../enums/QueryFilterFieldType';
import { IQueryFilter } from '../../models/IQueryFilter';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import styles from './styles.module.scss';
import QueryFilter from './components/QueryFilter';
import { IWebPartContext } from '@microsoft/sp-webpart-base';


export interface IQueryFilterPanelProps {
    existingfilters: IQueryFilter[];
    loadFilterFields: () => Promise<IListField[]>;
    onFilterChange: (filters: IQueryFilter[]) => void;
    fetchPeoplePickerSuggestion: (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) => Promise<IPersonaProps[]>;
    siteUrl: string;
    listName: string;
}

export interface IQueryFilterPanelState {
    filters: IQueryFilter[];
    listFields: IListField[];
}

const allowedFieldTypes = [QueryFilterFieldType.Text, QueryFilterFieldType.Number, QueryFilterFieldType.User, QueryFilterFieldType.DateTime, QueryFilterFieldType.Lookup];

export default class QueryFilterPanel extends React.Component<IQueryFilterPanelProps, IQueryFilterPanelState> {

    constructor(props: IQueryFilterPanelProps) {
        super(props);
        this.removeFilter = this.removeFilter.bind(this);
        this.state = {
            filters: this.getDefaultFilters(),
            listFields: []
        }
    }

    public componentDidMount() {
        this.loadFilterFields();
    }


    public componentWillReceiveProps(nextProps) {
        // if there are no filters
        if (isEmpty(nextProps.existingfilters)) {
            this.setState({
                filters: this.getDefaultFilters(nextProps.existingfilters)
            });
        }

        if (nextProps.siteUrl !== this.props.siteUrl || nextProps.listName !== this.props.listName) {
            this.loadFilterFields();
        }

    }

    public async loadFilterFields(): Promise<void> {
        const { loadFilterFields } = this.props;
        var fields = await loadFilterFields();
        var filteredField = fields.filter(f => { return (allowedFieldTypes.indexOf(f.TypeAsString) !== -1 && f.Group !== '_Hidden') })
            .sort((a, b) => {
                let textA = a.Title.toUpperCase();
                let textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

            });
        this.setState({ listFields: filteredField });
    }

    private getDefaultFilters(filters: IQueryFilter[] = null): IQueryFilter[] {
        const { existingfilters } = this.props;
        if (!filters) {
            if (existingfilters && !isEmpty(existingfilters)) {
                return existingfilters.sort((a, b) => {
                    return a.index - b.index;
                });
            }
        }
        let defaultFilters: IQueryFilter[] = [{
            index: 0,
            field: null,
            operator: QueryFilterOperator.Eq,
            join: QueryFilterJoin.And,
            value: ''
        }];

        return defaultFilters;
    }

    private onFilterChange(filter: IQueryFilter): void {
        const { filters } = this.state;
        let matchedFilter = filters.filter((i) => { return i.index == filter.index; })[0];
        // copy the current filters from the state;
        let updatedFilters: IQueryFilter[] = [...filters];
        // update the specific filter with new filter
        updatedFilters[filters.indexOf(matchedFilter)] = filter;
        this.setState({
            filters: updatedFilters
        }, () => {
            const { filters } = this.state;
            this.props.onFilterChange(filters);

        });
    }


    private addFilter(): void {
        const { filters } = this.state;
        let newFilters: IQueryFilter[] = [...filters];
        let lastFilterIndex = filters[filters.length - 1].index;
        let filter: IQueryFilter = {
            index: lastFilterIndex + 1,
            field: null,
            operator: QueryFilterOperator.Eq,
            join: QueryFilterJoin.And,
            value: ''
        };
        newFilters.push(filter);
        this.setState({
            filters: newFilters
        });
    }

    private removeFilter(filter: IQueryFilter): void {
        const { filters } = this.state;
        let matchedFilter = filters.filter((i) => { return i.index === filter.index; })[0];
        let updatedFilters: IQueryFilter[] = [...filters];
        let matchedFilterIndex = updatedFilters.indexOf(matchedFilter);
        updatedFilters.splice(matchedFilterIndex, 1);
        this.setState({
            filters: updatedFilters
        }, () => {
            const { filters } = this.state;
            this.props.onFilterChange(filters);
        });
    }

    public render(): React.ReactElement<IQueryFilterPanelProps> {
        const { filters, listFields } = this.state;
        const { fetchPeoplePickerSuggestion } = this.props;
        return (
            <div>
                <div className={styles['query-filters-container']}>
                    {
                        filters.map(filter => {
                            return (
                                <QueryFilter
                                    key={filter.index}
                                    listFields={listFields}
                                    filter={filter}
                                    onChanged={this.onFilterChange.bind(this)}
                                    fetchPeoplePickerSuggestion={fetchPeoplePickerSuggestion}
                                    removeFilter={this.removeFilter.bind(this)}

                                />
                            );
                        })
                    }
                </div>
                <button onClick={this.addFilter.bind(this)} className={styles['add-btn']}>Add filter</button>
            </div >

        );
    }

}