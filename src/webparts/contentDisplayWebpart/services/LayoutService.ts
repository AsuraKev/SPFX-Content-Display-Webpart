
import { ILayout } from '../models/ILayout';

export interface ILayoutService {
    getAllLayouts: () => ILayout[];
    getLayoutById: (id: string) => ILayout;
}

const layouts = [
    {
        Id: '5fa5c23f-9d95-4dd2-bd27-dba49261424a',
        IconName: 'List',
        Name: 'List'
    },
    {
        Id: '7be6236b-cb69-44bc-95ad-15679ed7bb23',
        IconName: 'GridViewSmall',
        Name: 'Grid'
    },
    {
        Id: '3e7110d1-8100-4e48-8a41-d91ca5dd9740',
        IconName: '',
        Name: 'Mansory'
    }

] as ILayout[];


export default class LayoutService implements ILayoutService {

    constructor(){
        
    }
    public getAllLayouts(): ILayout[] {
        return layouts;
    }

    public getLayoutById(id: string): ILayout {
        return layouts.filter(layout => layout.Id === id)[0];
    }

}