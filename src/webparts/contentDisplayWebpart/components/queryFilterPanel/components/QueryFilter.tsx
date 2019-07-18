
import * as React from 'react';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Dropdown, IDropdownOption, TextField, ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';
import { NormalPeoplePicker, IPersonaProps, IBasePickerSuggestionsProps, Label } from 'office-ui-fabric-react';
import { TagPicker, ITag } from 'office-ui-fabric-react';
import { DatePicker, Checkbox } from 'office-ui-fabric-react';
import { debounce } from '@microsoft/sp-lodash-subset';
import { IQueryFilter } from '../../../models/IQueryFilter';
import { QueryFilterFieldType } from '../../../enums/QueryFilterFieldType';
import { QueryFilterOperator } from '../../../enums/QueryFilterOperator';
import { IListField } from '../../../models/IListField';
import styles from './styles.module.scss';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {isEquivalent} from '../../../utils/common';


export interface IQueryFilterProps {
    listFields: IListField[];
    filter: IQueryFilter;
    onChanged: (filter: IQueryFilter) => void;
    fetchPeoplePickerSuggestion: (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) => IPersonaProps[] | Promise<IPersonaProps[]>;
    removeFilter: (filter: IQueryFilter) => void;
}

export interface IQueryFilterState {
    filter: IQueryFilter;
    randomKey: number;
}

export default class QueryFilter extends React.Component<IQueryFilterProps, IQueryFilterState> {
    constructor(props: IQueryFilterProps) {
        super(props);
        this.removeFilter = this.removeFilter.bind(this);
        this.state = {
            filter: {} as IQueryFilter,
            randomKey: Math.random()
        }
    }

    private done(): void {
        this.save();
    }

    private save(): void {
        this.props.onChanged(this.state.filter);
    }

    // prepares the list field dropdown options
    private getFieldDropdownOptions(): IDropdownOption[] {
        const { listFields } = this.props;
        // create an empty option 
        let options: IDropdownOption[] = [
            {
                key: "",
                text: ""
            }
        ]

        for (var i = 0; i < listFields.length; i++) {
            let currentField = listFields[i];
            options.push({
                key: currentField.InternalName,
                text: currentField.Title
            } as IDropdownOption)
        }
        return options;

    }


    private getOperatorDropdownOptions(): IDropdownOption[] {
        let listFieldType = this.state.filter.field ? this.state.filter.field.TypeAsString : QueryFilterFieldType.Text;
        let options: IDropdownOption[];

        // Operators for User field types
        if (listFieldType == QueryFilterFieldType.User) {
            options = [
                //{ key: QueryFilterOperator[QueryFilterOperator.ContainsAny], text: 'Contains any' },
                { key: QueryFilterOperator[QueryFilterOperator.IsNull], text: 'Is null' },
                { key: QueryFilterOperator[QueryFilterOperator.IsNotNull], text: 'Is not null' },
                { key: QueryFilterOperator[QueryFilterOperator.Eq], text: 'Equals' },
                { key: QueryFilterOperator[QueryFilterOperator.Neq], text: 'Not Equals' },
            ];
        }
        // Operators for Text, Number, Datetime and Lookup field types
        else {
            options = [
                { key: QueryFilterOperator[QueryFilterOperator.Eq], text: 'Equals' },
                { key: QueryFilterOperator[QueryFilterOperator.Neq], text: 'Not Equals' },
                { key: QueryFilterOperator[QueryFilterOperator.Gt], text: 'Greater than' },
                { key: QueryFilterOperator[QueryFilterOperator.Lt], text: 'Less than' },
                { key: QueryFilterOperator[QueryFilterOperator.Geq], text: 'Greater equal than' },
                { key: QueryFilterOperator[QueryFilterOperator.Leq], text: 'Less equal than' },
                { key: QueryFilterOperator[QueryFilterOperator.IsNull], text: 'Is null' },
                { key: QueryFilterOperator[QueryFilterOperator.IsNotNull], text: 'Is not null' }
            ];

            // Specific operators for text field type
            if (listFieldType == QueryFilterFieldType.Text) {
                options = options.concat([
                    { key: QueryFilterOperator[QueryFilterOperator.BeginsWith], text: 'Begins with' },
                    { key: QueryFilterOperator[QueryFilterOperator.Contains], text: 'contains' }
                ]);
            }
        }
        return options;
    }

