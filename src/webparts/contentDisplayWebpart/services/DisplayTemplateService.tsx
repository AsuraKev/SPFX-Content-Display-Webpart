import * as React from 'react';
import { IDisplayTemplate } from '../models/IDisplayTemplate';
import { IDisplayTemplateService } from './interfaces/IDisplayTemplateService';
import {
    TypeOneTemplate,
    TypeTwoTemplate,
    TypeThreeTemplate,
    TypeFourTemplate,
    TypeFiveTemplate,
    TypeSixTemplate,
    TypeSevenTemplate
}
    from '../components/templates/Templates';
import {
    TypeTwoTemplateMock,
    TypeOneTemplateMock,
    TypeThreeTemplateMock,
    TypeFourTemplateMock,
    TypeFiveTemplateMock,
    TypeSixTemplateMock,
    TypeSevenTemplateMock
} from '../components/templates/TemplateMocks';
import { templateProperties } from '../constants/constant';

// future improvement maybe include saving template in list and fetch
const displayTemplates: IDisplayTemplate[] = [
    {
        Name: 'template-type1',
        Id: 'b6408321-cb05-4e31-979b-dd000bc250f6',
        Properties: [
            templateProperties.title,
            templateProperties.icon,
            templateProperties.description,
            templateProperties.buttonText,
            templateProperties.buttonLink,
            templateProperties.titleLink],
        Preview: require('../asset/img/template01.png'),
        MockPreview: () => <TypeOneTemplateMock />,
        Render: (mapping: object) => <TypeOneTemplate {...mapping} />,
        preferContainerWidth: null
    },
    {
        Name: 'template-type2',
        Id: '94c897b4-2f7b-4b66-b811-d31ad2c0cfa1',
        Properties: [
            templateProperties.title,
            templateProperties.background,
            templateProperties.description,
            templateProperties.buttonText,
            templateProperties.buttonLink,
            templateProperties.icon],
        Preview: require('../asset/img/template02.png'),
        MockPreview: () => <TypeTwoTemplateMock />,
        Render: (mapping: object) => <TypeTwoTemplate {...mapping} />,
        preferContainerWidth: '350px'

    },
    {
        Name: 'Image',
        Id: 'db85f3fb-0194-446b-a546-556f4e5832da',
        Properties: [templateProperties.image],
        Preview: require('../asset/img/template03.png'),
        MockPreview: () => <TypeThreeTemplateMock />,
        Render: (mapping: object) => <TypeThreeTemplate {...mapping} />,
        preferContainerWidth: null

    },
    {
        Name: 'template-type4',
        Id: '2de9445a-8ddb-4102-b2f7-d9341c8a6358',
        Properties: [
            templateProperties.title,
            templateProperties.description,
            templateProperties.titleLink],
        Preview: require('../asset/img/template04.png'),
        MockPreview: () => <TypeFourTemplateMock />,
        Render: (mapping: object) => <TypeFourTemplate {...mapping} />,
        preferContainerWidth: '350px'

    },
    {
        Name: 'template-type5',
        Id: '5ea39760-ca1c-4abe-9902-c1969f3031b2',
        Properties: [
            templateProperties.title,
            templateProperties.icon,
            templateProperties.background,
            templateProperties.author,
            templateProperties.date,
            templateProperties.link
        ],
        Preview: require('../asset/img/template05.png'),
        MockPreview: () => <TypeFiveTemplateMock />,
        Render: (mapping: object) => <TypeFiveTemplate {...mapping} />,
        preferContainerWidth: '200px'
    },
    {
        Name: 'template-type6',
        Id: 'b0e3158b-c639-4975-a3f6-c56d7b61e735',
        Properties: [
            templateProperties.title,
            templateProperties.icon,
            templateProperties.background,
            templateProperties.buttonText,
            templateProperties.description,
            templateProperties.buttonLink
        ],
        Preview: require('../asset/img/template06.png'),
        MockPreview: () => <TypeSixTemplateMock />,
        Render: (mapping: object) => <TypeSixTemplate {...mapping} />,
        preferContainerWidth: '200px'
    },
    {
        Name: 'template-type7',
        Id: '4abefc0f-163a-489e-bbe9-c23c0052bfb5',
        Properties: [
            templateProperties.link,
            templateProperties.to,
            templateProperties.description,
            templateProperties.collections
        ],
        Preview: require('../asset/img/template07.png'),
        MockPreview: () => <TypeSevenTemplateMock />,
        Render: (mapping: object) => <TypeSevenTemplate {...mapping} />,
        preferContainerWidth: null
    }
]

export default class DisplayTemplateService implements IDisplayTemplateService {

    constructor() {

    }

    public getAllTemplates(): Array<IDisplayTemplate> {
        return displayTemplates;
    }

    public getTemplateById(id: string): IDisplayTemplate {
        return displayTemplates.filter(x => x.Id === id)[0];
    }
}