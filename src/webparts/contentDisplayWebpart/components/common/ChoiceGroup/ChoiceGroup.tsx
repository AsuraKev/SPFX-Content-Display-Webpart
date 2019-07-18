import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IChoiceGroupProps } from './IChoiceGroupProps';

export interface IChoiceGroupFieldState {
    options: IChoiceGroupOption[];
}


export default class ChoiceGroupField extends React.Component<IChoiceGroupProps, IChoiceGroupFieldState> {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }

    }
    public componentDidMount() {
        let options = this.props.loadOption();
        this.setState({options:options});
    }

    public render(): JSX.Element {
        const { onChange, label, selectedKey, id, loadOption } = this.props;
        return (
            <ChoiceGroup
                label={label}
                options={this.state.options}
                selectedKey={selectedKey}
                onChange={onChange}
                id={id}
            />
        );
    }
}
