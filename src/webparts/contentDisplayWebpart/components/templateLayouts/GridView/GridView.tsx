import * as React from 'react';
import { IDisplayTemplate } from '../../../models/IDisplayTemplate';
import styles from './styles.module.scss';
import { IFormattedResult } from '../../../models/IFormattedResult';
import { IListField } from '../../../models/IListField';
import { isEmpty, isEqual } from '@microsoft/sp-lodash-subset';
import { NoItemsFound } from '../../common/NoItems/NoItems';
import { IListType } from '../../../models/IListType';

export interface IGridViewProps {
    bindings: object;
    hasBindings: boolean;
    template: IDisplayTemplate;
    configuredItems: any[];
    isFetching: boolean;
    shouldIgnoreBinding: boolean;
}

export interface IGridViewState {
}

export default class GridView extends React.Component<IGridViewProps, IGridViewState> {

    constructor(props: IGridViewProps) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.renderMasks = this.renderMasks.bind(this);
    }

    public renderMasks() {
        const { template } = this.props;
        var items = [];
        for (var i = 0; i < 10; i++) {
            items.push(
                <div className={styles['grid-item']} style={this.getGridWidth()}>
                    {template.MockPreview()}
                </div>
            );
        }
        items = this.appendPlaceholders(items);
        return items;
    }

    private getGridWidth() {
        const { template } = this.props;
        if (template.preferContainerWidth) {
            return {
                width: `${template.preferContainerWidth}`,
                minWidth: `${template.preferContainerWidth}`
            }
        }
        return null;
    }

    private appendPlaceholders(items) {
        items.push(<span className={styles['grid-item--placeholder']} style={this.getGridWidth()}></span>);
        items.push(<span className={styles['grid-item--placeholder']} style={this.getGridWidth()}></span>);
        items.push(<span className={styles['grid-item--placeholder']} style={this.getGridWidth()}></span>);
        items.push(<span className={styles['grid-item--placeholder']} style={this.getGridWidth()}></span>);
        items.push(<span className={styles['grid-item--placeholder']} style={this.getGridWidth()}></span>);
        return items;
    }

    public renderItems() {
        var items = [];
        const { configuredItems, isFetching, template } = this.props;
        if (isFetching) return <div />;
        if (!configuredItems.length) return <NoItemsFound />
        for (var i = 0; i < configuredItems.length; i++) {
            items.push(
                <div className={styles['grid-item']} style={this.getGridWidth()}>
                    {configuredItems[i]}
                </div>
            );
        }
        items = this.appendPlaceholders(items);
        return items;

    }

    public render(): React.ReactElement<IGridViewProps> {
        const { hasBindings, shouldIgnoreBinding, isFetching } = this.props;
        return (
            <div>
                <div className={styles['grid-container']} >
                    {((!hasBindings && !shouldIgnoreBinding) || isFetching) && this.renderMasks()}
                    {(hasBindings || shouldIgnoreBinding) && this.renderItems()}
                </div>
            </div>

        );
    }
}

