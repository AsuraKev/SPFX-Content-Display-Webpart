
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface IPropertyPaneOrderByProps {
    loadOption: () => Promise<IDropdownOption[]>;
    onChange : (targetProperty:string, value: any | any[]) => void;
    key: string;
    label:string;
    selectedKey: string;
    siteUrl:string;
    listName:string;
}


