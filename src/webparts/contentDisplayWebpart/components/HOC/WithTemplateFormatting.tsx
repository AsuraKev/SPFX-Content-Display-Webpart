
import * as React from 'react';
import { Guid } from '@microsoft/sp-core-library';
import * as moment from 'moment';
import { IDisplayTemplate } from '../../models/IDisplayTemplate';
import { IFormattedResult } from '../../models/IFormattedResult';
import { isEqual, isEmpty } from '@microsoft/sp-lodash-subset';
import { QueryFilterFieldType } from '../../enums/QueryFilterFieldType';
import { IListField } from '../../models/IListField';
import { IListType } from '../../models/IListType';
import { IListItemsResult } from '../../models/IListItemsResult';
import { isEquivalent } from '../../utils/common';
import { templateProperties, fileIconDictionary } from '../../constants/constant';
import { MSGraphClient } from '@microsoft/sp-http';
import { sp } from '@pnp/sp';
// HOC internal state which can be pass down to wrapped component
export interface IHOCstate {
    configuredItems: any[];
    listFields: IListField[];
}

// these are the props that will be injected into the wrapped component
export interface InjectedProps {
    configuredItems: any[];
}

// the External Props are used by the HOC itself and is not passed down to wrappedcomponent
/** Note that the original props are read only and if you want to use those props you have to redefine in the HOC props so that it becomes the props of HOC  */
export interface HOCProps {
    templateId: string;
    bindings: object;
    fetchResult: IListItemsResult;
    template: IDisplayTemplate;
    listFields: IListField[];
    listType: IListType;
    onNextPage: (shouldIncludePaging: boolean, page: number) => void;
    onPrevPage: (page: number) => void;
    absoluteUrl: string;
    listName: string;
    graphClient: MSGraphClient;
    siteId: string;
}

