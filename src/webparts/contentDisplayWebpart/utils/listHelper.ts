import { IContentType } from './../models/IContentType';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IList } from '../models/IList';

export function convertContentTypeToDropdown(items:IContentType[]):IDropdownOption[]{
    var options = items.map(item => {
        return {
            text:item.Name,
            key:item.Id.StringValue
        }
    });

    options.unshift({text: 'All content types', key:'All'});
    return options;

}

