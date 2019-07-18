
import * as React from 'react';
import * as cx from 'classnames';
import styles from './templateBindingPanel.module.scss';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { isEquivalent } from '../../../utils/common';
import { isEmpty } from '@microsoft/sp-lodash-subset';
//import services
import { IListService } from '../../../services/interfaces/IListService';
import { ListService } from '../../../services/ListService';
import DisplayTemplateService from '../../../services/DisplayTemplateService';
import { IDisplayTemplateService } from '../../../services/interfaces/IDisplayTemplateService';
//import Models
import { IDisplayTemplate } from '../../../models/IDisplayTemplate';
import { IListField } from '../../../models/IListField';
import { IListType } from '../../../models/IListType';
import { IContentType } from '../../../models/IContentType';
import { ITemplateBinding } from '../../../models/ITemplateBinding';
//import Components
import TemplateBinding from './TemplateBinding';
import { templateProperties } from '../../../constants/constant';

export interface ITemplateBindingPanelProps {
    templateId: string;
    getListFields: () => Promise<IListField[]>;
    listName: string;
    bindings: object;
    siteUrl: string;
    onBindingChange: (binding: object) => void;
    contentType: IContentType;
    getListType: () => Promise<IListType>;
}

export interface ITemplateBindingPanelState {
    template: IDisplayTemplate;
    listFieldsOptions: IDropdownOption[];
    listType: IListType;
    bindings: object;
}

export default class TemplatePanel extends React.Component<ITemplateBindingPanelProps, ITemplateBindingPanelState>{

    private _templateService: IDisplayTemplateService;

    constructor(props: ITemplateBindingPanelProps) {
        super(props);
        this.loadListFields = this.loadListFields.bind(this);
        this.loadTemplate = this.loadTemplate.bind(this);
        this._templateService = new DisplayTemplateService();
        this.state = {
            template: null,
            listFieldsOptions: [],
            listType: {} as IListType,
            bindings: {}
        }
    }

    public async componentDidMount() {
        this.loadListFields();
        this.loadTemplate();
        this.getListType();
    }

    public async getListType(): Promise<void> {
        const { getListType } = this.props;
        let listType = await getListType();
        this.setState({ listType: listType });
    }

    public setInitialBindings() {
        const { template } = this.state;
        const { bindings, onBindingChange } = this.props;
        if (!isEmpty(bindings)) {
            this.setState({ bindings: bindings });
            return
        }

        let properties = template.Properties;
        let initialBindings: object = {};
        for (var i = 0; i < properties.length; i++) {
            initialBindings[properties[i]] = null;
        }
        this.setState({ bindings: initialBindings }, () => { onBindingChange(this.state.bindings) });
    }

    public loadTemplate(): void {
        const { templateId } = this.props;
        let template = this._templateService.getTemplateById(templateId);
        this.setState({ template: template }, () => {
            this.setInitialBindings();
        });
    }

    public async loadListFields(): Promise<void> {
        var fields = await this.props.getListFields();
        var options = this.convertListFieldsToDropDownOptions(fields);
        this.setState({ listFieldsOptions: options });
    }

    public convertListFieldsToDropDownOptions(listFields: IListField[]): IDropdownOption[] {
        var options: IDropdownOption[] = [];
        var filteredFields = listFields
            .filter(field => {
                return (!field.Hidden || field.Group !== '_hidden'); // remove any hidden fields and unsupported field types
            })
            .sort((a, b) => {
                let textA = a.Title.toUpperCase();
                let textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

            });
        for (var i = 0; i < filteredFields.length; i++) {
            var listField = filteredFields[i];
            var option = {} as IDropdownOption;
            option.key = listField.InternalName;
            option.text = listField.Title;
            options.push(option);
        }
        var placeholderOption = {key: 'placeholder',  text:'Please select a value'} as IDropdownOption;
        options.unshift(placeholderOption);
        return options;
    }

    public onBindingChange(objValue: ITemplateBinding) {
        const { onBindingChange } = this.props;
        const { bindings } = this.state;
        var newBindings = { ...bindings }; // creates copy;
        newBindings[objValue.Property] = (objValue.Value === 'placeholder') ? null : objValue.Value;
        this.setState({ bindings: newBindings }, () => {
            onBindingChange(newBindings);
        });
    }

    public clearDropdownOptions(): void {
        this.setState({ listFieldsOptions: [] });
    }

    public componentDidUpdate(prevProps, prevState) {
        const { listName, siteUrl, templateId, contentType, bindings } = this.props;
        if (prevProps.listName !== listName || prevProps.siteUrl !== siteUrl || !isEquivalent(prevProps.bindings, bindings)) {
            this.clearDropdownOptions();
            this.setInitialBindings();
            this.loadListFields();
            this.getListType();
        }
        // when the template id changes update state template
        if (prevProps.templateId !== templateId) {
            this.loadTemplate();
        }
    }

    public render(): React.ReactElement<ITemplateBindingPanelProps> {
        const { template, listFieldsOptions, listType } = this.state;
        const { bindings, listName } = this.props;
        if (!template) return <div />;
        var bindingFields = template.Properties.map((property, index) => {
            const selectedValue = bindings[property] ? bindings[property] : "";
            return (
                <div className={styles['binding-field-item']}>
                    <TemplateBinding
                        property={property}
                        value={selectedValue}
                        label={property}
                        options={listFieldsOptions}
                        onBindingChange={this.onBindingChange.bind(this)}
                        disabled={listType.BaseType === 1 && listName.toLowerCase() !== 'site pages'}
                    />
                </div>

            );
        })
        return (
            <div>
                {bindingFields}
            </div>
        );
    }
}