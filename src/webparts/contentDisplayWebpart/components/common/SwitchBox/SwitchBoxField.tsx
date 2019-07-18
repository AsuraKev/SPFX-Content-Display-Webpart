import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

export interface ISwitchBoxProps {
    label: string;
    checked: boolean;
    onChange: (event: React.MouseEvent<HTMLElement>, checked?: boolean) => void;
    disabled: boolean;
}
export default class SwitchBox extends React.Component<ISwitchBoxProps, {}> {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    public render(): JSX.Element {
        const { checked, label, onChange, disabled } = this.props;
        return (
            <Toggle
                label={label}
                onText="On"
                offText="Off"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
        );
    }
}