const WithTemplateFormatting = <OriginalProps extends {}>(Component: React.ComponentType<OriginalProps & InjectedProps>) => {

    type ResultProps = OriginalProps & HOCProps; // gets the intersection of the original props and hoc props

    return class TemplateFormattingHOC extends React.Component<ResultProps, IHOCstate>{

        constructor(props: ResultProps) {
            super(props);
            this.state = {
                configuredItems: [],
                listFields: []
            };

        }

        public async componentDidMount() {
            this.applyBindings();
        }

        public applyBindings(): void {
            const { template, bindings, listFields, listType, listName, absoluteUrl } = this.props;

            if (listType.BaseType === 1 && listName.toLowerCase() !== 'site pages') {
                this.applyBindingAsync();
            }
            else {
                this.applyStandardBindingAsync();
            }
        }

        public async applyStandardBindingAsync() {
            const { template, fetchResult, bindings, listFields, listType, listName, absoluteUrl } = this.props;
            var bindedItems = [];
            const promises = fetchResult.Items.map(async spItem => {
                let bindingKeys = Object.keys(bindings);
                let bindingClone = {};
                var isFolder = spItem.FileSystemObjectType ? (spItem.FileSystemObjectType === 1 ? true : false) : false;
                var type = listType.BaseType;
                if (isFolder) return;
                for (const key of bindingKeys) {
                    var fieldType = this.getFieldType(bindings[key], listFields);
                    var isLinkProperty = this.isLinkProperties(key);
                    // handle special list or doclibrary
                    if (listName.toLowerCase() === 'site pages') {
                        if (isLinkProperty) {
                            if (bindings[key] && !isEmpty(bindings[key])) {
                                bindingClone[key] = spItem[bindings[key]];
                            } else {
                                bindingClone[key] = `https://${window.location.hostname}${spItem.FileRef}`;
                            }
                            continue;
                        }
                    }
                    if (listName.toLowerCase() === 'thank you') {
                        if (isLinkProperty) {
                            if (bindings[key] && !isEmpty(bindings[key])) {
                                bindingClone[key] = spItem[bindings[key]];
                            } else {
                                bindingClone[key] = `${absoluteUrl}/Lists/${listName}/DispForm.aspx?ID=${spItem.ID}`;
                            }
                            continue;
                        }
                    }

                    switch (fieldType) {
                        // if its a type url
                        case QueryFilterFieldType.Url:
                            bindingClone[key] = spItem[bindings[key]] ? `https://${window.location.hostname}${spItem[bindings[key]]}` : '';
                            break;
                        case QueryFilterFieldType.Attachments:
                            let filePath = spItem.Attachments ? `https://${window.location.hostname}${spItem.AttachmentFiles[0]['ServerRelativeUrl']}` : null;
                            bindingClone[key] = filePath;
                        case QueryFilterFieldType.User:
                            bindingClone[key] = this.buildUsers(spItem,bindings,key);
                            break;
                        case QueryFilterFieldType.UserMulti:
                            bindingClone[key] = this.buildUsers(spItem,bindings,key);
                            break;
                        default:
                            bindingClone[key] = spItem[bindings[key]];
                    }
                }
                return bindingClone;
            });
            const results = await Promise.all(promises);
            for (var i = 0; i < results.length; i++) {
                var bindedTemplate = template.Render(results[i]);
                bindedItems.push(bindedTemplate);
            }
            this.setState({ configuredItems: bindedItems });
        }

        public buildUsers(spItem: any, bindings:object, key:string ): string[] {
            let users = [];
            let dataUsers = spItem[bindings[key]];
            for (var i = 0; i < dataUsers.length; i++) {
                users.push(`${dataUsers[i].title}${(i === dataUsers.length - 1 ? '' : ', ')}`);
            };
            return users;
        }

        public async applyBindingAsync(): Promise<void> {
            const { template, fetchResult, bindings, listFields, listType, listName, absoluteUrl } = this.props;
            let bindedItems = [];
            const promises = fetchResult.Items.map(async spItem => {
                let bindingKeys = Object.keys(bindings);
                let bindingClone = {};
                for (const key of bindingKeys) {
                    let value = await this.autoBind(key, spItem);
                    bindingClone[key] = value;
                }
                return bindingClone;
            });

            const results = await Promise.all(promises);
            for (var i = 0; i < results.length; i++) {
                var bindedTemplate = template.Render(results[i]);
                bindedItems.push(bindedTemplate);
            }
            this.setState({ configuredItems: bindedItems });
        }

        public autoBind(key: string, spItem: any): Promise<any> {
            return new Promise(async (resolve, reject) => {
                const { graphClient, siteId } = this.props;
                let fileExtension = spItem.File_x0020_Type;
                let isPicture = /[\/.](gif|jpg|jpeg|tiff|png)$/i.test(spItem.FileRef);
                switch (key) {
                    // auto bind title to file name
                    case templateProperties.title:
                        resolve(spItem.FileLeafRef);
                        break;
                    // autobind icon to file type icon
                    case templateProperties.icon:
                        resolve(fileIconDictionary[fileExtension] ? fileIconDictionary[fileExtension] : '');
                        break;
                    case templateProperties.buttonLink:
                        resolve(this.buidDocLibUrl(spItem));
                        break;
                    case templateProperties.description:
                        resolve(spItem.FileLeafRef);
                        break;
                    case templateProperties.titleLink:
                        resolve(this.buidDocLibUrl(spItem));
                        break;
                    case templateProperties.buttonText:
                        resolve('Open file');
                        break;
                    case templateProperties.author:
                        resolve(spItem.Author[0].title);
                        break;
                    case templateProperties.date:
                        resolve(`Edited - ${moment(`${new Date(spItem['Modified'])}`).format('DD MMM YYYY HH:MM')}`);
                        break;
                    case templateProperties.link:
                        resolve(this.buidDocLibUrl(spItem));
                        break;
                    case templateProperties.background:
                        // return ;
                        // As currently Graph request are blocked by ICT therefore not all thumbnails can be retreived.
                        // let thumbnail = await graphClient.api(`/sites/${siteId}/drives/items/${spItem.ID}/thumbnails`).get();
                        resolve(`https://${window.location.hostname}/_layouts/15/getpreview.ashx?path=https://${window.location.hostname}${spItem.FileRef}`);
                        break;
                }
            })
        }

        public buidDocLibUrl(spItem: any): string {
            if(spItem.ServerRedirectedEmbedUrl){
                return spItem.ServerRedirectedEmbedUrl;
            }
            return `https://${window.location.hostname}${spItem.FileRef}`;
        }

        public isLinkProperties(property) {
            let linkProperties = [templateProperties.titleLink, templateProperties.buttonLink, templateProperties.link];
            return linkProperties.indexOf(property) != -1;
        }

        public getFieldType(internalName: string, listFields: IListField[]): string {
            var matchedField = listFields.filter(f => f.InternalName === internalName)[0];
            if (!matchedField) return '';
            return matchedField.TypeAsString;
        }

        public componentDidUpdate(prevProps, prevState) {
            if (!isEqual(prevProps.fetchResult, this.props.fetchResult) || prevProps.bindings !== this.props.bindings) {
                this.applyBindings();
            }
        }

        public render(): React.ReactElement<ResultProps> {
            return <Component {...this.props
            } {...this.state} />;
        }
    }


}

export default WithTemplateFormatting
