

import * as React from 'react';
import * as ReactDom from 'react-dom';
import "@pnp/polyfill-ie11";
import { Version } from '@microsoft/sp-core-library';
import "intersection-observer";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { IPersonaProps, IBasePickerSuggestionsProps, Label, List } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
import * as strings from 'ContentDisplayWebpartWebPartStrings';
import { setup as pnpSetup } from "@pnp/common";
import { graph } from "@pnp/graph";
import { sp } from "@pnp/sp";
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { MSGraphClient } from '@microsoft/sp-http';
// import props

import { IContentDisplayWebpartProps } from './components/IContentDisplayWebpartProps';

// import components
import ContentDisplayWebpart from './components/ContentDisplayWebpart';
import PropertyPaneChoiceGroup from './components/property-pane/property-pane-choiceGroup/PropertyPaneChoiceGroup';
import PropertyPaneContentTypeDropdown from './components/property-pane/property-pane-contenttype-dropdown/PropertyPaneContentTypeDropdown';
import PropertyPaneSiteUrl from './components/property-pane/property-pane-siteUrl/PropertyPaneSiteUrl';
import PropertyPaneListName from './components/property-pane/property-pane-listName/PropertyPaneListName';
import PropertyPaneTemplatePicker from './components/property-pane/property-pane-template-picker/PropertyPaneTemplatePicker';
import PropertyPaneTemplateBinding from './components/property-pane/property-pane-templateBinding/PropertyPaneTemplateBinding';
import PropertyPanelFilterPanel from './components/property-pane/property-pane-filterPanel/PropertyPaneFilterPanel'
import PropertyPaneItemLimit from './components/property-pane/property-pane-itemLimit/PropertyPaneItemLimit';
import PropertyPanePagingControl from './components/property-pane/property-pane-enablePaging/PropertyPanePagingControl';
import PropertyPaneOrderByDropdown from './components/property-pane/property-pane-orderby/PropertyPaneOrderBy';
import PropertyPaneOrderByDirectionDropdown from './components/property-pane/property-pane-orderByDirection/PropertyPaneOrderByDirection';
// import interfaces
import { IListService } from './services/interfaces/IListService';
import { ILayoutService } from './services/LayoutService';
import { IDisplayTemplateService } from './services/interfaces/IDisplayTemplateService';
import { IPeoplePickerService } from './services/interfaces/IPeoplePickerService';
// import services
import { ListService } from './services/ListService';
import LayoutService from './services/LayoutService';
import DisplayTemplateService from './services/DisplayTemplateService';
import PeoplePickerService from './services/PeoplePickerService';

// import models
import { IListField } from './models/IListField';
import { IDisplayTemplate } from './models/IDisplayTemplate';
import { IContentType } from './models/IContentType';
import { IQueryFilter } from './models/IQueryFilter';
import { IQueryBag } from './models/IQueryBag';
import { IListType } from './models/IListType';
import { IListItemsResult } from './models/IListItemsResult';
//importing helpers 
import { convertContentTypeToDropdown } from './utils/listHelper';
import { objectHasValue } from './utils/common';


export interface IContentDisplayWebpartMainProps {
  description: string;
  siteAbsoluteUrl: string;
  listName: string;
  layouts: string;
  template: string;
  templateBindings: object;
  listContentTypes: IContentType;
  queryFilters: IQueryFilter[];
  itemLimit: string;
  enablePaging: boolean;
  orderby: string;
  orderbyDirection: string;
}

export default class ContentDisplayWebpartMain extends BaseClientSideWebPart<IContentDisplayWebpartMainProps> {

  //Declare list of controls
  private _ContentTypesField: PropertyPaneContentTypeDropdown;
  private _LayoutField: PropertyPaneChoiceGroup;
  private _TemplatePicker: PropertyPaneTemplatePicker;
  private _TemplateBinding: PropertyPaneTemplateBinding;
  private _PropertyPaneSiteUrl: PropertyPaneSiteUrl;
  private _PropertyPaneListName: PropertyPaneListName;
  private _PropertyPanelFilterPanel: PropertyPanelFilterPanel;
  private _PropertyPaneItemLimit: PropertyPaneItemLimit;
  private _PropertyPanePagingControl: PropertyPanePagingControl;
  private _PropertyPaneOrderBy: PropertyPaneOrderByDropdown;
  private _PropertyPaneOrderByDirection: PropertyPaneOrderByDirectionDropdown;

