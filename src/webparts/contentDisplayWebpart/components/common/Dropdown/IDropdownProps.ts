import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface IDropdownFieldProps {
    loadOption: () => Promise<IDropdownOption[]>;
    onChange: (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index?: number) => void;
    label: string;
    selectedKey: string;
    siteUrl:string;
    defaultOptions:IDropdownOption[];
    listName:string;
}