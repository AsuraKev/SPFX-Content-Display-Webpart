import { IDisplayTemplate } from '../../models/IDisplayTemplate';

export interface IDisplayTemplateService {
    getAllTemplates: () => Array<IDisplayTemplate>;
    getTemplateById: (id: string) => IDisplayTemplate;
}