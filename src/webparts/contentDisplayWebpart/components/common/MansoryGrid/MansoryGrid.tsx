import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './styles.module.scss';

export interface IMansoryGridProps {
    numberOfColumns: number;
    paddings: number;
}

export interface IMansoryState {
}

export default class MansoryGrid extends React.Component<IMansoryGridProps, IMansoryState> {


    constructor(props: IMansoryGridProps) {
        super(props);
    }

    private renderItemsInMansory() {
        const { paddings, numberOfColumns } = this.props;
        var columns = {};
        var result = [];

        for (let i = 0; i < numberOfColumns; i++) {
            columns[`column${i}`] = [];
        }

        for (let i = 0; i < React.Children.toArray(this.props.children).length; i++) {
            const columnIndex = i % numberOfColumns;
            columns[`column${columnIndex}`].push(
                <div style={{ marginBottom: `${paddings}px` }}>
                    {this.props.children[i]}
                </div>
            );
        }

        for (let i = 0; i < numberOfColumns; i++) {
            result.push(
                <div className={styles['col']}
                    style={{
                        marginLeft: `${i > 0 ? paddings : 0}px`,
                        flex: 1,
                    }}>
                    {columns[`column${i}`]}
                </div>
            );
        }
        return result;
    }

    public render(): JSX.Element {
        return (
            <div className={styles['mansory-grid-wrapper']}>{this.renderItemsInMansory()}</div>
        );
    }
}
