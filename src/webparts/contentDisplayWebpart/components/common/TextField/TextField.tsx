import * as React from 'react';
import * as ReactDom from 'react-dom';
import { debounce } from '@microsoft/sp-lodash-subset';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ITextFieldProps } from './ITextFieldProps';


export default class Text extends React.Component<ITextFieldProps, {}> {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }

    }
    public async componentDidMount() {

    }
    public render(): JSX.Element {
        const { onChange, label, value, validate } = this.props;
        return (
            <TextField
                label={label}
                onChange={debounce(onChange, 500)}
                value={value}
                onGetErrorMessage={validate}
                deferredValidationTime={500}
            />
        );
    }
}
