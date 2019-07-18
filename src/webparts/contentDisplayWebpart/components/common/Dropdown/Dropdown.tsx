import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { IDropdownFieldProps } from './IDropdownProps';

export interface IDropdownFieldState {
    options: IDropdownOption[]
}
export default class DropdownField extends React.Component<IDropdownFieldProps, IDropdownFieldState> {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }

    }
    public async componentDidMount() {
        this.loadOptions();
    }

    public async loadOptions() {
        const { loadOption, defaultOptions } = this.props;
        var options;
        if (defaultOptions) {
            options = defaultOptions;
        } else {
            options = await loadOption();
        }

        this.setState({ options: options });


    }

    public async componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({ options: [] }, () => {
                this.loadOptions();
            });

        }
    }

    public render(): JSX.Element {
        const { onChange, label, loadOption, selectedKey } = this.props;
        const { options } = this.state
        return (
            <Dropdown
                label={label}
                selectedKey={selectedKey}
                options={options}
                disabled={false}
                onChange={onChange}
            />
        );
    }
}
