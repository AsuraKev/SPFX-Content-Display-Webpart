import * as React from 'react';
import { IDisplayTemplate } from '../../../models/IDisplayTemplate';
import styles from './styles.module.scss';
import { IFormattedResult } from '../../../models/IFormattedResult';
import { IListField } from '../../../models/IListField';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { NoItemsFound } from '../../common/NoItems/NoItems';
import MansoryGrid from '../../common/MansoryGrid/MansoryGrid';
import { IListType } from '../../../models/IListType';

export interface IMansoryViewProps {
    bindings: object;
    hasBindings: boolean;
    template: IDisplayTemplate;
    configuredItems: any[];
    isFetching: boolean;
    shouldIgnoreBinding: boolean;
}

export interface IMansoryViewState {
}

export default class MansoryView extends React.Component<IMansoryViewProps, IMansoryViewState> {
    constructor(props: IMansoryViewProps) {
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
                <div className={styles['item']}>
                    {template.MockPreview()}
                </div>
            );
        }
        return (
            <MansoryGrid numberOfColumns={3} paddings={10}>
                {items.map(item => {
                    return item
                })}
            </MansoryGrid>
        );
    }

    public renderItems() {
        var items = [];
        const { configuredItems, isFetching } = this.props;
        if (isFetching) return <div />;
        if (!configuredItems.length) return <NoItemsFound />
        for (var i = 0; i < configuredItems.length; i++) {
            items.push(
                <div className={styles['item']}>
                    {configuredItems[i]}
                </div>
            );
        }
        return (
            <MansoryGrid numberOfColumns={3} paddings={10}>
                {items.map(item => {
                    return item
                })}
            </MansoryGrid>
        );
    }


    public render(): React.ReactElement<IMansoryViewProps> {
        const { bindings, hasBindings, template, configuredItems, shouldIgnoreBinding,isFetching } = this.props;
        return (
            <div className={styles['mansory-container']} >
                {((!hasBindings && !shouldIgnoreBinding) || isFetching) && this.renderMasks()}
                {(hasBindings || shouldIgnoreBinding) && this.renderItems()}
            </div>
        );
    }
}

