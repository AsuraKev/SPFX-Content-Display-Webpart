

import { IChoiceGroupOption} from 'office-ui-fabric-react/lib/ChoiceGroup';

export interface IPropertyPaneChoiceGroupProps {
    onChange : (propertyPath: string, newValue: any | any[]) => void,
    key: string,
    label:string
    controlId:string;
    selectedOption: string;
    loadOption:() => IChoiceGroupOption[];
}