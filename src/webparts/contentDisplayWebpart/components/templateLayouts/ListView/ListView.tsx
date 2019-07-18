import * as React from 'react';
import { IDisplayTemplate } from '../../../models/IDisplayTemplate';
import styles from './styles.module.scss';
import { IFormattedResult } from '../../../models/IFormattedResult';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IListField } from '../../../models/IListField';
import { NoItemsFound } from '../../common/NoItems/NoItems';
import { IListType } from '../../../models/IListType';

export interface IListViewProps {
    bindings: object;
    hasBindings: boolean;
    template: IDisplayTemplate;
    configuredItems: any[];
    isFetching: boolean;
    shouldIgnoreBinding: boolean;
}

export interface IListViewState {
}

export default class ListView extends React.Component<IListViewProps, IListViewState> {

    constructor(props: IListViewProps) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.renderMasks = this.renderMasks.bind(this);
        this.state = {
        }
    }

    public renderMasks() {
        const { template } = this.props;
        var items = [];
        for (var i = 0; i < 10; i++) {
            items.push(
                <div className={styles['list-item']}>
                    {template.MockPreview()}
                </div>
            );
        }
        return items;
    }

    public renderItems() {
        var items = [];
        const { configuredItems, isFetching } = this.props;
        if (isFetching) return <div />;
        if (!configuredItems.length) return <NoItemsFound />
        for (var i = 0; i < configuredItems.length; i++) {
            items.push(
                <div className={styles['list-item']}>
                    {configuredItems[i]}
                </div>
            );
        }
        return items;
    }

    public render(): React.ReactElement<IListViewProps> {
        const { bindings, hasBindings, template, configuredItems, shouldIgnoreBinding,isFetching } = this.props;
        return (
            <div className={styles['list-container']} >
                {((!hasBindings && !shouldIgnoreBinding) || isFetching) && this.renderMasks()}
                {(hasBindings || shouldIgnoreBinding) && this.renderItems()}
            </div>
        );
    }
}

