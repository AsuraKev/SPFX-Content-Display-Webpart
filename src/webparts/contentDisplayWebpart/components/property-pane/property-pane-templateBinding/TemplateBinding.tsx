import * as React from 'react';
import * as cx from 'classnames';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { ITemplateBinding } from '../../../models/ITemplateBinding';

export interface ITemplateBindingProps {
    property: string;
    value: string;
    options: IDropdownOption[];
    onBindingChange: (binding: ITemplateBinding) => void;
    label: string;
    disabled: boolean;
}

export interface ITemplateBindingState {

}

export default class TemplateBinding extends React.Component<ITemplateBindingProps, ITemplateBindingState>{

    constructor(props: ITemplateBindingProps) {
        super(props);
        this.state = {

        }
    }

    private handleChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) {
        const { property, onBindingChange } = this.props;
        var binding = {} as ITemplateBinding;
        binding.Property = property;
        binding.Value = option.key;
        onBindingChange(binding);
    }

    public render(): React.ReactElement<ITemplateBindingProps> {
        const { options, value, label ,disabled} = this.props;
        return <Dropdown
            options={options}
            selectedKey={value}
            label={label}
            disabled={disabled}
            onChange={this.handleChange.bind(this)}
        />;
    }

}