    // When the filter field changes set initial filter properties
    private onFieldDropdownChange(option: IDropdownOption, index?: number): void {
        const { listFields } = this.props;
        const matchedListField = listFields.filter(field => { return field.InternalName === option.key })[0];
        const matchedListFieldType = matchedListField.TypeAsString;
        // create a new filter object with updated properties
        let queryfilter: IQueryFilter = {
            ...this.state.filter,
            field: {
                InternalName: option.key,
                TypeAsString: matchedListFieldType,
                Title: option.text
            } as IListField,
            me: false,
            includeTime: false,
            expression: null,
            value: null,
            operator: (matchedListFieldType === QueryFilterFieldType.User) ? QueryFilterOperator.ContainsAny : QueryFilterOperator.Eq
        }
        this.setState({
            filter: queryfilter
        }, this.done);
    }

    // When the operator dropdown value change update the filter operator field
    private onOperatorDropdownChange(option: IDropdownOption, index?: number): void {
        let filter: IQueryFilter = {
            ...this.state.filter,
            operator: QueryFilterOperator[option.key]
        }
        this.setState({ filter: filter }, this.done);
    }

    // Handles when the text value filter changes
    private onValueTextFieldChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        const { filter } = this.state;
        if (filter.value !== newValue) {
            this.setState({
                filter: {
                    ...filter,
                    value: newValue
                }
            }, this.done)
        }
    }

    // Function that resolves people suggestions
    private onLoadPeoplePickerSuggestions(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) {
        const { fetchPeoplePickerSuggestion } = this.props;
        if (isEmpty(filterText)) {
            return [];
        }
        return fetchPeoplePickerSuggestion(filterText, currentPersonas, limitResults);
    }

    //Handles when a user is selected
    private onPeopleSelect(items: IPersonaProps[]) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                value: items
            }
        }, this.done);
    }


    // This is used by the people picker
    private onSelectMe(ev?: React.FormEvent<HTMLInputElement>, checked?: boolean) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                me: checked
            }
        }, this.done);
    }

    private parseDate(dateValue: string | Date | IPersonaProps[] | ITag[]): Date {
        if (dateValue instanceof Date) {
            return dateValue;
        }
        else if (typeof (dateValue) === 'string') {
            let date = moment(dateValue, moment.ISO_8601, true);

            if (date.isValid()) {
                return date.toDate();
            }
        }
        return null;
    }

    private datePickerFormate(date: Date): string {
        return moment(date).format('DD MMM YYYY HH:MM');
    }


    private dateParseFromString(dateStr: string): Date {
        let date = moment(dateStr, 'DD MMM YYYY HH:MM', true);
        return date.toDate();
    }

    private onDateSelect(date: Date) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                value: date
            }
        }, this.done);
    }

    private onDateIncludeTimeChange(ev?: React.FormEvent<HTMLInputElement>, checked?: boolean) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                includeTime: checked
            }
        }, this.done);
    }


    private removeFilter(): void {
        this.props.removeFilter(this.props.filter);
    }

    public componentDidMount() {
        this.setState({ filter: this.props.filter })
    }

    public componentWillReceiveProps(nextProps) {
        if(!isEquivalent(nextProps.filter, this.props.filter)){
            this.setState({ filter: nextProps.filter });
        }

    }

    public render(): React.ReactElement<IQueryFilterProps> {
        const { filter, randomKey } = this.state;
        const { field } = filter;
        const filterFieldKey = field ? filter.field.InternalName : "";
        // we dont need to show value section if the operator check isnull or isnotnull;
        const hideValueSection = this.state.filter.operator == QueryFilterOperator.IsNull || this.state.filter.operator == QueryFilterOperator.IsNotNull;
        // determine what type of control to show
        const showTextField = (!field || (field.TypeAsString === QueryFilterFieldType.Text || field.TypeAsString === QueryFilterFieldType.Number || field.TypeAsString === QueryFilterFieldType.Lookup)) && !hideValueSection;
        const showPeoplePicker = field && field.TypeAsString === QueryFilterFieldType.User && !hideValueSection;
        const showDatePicker = field && field.TypeAsString === QueryFilterFieldType.DateTime && !hideValueSection;

        const peoplePickerSuggestionProps: IBasePickerSuggestionsProps = {
            suggestionsHeaderText: 'Suggested users',
            noResultsFoundText: 'Sorry we couldnt find any matched user',
            loadingText: 'Finding user ...'
        };

        return (
            <div className={styles['filter-item']} >
                <Dropdown label={'List field'}
                    onChanged={this.onFieldDropdownChange.bind(this)}
                    selectedKey={filterFieldKey}
                    options={this.getFieldDropdownOptions()} />

                <Dropdown label={'filter condition'}
                    onChanged={this.onOperatorDropdownChange.bind(this)}
                    selectedKey={QueryFilterOperator[this.state.filter.operator]}
                    options={this.getOperatorDropdownOptions()} />

                {showTextField &&
                    <div style={{ marginTop: '5px' }}>
                        <TextField label={''}
                            placeholder={'Enter the value'}
                            onChange={debounce(this.onValueTextFieldChange.bind(this), 300)}
                            value={filter.value != null ? filter.value as string : ''} />
                    </div>

                }

                {showPeoplePicker &&
                    <div style={{ marginTop: '5px' }}>
                        <Label>{'Select a user'}</Label>
                        <NormalPeoplePicker
                            onResolveSuggestions={this.onLoadPeoplePickerSuggestions.bind(this)}
                            onChange={this.onPeopleSelect.bind(this)}
                            defaultSelectedItems={filter.value as IPersonaProps[]}
                            getTextFromItem={(user: IPersonaProps) => { return user.primaryText }}
                            pickerSuggestionsProps={peoplePickerSuggestionProps}
                            inputProps={{ disabled: filter.me }}
                            key={"peoplePicker" + randomKey}
                            itemLimit={1}
                        />
                        <Checkbox
                            label={'Me'}
                            onChange={this.onSelectMe.bind(this)}
                            checked={filter.me} />
                    </div>
                }
                {showDatePicker &&
                    <div style={{ marginTop: '5px' }}>
                        <DatePicker
                            label={'Pick a date'}
                            placeholder={'Select a date'}
                            allowTextInput={true}
                            value={this.parseDate(filter.value)}
                            formatDate={this.datePickerFormate.bind(this)}
                            parseDateFromString={this.dateParseFromString.bind(this)}
                            onSelectDate={this.onDateSelect.bind(this)}
                        />
                        <Checkbox
                            label={'Include Time'}
                            onChange={this.onDateIncludeTimeChange.bind(this)}
                            checked={filter.includeTime} />
                    </div>
                }
                {filter.index !== 0 && <button onClick={this.removeFilter} className={styles['remove-btn']}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 30 30">
                        <g>
                            <path id="path1" transform="rotate(0,15,15) translate(4.94999409317624,1.59999904632568) scale(0.837500558793878,0.837500558793878)  " fill="#000000" d="M15.999989,8.999995L17.999989,8.999995 17.999989,27.999995 15.999989,27.999995z M10.999989,8.999995L12.999989,8.999995 12.999989,27.999995 10.999989,27.999995z M5.9999887,8.999995L7.9999884,8.999995 7.9999884,27.999995 5.9999887,27.999995z M4.0388826,6L4.961903,29.99998 19.03815,29.99998 19.961172,6 17,6 7.0000004,6z M10,2.0000002C8.9314688,2,8.0562638,2.8418136,8.0026072,3.8972182L8.0000008,3.9999804 15.999999,3.9999804 15.997393,3.8972182C15.943736,2.8418136,15.068531,2,14,2.0000002z M10,0L14,0C16.137063,0,17.887473,1.6836271,17.994786,3.7944365L17.999999,3.9999804 21.000192,3.9999804 21.000579,3.9999999 22.999999,3.9999999C23.553001,4 23.999999,4.447 23.999999,4.9999998 23.999999,5.5530001 23.553001,6 22.999999,6L21.962201,6 20.999185,31.038005C20.979196,31.574992,20.53717,31.99998,20.000173,31.99998L3.9998797,31.99998C3.4628825,31.99998,3.0218649,31.574992,3.0008683,31.038005L2.0378505,6 1.0000003,6C0.44700027,6 3.5762787E-07,5.5530001 0,4.9999998 3.5762787E-07,4.447 0.44700027,4 1.0000003,3.9999999L2.999475,3.9999999 2.9998612,3.9999804 6.0000008,3.9999804 6.0052141,3.7944365C6.1125277,1.6836271,7.8629378,0,10,0z" />
                        </g>
                    </svg>
                    Remove
                </button>}
            </div>

        )
    }
}