  //Declare services
  public _ListService: IListService;
  private _TemplateService: IDisplayTemplateService;
  private _LayoutService: ILayoutService;
  private _PeoplePickerService: IPeoplePickerService;

  private _graphClient: MSGraphClient;
  /**
   * On webpart initialsed
   * @returns init 
   */
  public onInit(): Promise<void> {
    return super.onInit().then(async _ => {
      this._ListService = new ListService();
      this._TemplateService = new DisplayTemplateService();
      this._LayoutService = new LayoutService();
      this._PeoplePickerService = new PeoplePickerService(this.context.spHttpClient);
      // other init code may be present
      let client = await this.context.msGraphClientFactory.getClient();
      this._graphClient = client;
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  /**
   * Renders content display webpart main
   */
  public render(): void {
    var queryBag: IQueryBag = {
      filters: this.properties.queryFilters,
      contentType: this.properties.listContentTypes,
      itemLimit: this.properties.itemLimit,
      recursiveEnabled: true,
      orderBy: this.properties.orderby,
      orderByDirection: this.properties.orderbyDirection
    };
    const element: React.ReactElement<IContentDisplayWebpartProps> = React.createElement(
      ContentDisplayWebpart,
      {
        description: this.properties.description,
        absoluteUrl: this.properties.siteAbsoluteUrl,
        listName: this.properties.listName,
        layouts: this.properties.layouts,
        templateId: this.properties.template,
        fetchListItems: this.getListItems.bind(this),
        onNextPage: null,
        onPrevPage: null,
        itemLimit: this.properties.itemLimit,
        bindings: this.properties.templateBindings,
        fetchListFields: this.getListFields.bind(this),
        hasBindings: objectHasValue(this.properties.templateBindings),
        fetchResult: {} as IListItemsResult,
        configuredItems: [],
        template: this._TemplateService.getTemplateById(this.properties.template),
        queryBag: queryBag,
        isFetching: false,
        listFields: [],
        listType: null,
        enablePaging: this.properties.enablePaging,
        getListType: this.getListType.bind(this),
        graphClient: this._graphClient,
        siteId: this.context.pageContext.site.id.toString()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }



  /**
   * Loads content types
   * @returns IDropdownOptions of content types
   */
  private async loadContentTypes(): Promise<IDropdownOption[]> {
    const { listName, siteAbsoluteUrl } = this.properties;
    return convertContentTypeToDropdown(await this._ListService.getListContentTypes(listName, siteAbsoluteUrl));
  }

  /**
   * Gets list fields
   * @returns all the columns/fields of a specified list
   */
  private async getListFields(): Promise<IListField[]> {
    const { listName, siteAbsoluteUrl } = this.properties;
    return await this._ListService.getListFields(listName, siteAbsoluteUrl);
  }

  private async loadListField(): Promise<IDropdownOption[]> {
    var fields = await this.getListFields();
    var options: IDropdownOption[] = [];
    for (var i = 0; i < fields.length; i++) {
      options.push({
        text: fields[i].Title,
        key: fields[i].InternalName
      })
    }
    return options;
  }



  /**
   * Gets list items
   * @returns list items 
   */
  private async getListItems(queryBag: IQueryBag, shouldIncludePaging: boolean, page: number): Promise<IListItemsResult> {
    const { listName, siteAbsoluteUrl } = this.properties;
    return await this._ListService.getListItems(queryBag, listName, siteAbsoluteUrl, shouldIncludePaging, page);
  }


  private async getListType(): Promise<IListType> {
    const { listName, siteAbsoluteUrl } = this.properties;
    return await this._ListService.getListType(listName, siteAbsoluteUrl);
  }

  /**
   * Loads All templates
   * @returns templates 
   */
  private loadTemplates(): IDisplayTemplate[] {
    return this._TemplateService.getAllTemplates();
  }

  /**
   * Loads template layouts and transform into choice group options
   * @returns template layout choice group options 
   */
  private loadTemplateLayoutChoiceGroupOptions(): IChoiceGroupOption[] {
    let layouts = this._LayoutService.getAllLayouts();
    let options = [];
    for (var i = 0; i < layouts.length; i++) {
      var choiceGroupOption = {} as IChoiceGroupOption;
      choiceGroupOption['key'] = layouts[i].Id;
      choiceGroupOption['text'] = layouts[i].Name;
      choiceGroupOption['iconProps'] = {};
      choiceGroupOption['iconProps']['iconName'] = layouts[i].IconName;
      options.push(choiceGroupOption);
    }
    return options;
  }

  private fetchPeoplePickerSuggestion(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): Promise<IPersonaProps[]> {
    return this._PeoplePickerService.getPeopleSuggestions(this.properties.siteAbsoluteUrl, filterText, currentPersonas, limitResults);
  }

  /**
   * Method which updates the webpart properties whenever a property pane fields updates
   * This needs to be called if you want your fucken values to be stored
   * @param propertyPath 
   * @param newValue 
   */
  private onFieldValueChange(propertyPath: string, newValue: any | any[]): void {
    this.resetDependantFields(propertyPath);
    const oldValue: any = get(this.properties, propertyPath);
    update(this.properties, propertyPath, (): any => { return newValue; });
    this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.context.propertyPane.refresh();
    this.render();
  }

  /**
   * Some field values need to be resetted when dependant field value changes
   * @param targetProperty 
   */
  private resetDependantFields(targetProperty: string): void {
    switch (targetProperty) {
      case 'siteAbsoluteUrl':
        this.resetContentType();
        this.resetTemplateBinding();
        this.resetFilters();
        this.resetOrderBy()
        break;
      case 'listName':
        this.resetContentType();
        this.resetTemplateBinding();
        this.resetFilters();
        this.resetOrderBy();
        break;
      case 'template':
        this.resetTemplateBinding();
        break;
      case 'orderby':
        this.resetEnablePaging();
        break;
      default:
      // code block
    }
  }

  private resetEnablePaging() {
    this.resetProperty('enablePaging', false);
  }
  private resetOrderBy(): void {
    this.resetProperty('orderby', null);
  }

  /**
   * Function that resets the value of previously set template bindings
   */
  private resetTemplateBinding(): void {
    this.resetProperty('templateBindings', {});
  }

  /**
   * Resets filters
   */
  private resetFilters(): void {
    this.resetProperty('queryFilters', []);
  }

  /**
   * Resets content type field
   */
  private resetContentType(): void {
    this.resetProperty('listContentTypes', { Name: 'All content types', Id: { StringValue: 'All' } });
  }

  /**
   * Generic function that resets a webpart property
   * @param propertyTarget 
   * @param value 
   */
  private resetProperty(propertyTarget: string, value: any): void {
    const oldValue: any = get(this.properties, propertyTarget);
    update(this.properties, propertyTarget, (): any => { return value; });
    this.onPropertyPaneFieldChanged(propertyTarget, oldValue, value);
  }

  private validateList(value: string): Promise<string> {
    let errMsg = '';
    return new Promise((resolve, reject) => {
      let list: any;
      this._ListService.getList(value, this.properties.siteAbsoluteUrl).then(response => {
        list = response;
        resolve('');
      }).catch(error => {
        resolve('Unable to reach list, please make sure the list exists');
      })
    });
  }

  /**
   * Rendering list of property pane controls
   * @returns property pane configuration 
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // initialise property pane controls
    this._PropertyPaneSiteUrl = new PropertyPaneSiteUrl('siteAbsoluteUrl', {
      onChange: this.onFieldValueChange.bind(this),
      key: 'siteUrlUniqueKey',
      label: 'Site Url',
      controlId: 'siteUrl',
      value: this.properties.siteAbsoluteUrl
    });

    // list name control
    this._PropertyPaneListName = new PropertyPaneListName('listName', {
      onChange: this.onFieldValueChange.bind(this),
      key: 'listNameUniqueKey',
      label: 'List Name',
      controlId: 'listName',
      value: this.properties.listName,
      validate: this.validateList.bind(this)
    });

    // list content types control
    this._ContentTypesField = new PropertyPaneContentTypeDropdown('listContentTypes', {
      onChange: this.onFieldValueChange.bind(this),
      loadOption: this.loadContentTypes.bind(this),
      key: 'listContentTypesUniqueKey',
      label: 'List Content Types',
      selectedKey: this.properties.listContentTypes.Id.StringValue,
      listName: this.properties.listName,
      siteUrl: this.properties.siteAbsoluteUrl,
    });

    // layouts control
    this._LayoutField = new PropertyPaneChoiceGroup('layouts', {
      onChange: this.onFieldValueChange.bind(this),
      loadOption: this.loadTemplateLayoutChoiceGroupOptions.bind(this),
      key: 'layoutControlUniqueId',
      label: 'Layouts',
      selectedOption: this.properties.layouts,
      controlId: 'layout'
    });

    // template selection control
    this._TemplatePicker = new PropertyPaneTemplatePicker('template', {
      key: 'templateUniqueId',
      selectedTemplate: this.properties.template,
      onChange: this.onFieldValueChange.bind(this),
      getTemplates: this.loadTemplates.bind(this)
    });

    // template binding control
    this._TemplateBinding = new PropertyPaneTemplateBinding('templateBindings', {
      key: 'templateBindingUniqueKey',
      onChange: this.onFieldValueChange.bind(this),
      template: this.properties.template,
      getListFields: this.getListFields.bind(this),
      listName: this.properties.listName,
      siteUrl: this.properties.siteAbsoluteUrl,
      bindings: this.properties.templateBindings,
      contentType: this.properties.listContentTypes,
      getListType: this.getListType.bind(this)
    });

    // query filters control
    this._PropertyPanelFilterPanel = new PropertyPanelFilterPanel('queryFilters', {
      key: 'queryFilterUniqueKey',
      existingfilters: this.properties.queryFilters,
      loadFilterFields: this.getListFields.bind(this),
      fetchPeoplePickerSuggestion: this.fetchPeoplePickerSuggestion.bind(this),
      onFilterChange: this.onFieldValueChange.bind(this),
      siteUrl: this.properties.siteAbsoluteUrl,
      listName: this.properties.listName
    });

    // query result item limit control
    this._PropertyPaneItemLimit = new PropertyPaneItemLimit('itemLimit', {
      onChange: this.onFieldValueChange.bind(this),
      key: 'itemLimitUniqueKey',
      label: 'Item Limit',
      controlId: 'itemLimit',
      value: this.properties.itemLimit
    });

    // Paging control
    this._PropertyPanePagingControl = new PropertyPanePagingControl('enablePaging', {
      onSwitchBoxValueChange: this.onFieldValueChange.bind(this),
      key: 'enablePagingUniqueKey',
      label: 'Enable Paging',
      checked: this.properties.enablePaging,
      disabled: (this.properties.orderby !== null)
    });

    // OrderBy Control
    this._PropertyPaneOrderBy = new PropertyPaneOrderByDropdown('orderby', {
      onChange: this.onFieldValueChange.bind(this),
      loadOption: this.loadListField.bind(this),
      key: 'orderByUniqueKey',
      label: 'OrderBy',
      selectedKey: this.properties.orderby,
      listName: this.properties.listName,
      siteUrl: this.properties.siteAbsoluteUrl,
    });

    // OrderBy Direction control
    this._PropertyPaneOrderByDirection = new PropertyPaneOrderByDirectionDropdown('orderbyDirection', {
      onChange: this.onFieldValueChange.bind(this),
      key: 'orderByDirectionUniqueKey',
      label: 'OrderBy Direction',
      selectedKey: this.properties.orderbyDirection,
      listName: this.properties.listName,
      siteUrl: this.properties.siteAbsoluteUrl
    });

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Source Configuration",
              groupFields: [
                this._PropertyPaneSiteUrl,
                this._PropertyPaneListName
              ]
            },
            {
              groupName: "Content Types",
              groupFields: [
                this.properties.siteAbsoluteUrl && this.properties.listName && this._ContentTypesField
              ]
            },
            {
              groupName: "Item limit",
              groupFields: [
                this._PropertyPaneItemLimit,
                this._PropertyPanePagingControl,
                this._PropertyPaneOrderBy,
                this._PropertyPaneOrderByDirection
              ]
            },
            {
              groupName: "Display Configuration",
              groupFields: [
                this._LayoutField,
                this._TemplatePicker
              ]
            },
            {
              groupName: "Template Binding",
              groupFields: [
                this.properties.siteAbsoluteUrl && this.properties.listName && this._TemplateBinding
              ]
            },
            {
              groupName: "Additional Filters",
              groupFields: [
                this.properties.siteAbsoluteUrl && this.properties.listName && this._PropertyPanelFilterPanel
              ]
            },
          ]
        }
      ]
    };
  }
}
