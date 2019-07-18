import * as React from 'react';
import * as cx from 'classnames';
import styles from './styles.module.scss';
import { Modal } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { getId } from 'office-ui-fabric-react/lib/Utilities';
import { IDisplayTemplate } from './../../../models/IDisplayTemplate';
import { ITemplatePickerProps } from './ITemplatePickerProps';
import TemplateList from '../../templates/TemplateList';
import DisplayTemplateService from '../../../services/DisplayTemplateService';
import { IDisplayTemplateService } from '../../../services/interfaces/IDisplayTemplateService';

export interface ITemplatePickerState {
    showModal: boolean;
    templates: IDisplayTemplate[];
}

export default class TemplatePickerField extends React.Component<ITemplatePickerProps, ITemplatePickerState> {
    private _titleId: string = getId('title');
    private _subtitleId: string = getId('subText');
    private _templateService: IDisplayTemplateService;

    constructor(props: ITemplatePickerProps) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTemplateSave = this.handleTemplateSave.bind(this);
        this._templateService = new DisplayTemplateService();
        this.state = {
            showModal: false,
            templates: []
        }
    }

    public componentDidMount() {
        const { getTemplates } = this.props;
        var templates = getTemplates();
        this.setState({ templates: templates });
    }

    public showModal() {
        this.setState({ showModal: true })
    }

    public closeModal() {
        this.setState({ showModal: false })
    }

    public handleTemplateSave(templateId: string) {
        this.props.onChange(templateId);
    }

    public render(): React.ReactElement<ITemplatePickerProps> {
        const { selectedTemplate } = this.props;
        const { templates } = this.state;
        var templateName = this._templateService.getTemplateById(selectedTemplate).Name;
        return (
            <div className={styles['field-wrapper']}>
                <Modal
                    titleAriaId={this._titleId}
                    subtitleAriaId={this._subtitleId}
                    isOpen={this.state.showModal}
                    onDismiss={this.closeModal}
                    isBlocking={true}
                    containerClassName={cx(styles['modal-container'], styles['modal-large'])}
                >
                    <TemplateList
                        onTemplateSave={this.handleTemplateSave}
                        currentActiveTemplate={this.props.selectedTemplate}
                        closeModal={this.closeModal}
                        templates={templates}
                    />
                </Modal>
                <div className={styles['field-container']}>
                    <TextField value={templateName} disabled={true} />
                    <button className={styles['field-picker']} type="button" onClick={this.showModal}>Pick a template</button>
                </div>
            </div>
        );
    }
}