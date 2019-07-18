import * as React from 'react';
import * as cx from 'classnames';
import styles from './templateList.module.scss';
import { IDisplayTemplate } from './../../models/IDisplayTemplate';


export interface ITemplateListProps {
    onTemplateSave: (template: string) => void,
    currentActiveTemplate: string
    closeModal: () => void;
    templates: IDisplayTemplate[];
}

export interface ITemplateListState {
    currentTemplate: string;
}

export default class TemplateList extends React.Component<ITemplateListProps, ITemplateListState> {

    constructor(props: ITemplateListProps) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.handleTemplateSelect = this.handleTemplateSelect.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            currentTemplate: props.currentActiveTemplate
        }
    }

    public componentDidMount() {
    }

    public handleSave = () => {
        this.props.onTemplateSave(this.state.currentTemplate);
        this.props.closeModal();
    }

    public handleTemplateSelect = (templateId: string) => {
        this.setState({ currentTemplate: templateId });
    }

    public handleCancel = () => {
        const { closeModal } = this.props;
        closeModal();
    }


    public render(): React.ReactElement<ITemplateListProps> {
        const { currentTemplate } = this.state;
        const { currentActiveTemplate, closeModal, templates } = this.props;
        return (
            <div className={styles.wrapper}>
                <h1 className={styles['section-header']}>
                    <img src={require('../../asset/img/miscellaneous/templateStore.png')}/>
                    Display template store
                </h1>
                <div className={styles.content}>
                    <div className={styles['templates-container']}>
                        {
                            templates.map(template => {
                                return <Template
                                    onSave={this.handleSave}
                                    activeTemplate={currentTemplate}
                                    selectedTemplate={this.handleTemplateSelect}
                                    template={template}
                                />
                            })
                        }
                        <span className={styles['template-placeholder']}></span>
                        <span className={styles['template-placeholder']}></span>
                        <span className={styles['template-placeholder']}></span>
                        <span className={styles['template-placeholder']}></span>
                        <span className={styles['template-placeholder']}></span>
                    </div>
                    <div className={styles['action-panel']}>
                        <button type="button" onClick={this.handleSave} className={styles['save-btn']} disabled={currentTemplate === currentActiveTemplate}>Save</button>
                        <button type="button" onClick={this.handleCancel} className={styles['cancel-btn']}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

const Template = (props): JSX.Element => {
    var templateItemStyle = cx({
        [styles['template-item']]: true,
        [styles['template-selected']]: props.template.Id === props.activeTemplate
    });
    return (
        <div className={templateItemStyle} onClick={() => props.selectedTemplate(props.template.Id)}>
            <div className={styles['container']}>
                <span className={styles['select-indicator']}> </span>
                <img src={props.template.Preview} />
                <span className={styles['template-name']}>{props.template.Name}</span>
            </div>
        </div>
    );
}