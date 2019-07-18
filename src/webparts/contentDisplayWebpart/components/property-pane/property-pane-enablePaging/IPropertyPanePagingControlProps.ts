

export interface IPropertyPanePagingControlProps {
    key:string,
    label: string;
    disabled: boolean;
    checked: boolean;
    onSwitchBoxValueChange:(targetProperties:string, value:boolean) => void;
}