import { IPersonaProps, IBasePickerSuggestionsProps, Label } from 'office-ui-fabric-react';

export interface IPeoplePickerService {
    getPeopleSuggestions:(siteUrl: string,filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) => Promise<IPersonaProps[]>
}