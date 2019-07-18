import { IPeoplePickerService } from './interfaces/IPeoplePickerService';
import { IPersonaProps, IBasePickerSuggestionsProps, Label } from 'office-ui-fabric-react';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { sp, PrincipalType, PrincipalSource, PrincipalInfo } from "@pnp/sp";

export default class PeoplePickerService implements IPeoplePickerService {
	/***************************************************************************
     * The spHttpClient object used for performing REST calls to SharePoint
     ***************************************************************************/
    private spHttpClient: SPHttpClient;


	/**************************************************************************************************
     * Constructor
     * @param httpClient : The spHttpClient required to perform REST calls against SharePoint
     **************************************************************************************************/
    constructor(spHttpClient: SPHttpClient) {
        this.spHttpClient = spHttpClient;
    }

    public getPeopleSuggestions(siteUrl: string, filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): Promise<IPersonaProps[]> {

        return new Promise<any>((resolve, reject) => {
            sp.utility.searchPrincipals(filterText,
                PrincipalType.User,
                PrincipalSource.All,
                "",
                10).then((principals: PrincipalInfo[]) => {
                    var personas:IPersonaProps[] = [];
                    for (var i = 0; i < principals.length; i++) {
                        let currentPrincipal = principals[i];
                        let persona: IPersonaSharedProps = {
                            text: currentPrincipal.DisplayName,
                            secondaryText: currentPrincipal.JobTitle,
                        };
                        personas.push(persona);
                    }
                    resolve(personas);
                });
        })

    }

}