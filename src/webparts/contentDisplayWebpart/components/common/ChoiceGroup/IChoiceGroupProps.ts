import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

export interface IChoiceGroupProps{
    label:string;
    selectedKey: string;
    onChange: (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => void;
    id:string;
    loadOption:() => IChoiceGroupOption[];
}